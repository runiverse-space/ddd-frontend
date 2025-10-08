<template>
    <div class="user-tab">
        <!-- ✅ 상단 검색창 -->
        <div class="header-row">
            <div class="search-box">
                <MagnifyingGlassIcon class="icon" />
                <input type="text" placeholder="유저 검색" v-model="searchTerm" @input="onSearch" />
            </div>
        </div>

        <!-- 👥 전체 멤버 카드 -->
        <div class="user-grid">
            <div v-for="user in allUsers" :key="user.userId" class="user-card">
                <!-- 상단: 프로필 + 이름 + 버튼 -->
                <div class="card-top">
                    <img :src="user.profileUrl" alt="profile" class="profile-img" />
                    <div class="user-info">
                        <h4 class="name">{{ user.userName }}</h4>
                    </div>
                    <button class="invite-btn">초대하기</button>
                </div>

                <!-- 유저 태그 -->
                <div class="tags">
                    <span v-for="tag in user.tags" :key="tag" class="tag">
                        {{ tag }}
                    </span>
                </div>

                <!-- 한마디 -->
                <p class="oneline">{{ user.userIntro || "한마디를 작성해주세요." }}</p>
            </div>
        </div>

        <p v-if="allUsers.length === 0" class="empty-text">
            표시할 유저가 없습니다.
        </p>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import usersApi from "@/apis/usersApi";
import tagApi from "@/apis/tagApi";
import defaultImgSrc from "@/assets/default-profile.png";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline"; // ✅ 아이콘 추가

const allUsers = ref([]);
const originalUsers = ref([]);
const defaultImg = defaultImgSrc;
const searchTerm = ref("");

const onSearch = async () => {
    const keyword = searchTerm.value.trim();

    // ✅ 입력이 완전히 비어 있으면 전체 유저 다시 불러오기
    if (keyword === "") {
        allUsers.value = originalUsers.value;
        return;
    }

    try {
        const res = await usersApi.usersSearch(keyword);
        if (res.data.result === "success") {
            const users = res.data.data;

            // ✅ 검색 결과가 없으면 전체 복원 X
            if (!users || users.length === 0) {
                allUsers.value = []; // ❌ 전체유저 복구 금지
                return;
            }

            // ✅ 검색 결과 있을 때만 표시
            for (const user of users) {
                try {
                    const imgRes = await usersApi.ufAttachDownload(user.userId);
                    const blobUrl = URL.createObjectURL(imgRes.data);
                    user.profileUrl = blobUrl;
                } catch {
                    user.profileUrl = defaultImg;
                }

                const tagRes = await tagApi.getUserTags(user.userId);
                user.tags = (tagRes.data.tags || []).map((t) => t.tagName);
            }

            allUsers.value = users;
        }
    } catch (err) {
        console.error("유저 검색 실패:", err);
    }
};


onMounted(async () => {
    try {
        const res = await usersApi.usersSearch("");
        if (res.data.result === "success") {
            const users = res.data.data;
            for (const user of users) {
                try {
                    const imgRes = await usersApi.ufAttachDownload(user.userId);
                    const blobUrl = URL.createObjectURL(imgRes.data);
                    user.profileUrl = blobUrl;
                } catch {
                    user.profileUrl = defaultImg;
                }

                const tagRes = await tagApi.getUserTags(user.userId);
                user.tags = (tagRes.data.tags || []).map((t) => t.tagName);
            }
            allUsers.value = users;
            originalUsers.value = users;
        }
    } catch (err) {
        console.error("유저 전체 조회 실패:", err);
    }
});
</script>

<style scoped>
.user-tab {
    width: 100%;
    padding: 0px;
    margin-top: 20px;
}

/* ✅ 검색창 */
.header-row {
    display: flex;
    justify-content: flex-start;
    /* 왼쪽 정렬 */
    margin-bottom: 30px;
}

.search-box {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 250px;
    padding: 7px 10px;
    border: 1.5px solid #ccc;
    border-radius: 50px;
    background: #fff;
    transition: all 0.2s ease;
}

.search-box:hover {
    border-color: #aaa;
}

.search-box:focus-within {
    border-color: #6759f4;
    /* 포커스 시 포인트 컬러 */
}

.search-box .icon {
    width: 15px;
    height: 15px;
    color: #999;
    flex-shrink: 0;
    margin-left: 4px;
}

.search-box input {
    border: none;
    outline: none;
    flex-grow: 1;
    font-size: 0.8rem;
    color: #333;
}

.search-box input::placeholder {
    color: #aaa;
}

/* ✅ 유저 카드 그리드 */
.user-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    /* column-gap: 10px; */
    row-gap: 35px;
    justify-items: center;
}

/* ✅ 카드 스타일 */
.user-card {
    max-width: 300px;
    width: 100%;
    min-height: 160px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    transition: all 0.2s ease;
}

.user-card:hover {
    box-shadow: 0 5px 14px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

/* ✅ 상단: 프로필 + 이름 + 초대 버튼 */
.card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.profile-img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    object-fit: cover;
}

.user-info {
    flex-grow: 1;
}

.name {
    font-weight: 700;
    color: #111;
    font-size: 1rem;
    margin: 0;
}

/* ✅ 초대 버튼 */
.invite-btn {
    border: 1px solid #bbb;
    background: #fff;
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 0.8rem;
    cursor: pointer;
    white-space: nowrap;
    line-height: 1.3;
    vertical-align: middle;
}

.invite-btn:hover {
    border-color: #000;
}

/* ✅ 유저 태그 */
.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 15px;
}

.tag {
    background: #000;
    color: #fff;
    border-radius: 5px;
    padding: 6px 12px;
    font-size: 0.65rem;
    font-weight: 500;
    line-height: 1.3;
    display: inline-block;
    white-space: nowrap;
}

/* ✅ 한마디 */
.oneline {
    margin-top: 20px;
    /* 위쪽 여백만 살짝 줄임 */
    margin-bottom: 0;
    /* ✅ 하단 여백 완전 제거 */
    color: #555;
    font-size: 0.8rem;
    line-height: 1.4;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}


/* ✅ 빈 상태 */
.empty-text {
    text-align: center;
    color: #aaa;
    font-size: 0.9rem;
    margin-top: 40px;
}
</style>
