<template>
    <div class="retrospec-list">
        <div v-for="retro in retrospecs" :key="retro.retroId" class="retrospec-item" @click="goDetail(retro.retroId)">
            <h3 class="title">{{ retro.retrospecTitle }}</h3>
            <p class="preview">{{ extractPreview(retro.retrospecContent) }}</p>

            <div class="meta">
                <div class="author">
                    <img :src="retro.profileUrl || '/images/default-profile.png'" alt="profile" class="profile-img" />
                    <span>by</span>
                    <span class="author-name">{{ retro.userName || '알 수 없는 사용자' }}</span>
                </div>
                <span class="date">{{ formatDate(retro.retrospecStartAt) }}</span>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import retrospecApi from "@/apis/retrospecApi";
import usersApi from "@/apis/usersApi";

const route = useRoute();
const router = useRouter();
const retrospecs = ref([]);

/* ✅ 날짜 포맷 */
const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }) : "";

/* ✅ 내용 미리보기 */
const extractPreview = (md) =>
    md ? md.replace(/[#>*_`]/g, "").replace(/\n+/g, " ").trim() : "";

const goDetail = (retroId) => {
    router.push({
        name: "RetrospecDetail",
        params: { projectId: route.params.projectId, retroId },
        query: { tab: "list" }, // ✅ 리스트에서만 쿼리 추가
    });
};

/* ✅ 목록 불러오기 */
onMounted(async () => {
    try {
        const { data } = await retrospecApi.getRetrospecList(route.params.projectId);
        retrospecs.value = await Promise.all(
            data.map(async (retro) => {
                try {
                    const profileRes = await usersApi.ufAttachDownload(retro.userId);
                    const userRes = await usersApi.usersDetailById(retro.userId);
                    return {
                        ...retro,
                        profileUrl: URL.createObjectURL(profileRes.data),
                        userName: userRes.data.data.userName,
                    };
                } catch {
                    return { ...retro, profileUrl: "/images/default-profile.png", userName: "알 수 없는 사용자" };
                }
            })
        );
    } catch (err) {
        console.error("❌ 회고 목록 불러오기 실패:", err);
    }
});
</script>

<style scoped>
.retrospec-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

/* 카드 */
.retrospec-item {
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
    cursor: pointer;
    transition: background 0.2s ease;
}

.retrospec-item:hover {
    background: #fafafa;
}

/* 제목 */
.title {
    font-size: 1.2rem;
    font-weight: 800;
    color: #111;
    margin-bottom: 8px;
}

/* ✅ 미리보기 (3줄) */
.preview {
    font-size: 0.8rem;
    color: #444;
    line-height: 1.4;
    margin-bottom: 10px;

    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-word;

    max-width: 70%;
}

/* 메타 (프로필 + 작성자 + 날짜) */
.meta {
    display: flex;
    align-items: center;
    /* ✅ 전체 세로 중앙 정렬 */
    justify-content: space-between;
    margin-top: 15px;
}

/* 왼쪽 영역 */
.author {
    display: flex;
    align-items: center;
    /* ✅ 이미지와 텍스트 높이 중앙 정렬 */
    gap: 8px;
    font-size: 0.85rem;
    color: #777;
    line-height: 1;
    /* ✅ 텍스트 높이 줄여서 정확히 가운데 */
}

/* 프로필 이미지 */
.profile-img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
}

/* by 텍스트 */
.author span:first-of-type {
    color: #777;
    font-weight: 500;
    font-size: 0.75rem;
    line-height: 1;
    /* ✅ 세로 균형 */
    display: flex;
    align-items: center;
    /* ✅ 폰트 기준선 보정 */
    margin-left: 4px;
}

/* 작성자명 */
.author-name {
    color: #000;
    font-weight: 700;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    /* ✅ by와 동일 높이 */
    line-height: 1;
}

/* 날짜 */
.date {
    color: #b3b3b3;
    font-size: 0.85rem;
}
</style>
