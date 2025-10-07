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
  padding: 40px 80px;
}

.tab-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.tab-header button {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  color: #999;
  transition: 0.2s;
}

.tab-header button.active {
  color: #000;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 8px 16px;
}
</style>
