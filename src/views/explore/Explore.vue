<template>
  <div class="explore-page">
    <div class="tab-header">
      <button :class="{ active: activeTab === 'project' }" @click="activeTab = 'project'">
        프로젝트
      </button>
      <button :class="{ active: activeTab === 'user' }" @click="activeTab = 'user'">
        멤버
      </button>
    </div>

    <div class="tab-content">
      <ExploreProject v-if="activeTab === 'project'" />
      <ExploreUser v-else />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ExploreProject from "./ExploreProject.vue";
import ExploreUser from "./ExploreUser.vue";

const activeTab = ref("project");
</script>

<style scoped>
.explore-page {
  width: 100%;
  padding: 20px 40px;
}

/* 탭 헤더 */
.tab-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  /* 아래 라인 고정으로 위치 흔들림 방지 */
}

/* 버튼 공통 스타일 */
.tab-header button {
  background: transparent;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  color: #999;
  transition: color 0.2s ease, border-bottom 0.2s ease;
  padding: 8px 0;
  /* 높이 고정 */
  border-bottom: 3px solid transparent;
  /* 라인 고정 */
}

/* hover 시 */
.tab-header button:hover {
  color: #6759F4;
}

/* 활성화된 탭 */
.tab-header button.active {
  color: #000;
  border-bottom: 3px solid #000;
  /* 현재 탭 표시 */
}

/* 태그 전체적으로 작게 */
.tab-header button {
  font-size: 0.95rem;
}
</style>
