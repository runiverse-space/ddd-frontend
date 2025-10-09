<template>
  <div class="explore-page">
    <!-- 🔹 왼쪽: 프로젝트 / 멤버 -->
    <div class="left-panel">
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

    <!-- 🔹 오른쪽: 알림 -->
    <div class="right-panel">
      <NotificationList />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ExploreProject from "./ExploreProject.vue";
import ExploreUser from "./ExploreUser.vue";
import NotificationList from "./NotificationList.vue";

const activeTab = ref("project");
</script>

<style scoped>
.explore-page {
  display: grid;
  grid-template-columns: 3fr 1fr;
  /* 왼쪽(탭 영역) 3 : 오른쪽(알림 영역) 1 */
  gap: 32px;
  width: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
}

/* 왼쪽 영역 */
.left-panel {
  display: flex;
  flex-direction: column;
}

/* 탭 버튼 영역 */
.tab-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.tab-header button {
  background: transparent;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  color: #999;
  padding: 8px 0;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
}

.tab-header button:hover {
  color: #6759F4;
}

.tab-header button.active {
  color: #000;
  border-bottom: 3px solid #000;
}

/* 오른쪽 알림 영역 */
.right-panel {
  background: #fafafa;
  border-left: 1px solid #eee;
  padding: 20px;
  border-radius: 10px;
  min-width: 300px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
</style>
