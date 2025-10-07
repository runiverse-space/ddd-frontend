<template>
    <div class="edit-container">
        <h1 class="title">내 정보 수정</h1>

        <!-- 프로필 영역 -->
        <div class="profile-section">
            <div class="profile-wrapper">
                <img :src="profileUrl || defaultProfile" class="profile-img" alt="profile" />
                <label for="file-input" class="camera-icon">
                    <CameraIconSolid class="icon" />
                </label>
                <input id="file-input" type="file" accept="image/*" @change="handleFileChange" />
            </div>
        </div>

        <!-- 개인정보 입력 -->
        <section class="section">
            <div class="form-group">
                <label>이름</label>
                <input v-model="form.userName" disabled />
            </div>

            <div class="form-group">
                <label>아이디</label>
                <input v-model="form.userLoginId" disabled />
            </div>

            <div class="form-group">
                <label>비밀번호</label>
                <input type="password" v-model="form.userPassword" placeholder="비밀번호를 입력합니다" />
            </div>

            <div class="form-group email-group">
                <label>이메일</label>
                <div class="email-row">
                    <input type="text" v-model="emailLocal" placeholder="이메일" />
                    <span>@</span>

                    <div class="email-domain-wrapper">
                        <div class="domain-select-box" @click="toggleDomainDropdown">
                            <template v-if="emailDomain === 'direct'">
                                <input v-model="emailCustomDomain" placeholder="직접입력" class="direct-input"
                                    @click.stop />
                            </template>
                            <template v-else>
                                {{ emailDomain || "선택하세요" }}
                            </template>
                            <ChevronDownIcon class="domain-icon" :class="{ open: isDomainOpen }" />
                        </div>

                        <div v-if="isDomainOpen" class="domain-dropdown">
                            <div v-for="domain in domainOptions" :key="domain" class="domain-option"
                                @click="selectDomain(domain)">
                                {{ domain }}
                            </div>
                            <div class="domain-option" @click="selectDomain('direct')">직접입력</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 기술 스택 태그 -->
        <section class="section">
            <h5 class="section-title">기술 스택</h5>
            <!-- <p class="tag-desc">태그는 프로젝트의 목적과 방향을 빠르게 이해할 수 있도록 도와줍니다.</p> -->
            <TagSelector v-model="selectedTags" tagType="USER" />
        </section>

        <!-- 버튼 -->
        <div class="submit-box">
            <button class="submit-btn" @click="handleUpdate">수정하기</button>
            <button class="cancel-btn" @click="goBack">취소</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { CameraIcon as CameraIconSolid } from "@heroicons/vue/24/solid";
import usersApi from "@/apis/usersApi";
import tagApi from "@/apis/tagApi";
import TagSelector from "@/components/TagSelector.vue";
import store from "@/store";
import defaultProfileImg from "@/assets/default-profile.png";

const userId = store.state.userId;
const defaultProfile = defaultProfileImg;

const form = ref({
    userId: "",
    userLoginId: "",
    userName: "",
    userPassword: "",
    userEmail: "",
});

const profileUrl = ref("");
const file = ref(null);
const selectedTags = ref([]);

// 이메일 입력 관련
const emailLocal = ref("");
const emailDomain = ref("");
const emailCustomDomain = ref("");
const isDomainOpen = ref(false);
const domainOptions = ["gmail.com", "naver.com", "daum.net", "kakao.com"];

function toggleDomainDropdown() {
    isDomainOpen.value = !isDomainOpen.value;
}
function selectDomain(domain) {
    emailDomain.value = domain;
    isDomainOpen.value = false;
    if (domain !== "direct") emailCustomDomain.value = "";
}
function handleClickOutside(e) {
    if (!e.target.closest(".domain-select-box")) {
        isDomainOpen.value = false;
    }
}

// 기존 사용자 정보 불러오기
async function loadUserData() {
    try {
        const res = await usersApi.usersDetailById(userId);
        const data = res.data.data || res.data;

        form.value = {
            userId: data.userId,
            userLoginId: data.userLoginId,
            userName: data.userName,
            userPassword: "",
            userEmail: data.userEmail,
        };

        // ✅ 이메일 자동 분리
        if (data.userEmail && data.userEmail.includes("@")) {
            const [local, domain] = data.userEmail.split("@");
            emailLocal.value = local;

            if (domainOptions.includes(domain)) {
                emailDomain.value = domain;
            } else {
                emailDomain.value = "direct";
                emailCustomDomain.value = domain;
            }
        }

        // 프로필 이미지
        try {
            const imgRes = await usersApi.ufAttachDownload(userId);
            const blob = new Blob([imgRes.data], {
                type: imgRes.headers["content-type"],
            });
            profileUrl.value = URL.createObjectURL(blob);
        } catch {
            profileUrl.value = defaultProfile;
        }

        // 태그 불러오기
        const tagRes = await tagApi.getUserTags(userId);
        selectedTags.value =
            tagRes.data.tags?.map((t) => ({ tagId: t.tagId, tagName: t.tagName })) || [];
    } catch (e) {
        console.error("❌ 유저 데이터 불러오기 실패:", e);
    }
}

// 프로필 변경
function handleFileChange(e) {
    const selected = e.target.files[0];
    if (selected) {
        file.value = selected;
        profileUrl.value = URL.createObjectURL(selected);
    }
}

// 정보 수정 요청
async function handleUpdate() {
    const domain =
        emailDomain.value === "direct" ? emailCustomDomain.value : emailDomain.value;
    const fullEmail = `${emailLocal.value}@${domain}`;

    const updateData = new FormData();
    updateData.append("userId", form.value.userId);
    updateData.append("userEmail", fullEmail);
    updateData.append("userIntro", form.value.userIntro || "");
    updateData.append("userPassword", form.value.userPassword || "");
    if (file.value) updateData.append("ufAttach", file.value);
    updateData.append("tagIds", selectedTags.value.map((t) => t.tagId));

    try {
        const res = await usersApi.usersUpdate(updateData);
        if (res.data.result === "success") {
            alert(res.data.message); // ✅ "회원 정보가 성공적으로 수정되었습니다."
            console.log("updated user:", res.data.user);
            console.log("updated tags:", res.data.tags);
            window.location.reload();
        } else {
            alert("❌ " + res.data.message);
        }
    } catch (err) {
        console.error("❌ 수정 실패:", err);
        alert("정보 수정 중 오류가 발생했습니다.");
    }
}

function goBack() {
    window.history.back();
}

// Lifecycle
onMounted(() => {
    loadUserData();
    window.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
    window.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.edit-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 20px;
}

.title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 30px;
}

label {
    font-weight: 700;
    color: #111;
    display: block;
    margin-bottom: 6px;
}

/* 프로필 이미지 */
.profile-section {
    text-align: start;
    margin-bottom: 30px;
}

.profile-wrapper {
    position: relative;
    display: inline-block;
}

.profile-img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ddd;
}

.camera-icon {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #fff;
    border-radius: 50%;
    border: 1px solid #ddd;
    padding: 6px;
    cursor: pointer;
}

.icon {
    width: 20px;
    height: 20px;
    color: #333;
}

#file-input {
    display: none;
}

/* 폼 */
.section {
    margin-bottom: 35px;
}

.form-group {
    margin-bottom: 15px;
}

input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: #fff;
}

input[disabled] {
    background-color: #f5f5f5;
    color: #888;
    cursor: not-allowed;
}

textarea {
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 10px;
}

.email-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.email-row input[type="text"]:first-child {
    flex: 0 0 50%;
}

.email-domain-wrapper {
    position: relative;
    flex: 1;
}

.domain-select-box {
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background-color: #fff;
}

.direct-input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 1rem;
    color: #111;
    cursor: text;

    /* ✅ 추가 부분 */
    padding: 0;
    line-height: normal;
    height: 22px;
    /* 높이 통일 */
    display: flex;
    align-items: center;
}


.domain-dropdown {
    border: 1px solid #ddd;
    border-radius: 6px;
    background: #fff;
    position: absolute;
    width: 100%;
    top: 45px;
    z-index: 10;
}

.domain-option {
    padding: 10px;
    cursor: pointer;
}

.domain-option:hover {
    background-color: #f5f5f5;
}

.domain-icon {
    width: 18px;
    height: 18px;
    color: #555;
    cursor: pointer;
    transition: transform 0.2s;
}

.domain-icon.open {
    transform: rotate(180deg);
}

/* 버튼 */
.submit-box {
    text-align: center;
    margin-top: 30px;
}

.submit-btn {
    background: #000;
    color: #fff;
    padding: 10px 25px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1rem;
    margin-right: 10px;
}

.cancel-btn {
    background: #ccc;
    color: #fff;
    padding: 10px 25px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1rem;
}
</style>
