<template>
    <div class="retrospec-list">
        <div v-for="retro in retrospecs" :key="retro.retroId" class="retrospec-item">
            <h3 class="title">{{ retro.retrospecTitle }}</h3>
            <p class="preview">{{ retro.retrospecContent }}</p>

            <div class="meta">
                <!-- ✅ 프로필 이미지 -->
                <img v-if="retro.profileUrl" :src="retro.profileUrl" alt="profile" class="profile-img" />

                <div class="author">
                    <span class="by">by</span>
                    <span class="name">
                        {{ retro.userName || "알 수 없는 사용자" }}
                        <span v-if="retro.userId === currentUserId"></span>
                    </span>
                </div>

                <span class="date">{{ formatDate(retro.retrospecStartAt) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import retrospecApi from "@/apis/retrospecApi";
import usersApi from "@/apis/usersApi";

const route = useRoute();
const store = useStore();
const retrospecs = ref([]);

/* ✅ 현재 로그인 사용자 ID */
const currentUserId = store.getters.getUserId;

/* ✅ 날짜 포맷 함수 */
function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

/* ✅ 회고 목록 + 작성자 정보 붙이기 */
onMounted(async () => {
    const projectId = route.params.projectId;

    try {
        // 1️⃣ 해당 프로젝트 회고 목록 가져오기
        const { data } = await retrospecApi.getRetrospecList(projectId);
        retrospecs.value = data;

        for (const retro of retrospecs.value) {
            try {
                const profileRes = await usersApi.ufAttachDownload(retro.userId);
                retro.profileUrl = URL.createObjectURL(profileRes.data);
            } catch {
                retro.profileUrl = "/images/default-profile.png";
            }

            try {
                const userRes = await usersApi.usersDetailById(retro.userId);
                console.log("📡 작성자 응답:", userRes.data);
                // ✅ JSON 구조 안의 data에 유저 정보가 들어 있음
                retro.userName = userRes.data.data.userName;
                retro.userEmail = userRes.data.data.userEmail;
            } catch (err) {
                console.error("❌ 유저정보 불러오기 실패:", err);
                retro.userName = "알 수 없는 사용자";
            }
        }

        console.log("✅ 최종 회고 목록 (작성자 포함):", retrospecs.value);
    } catch (error) {
        console.error("❌ 회고 목록 불러오기 실패:", error);
    }
});
</script>

<style scoped>
.retrospec-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.retrospec-item {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: 20px;
}

.title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 10px;
}

.preview {
    font-size: 0.9rem;
    color: #555;
    margin-bottom: 12px;
}

.meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    color: #777;
}

.profile-img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
}

.author .name {
    font-weight: 500;
    color: #333;
}

.date {
    margin-left: auto;
    font-size: 0.8rem;
    color: #aaa;
}
</style>
