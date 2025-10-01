<template>
  <div class="retrospec-page">
    <!-- 뷰 전환 버튼 -->
    <div class="view-toggle">
      <button :class="{ active: viewMode === 'calendar' }" @click="viewMode = 'calendar'">
        캘린더
      </button>
      <button :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">
        리스트
      </button>
      <!-- 회고 작성하기 버튼 -->
      <button @click="goWritePage">
        회고 작성하기
      </button>
    </div>

    <!-- 리스트 뷰 -->
    <div v-if="viewMode === 'list'" class="retrospec-list">
      <div v-for="retro in retrospecs" :key="retro.retroId" class="retrospec-item">
        <h3 class="title">{{ retro.retrospecTitle }}</h3>
        <p class="preview">{{ retro.retrospecContent }}</p>
        <div class="meta">
          <img v-if="retro.profileUrl" :src="retro.profileUrl" alt="profile" class="profile-img" />
          <div class="author">
            <span class="by">by</span>
            <span class="name">{{ retro.userName }}</span>
          </div>
          <span class="date">{{ formatDate(retro.retrospecStartAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import retrospecApi from "@/apis/retrospecApi";
import usersApi from "@/apis/usersApi";

const retrospecs = ref([]);
const viewMode = ref("list");
const route = useRoute();
const router = useRouter();

function goWritePage() {
  router.push({
    name: "RetrospecWrite",
    params: { projectId: route.params.projectId }, // 프로젝트별 회고 작성
  });
}

onMounted(async () => {
  const projectId = route.params.projectId;
  const res = await retrospecApi.getRetrospecList(projectId);
  retrospecs.value = res.data;

  for (const retro of retrospecs.value) {
    try {
      const detailRes = await usersApi.usersDetail(retro.userId);
      retro.userName = detailRes.data.data.userName;

      const imgRes = await usersApi.ufAttachDownload(retro.userId);
      retro.profileUrl = URL.createObjectURL(imgRes.data);
    } catch {
      retro.userName = "알 수 없음";
      retro.profileUrl = null;
    }
  }
});

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}. ${String(d.getDate()).padStart(2, "0")}`;
}
</script>

<style scoped>
.retrospec-page {
  padding: 20px;
  width: 100%;
  /* 전체 폭 사용 */
  max-width: 1200px;
  /* 원하는 최대 폭 */
  margin: 0 auto;
  /* 가운데 정렬 */
}

.view-toggle {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.view-toggle button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  border-radius: 20px;
  margin-bottom: 20px;
}

.view-toggle .active {
  background: #000;
  color: #fff;
}

.retrospec-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.retrospec-item {
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
  width: 80%;
  /* 아이템이 페이지 폭 꽉 채우기 */
}

.title {
  font-weight: 700;
  margin-bottom: 6px;
}

.preview {
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
}

.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
}

.profile-img {
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  border-radius: 50%;
  object-fit: cover;
  display: inline-block;
}

.author .name {
  font-weight: 600;
  margin-left: 4px;
}

.date {
  margin-left: auto;
  font-size: 12px;
  color: #999;
}
</style>
