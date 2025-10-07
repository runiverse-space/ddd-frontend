<template>
    <div class="user-tab">
        <!-- 헤더: 제목 + 검색 -->
        <div class="header-row">
            <h2 class="title">프로젝트를 함께 할 사용자들을 찾을 수 있습니다.</h2>
            <UserSearch @update:results="handleSearchResults" />
        </div>

        <!-- 👥 전체 멤버 카드 -->
        <div class="user-grid">
            <div v-for="user in allUsers" :key="user.userId" class="user-card">
                <!-- 상단: 프로필 + 이름 + 버튼 한 줄 -->
                <div class="profile-row">
                    <img :src="user.profileUrl" alt="profile" class="profile-img" />
                    <div class="name-area">
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
import UserSearch from "./UserSearch.vue";

const allUsers = ref([]);
const defaultImg = defaultImgSrc;

const handleSearchResults = (results) => {
    allUsers.value = results.length > 0 ? results : originalUsers.value;
};
const originalUsers = ref([]);

onMounted(async () => {
    try {
        // ✅ 검색어 없이 호출하면 전체 목록 반환됨
        const res = await usersApi.usersSearch("");

        if (res.data.result === "success") {
            const users = res.data.data;

            // 프로필 + 태그 처리
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
    padding: 0 40px;
    margin-top: 20px;
}

/* ===========================
   ✅ 상단 헤더 (제목 + 검색창)
=========================== */
.header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.title {
    font-size: 1rem;
    font-weight: 500;
}

/* ===========================
   👥 유저 카드 스타일
=========================== */
.user-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    justify-content: flex-start;
}

.user-card {
    width: 240px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    padding: 16px;
    display: flex;
    flex-direction: column;
}

/* ✅ 프로필 + 이름 + 버튼 한 줄 */
.profile-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
}

.profile-img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    object-fit: cover;
}

.name-area {
    flex-grow: 1;
}

.name {
    font-weight: 600;
    font-size: 1rem;
}

/* ✅ 초대 버튼 */
.invite-btn {
    border: 1px solid #bbb;
    background: #fff;
    border-radius: 20px;
    padding: 3px 10px;
    font-size: 0.85rem;
    cursor: pointer;
    white-space: nowrap;
}

.invite-btn:hover {
    border-color: #000;
}

/* ✅ 유저 태그 */
.tags {
    display: flex;
    gap: 6px;
    margin-top: 8px;
    flex-wrap: wrap;
}

.tag {
    background: #f3f1ff;
    color: #6b4fe7;
    border-radius: 8px;
    padding: 3px 8px;
    font-size: 0.75rem;
}

/* ✅ 한마디 */
.oneline {
    margin-top: 8px;
    font-size: 0.85rem;
    color: #666;
}

/* ✅ 빈 상태 */
.empty-text {
    text-align: center;
    color: #aaa;
    font-size: 0.9rem;
    margin-top: 40px;
}
</style>
