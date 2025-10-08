<template>
  <div class="retrospec-page">
    <!-- 상단 탭 헤더 -->
    <div class="tab-header">
      <!-- ✅ 캘린더 / 리스트 탭 (프로젝트/멤버 스타일 동일) -->
      <button class="tab-btn" :class="{ active: activeTab === 'calendar' }" @click="activeTab = 'calendar'">
        캘린더
      </button>

      <button class="tab-btn" :class="{ active: activeTab === 'list' }" @click="activeTab = 'list'">
        리스트
      </button>

      <!-- ✅ 오른쪽 끝의 회고 작성 버튼 -->
      <button class="write-btn" @click="goWritePage">
        회고 작성하기
      </button>
    </div>

    <!-- 콘텐츠 -->
    <div class="tab-content">
      <RetrospecCalendar v-if="activeTab === 'calendar'" :retrospecs="retrospecs" />
      <RetrospecList v-else :retrospecs="retrospecs" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import retrospecApi from "@/apis/retrospecApi";
import usersApi from "@/apis/usersApi";
import RetrospecCalendar from "./RetrospecCalendar.vue";
import RetrospecList from "./RetrospecList.vue";

const retrospecs = ref([]);
const activeTab = ref("calendar");
const route = useRoute();
const router = useRouter();

function goWritePage() {
  router.push({
    name: "RetrospecWrite",
    params: { projectId: route.params.projectId },
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
</script>

<style scoped>
.retrospec-page {
  width: 100%;
  padding: 20px 40px;
}

/* 🔹탭 헤더 전체 영역 */
.tab-header {
  display: flex;
  align-items: flex-end;
  /* 밑줄 기준선 맞춤 */
  gap: 20px;
  border-bottom: 1px solid #eee;
  /* 회색 기본선 */
  position: relative;
  margin-bottom: 20px;
}

/* ✅ 캘린더 / 리스트 버튼 → explore 탭 스타일 동일 */
.tab-header .tab-btn {
  background: transparent;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  color: #999;
  transition: color 0.2s ease, border-bottom 0.2s ease;
  padding: 8px 0;
  border-bottom: 3px solid transparent;
}

.tab-header .tab-btn:hover {
  color: #6759f4;
}

.tab-header .tab-btn.active {
  color: #000;
  border-bottom: 3px solid #000;
}

/* ✅ 오른쪽 끝 회고 작성 버튼 */
.tab-header .write-btn {
  margin-left: auto;
  margin-bottom: 10px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.25s ease;
}

.tab-header .write-btn:hover {
  background: #4d3df0;
}
</style>
