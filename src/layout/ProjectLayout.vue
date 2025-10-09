<template>
  <!--왼쪽 사이드바-->
  <div class="project-layout">
    <aside class="sidebar">
      <!-- 메인 -->
      <RouterLink :to="{ name: 'ProjectHome', params: { projectId: props.projectId } }" class="menu-item">
        <HomeIcon class="menu-icon" />
        <span>메인</span>
      </RouterLink>

      <!-- 일정 -->
      <RouterLink :to="{ name: 'ScheduleHome', params: { projectId: props.projectId } }" class="menu-item">
        <CalendarIcon class="menu-icon" />
        <span>일정</span>
      </RouterLink>

      <!-- 회고 -->
      <RouterLink :to="{ name: 'RetrospecHome', params: { projectId: props.projectId } }" class="menu-item">
        <DocumentTextIcon class="menu-icon" />
        <span>회고</span>
      </RouterLink>

      <!-- 지식창고 -->
      <RouterLink :to="{ name: 'KnowledgeHome', params: { projectId: props.projectId } }" class="menu-item">
        <CommandLineIcon class="menu-icon" />
        <span>지식창고</span>
      </RouterLink>
    </aside>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<!--컴포넌트의 초기화 또는 이벤트 처리-->
<script setup>
import { HomeIcon, CalendarIcon, DocumentTextIcon, CommandLineIcon } from "@heroicons/vue/24/outline";

import { RouterView } from 'vue-router';
import { RouterLink } from 'vue-router';

const props = defineProps(['projectId']);
</script>

<style scoped>
.project-layout {
  display: flex;
  padding: 0px;
}

.project-layout main {
  flex: 1;
  width: 100%;
  max-width: none;
  padding-right: 0;
  overflow: visible !important;
  position: static !important;
}

.sidebar {
  width: 160px;
  /* 사이드바 너비 */
  padding: 20px 20px;
  margin-right: 40px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  /* 메뉴 간격 */
  background-color: #fff;
}

.menu-item {
  display: flex;
  align-items: center;
  /* 아이콘과 텍스트 수직 가운데 정렬 */
  gap: 12px;
  /* 아이콘과 텍스트 간격 */
  text-decoration: none;
  color: black;
  font-size: 15px;
  font-weight: 700;
}

.menu-item:hover {
  color: #6759F4;
  /* hover 시 파란색 */
}

.menu-icon {
  width: 24px;
  height: 24px;
}
</style>