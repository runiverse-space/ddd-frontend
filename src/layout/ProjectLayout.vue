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

import { RouterView } from "vue-router";
import { RouterLink } from "vue-router";

const props = defineProps(["projectId"]);
</script>

<style scoped>
/* ✅ 레이아웃 전체 */
.project-layout {
  display: flex;
  width: 97%;
  min-height: 100vh;
  background: #fff;
  box-sizing: border-box;
}

/* ✅ 사이드바 */
.sidebar {
  width: 260px;
  flex-shrink: 0;
  padding: 10px 50px; /* 위·아래 / 좌·우 패딩 */
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 왼쪽 정렬 */
  gap: 24px; /* 메뉴 간격 */
  background: #fff;
  border-right: 1px #eee;
  position: sticky;
  top: 0;
  height: 100vh;
  box-sizing: border-box;
}

/* ✅ 메인 콘텐츠 */
.project-layout main {
  flex: 1;
  width: 100%;
  max-width: 1800px; /* 전체 너비 제한 */
  margin: 0 auto;
  padding: 0px; /* 내부 여백 */
  box-sizing: border-box;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: #fff;
}

/* ✅ 메뉴 항목 */
.menu-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  text-decoration: none;
  color: #000;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s ease;
}
.menu-item:hover {
  color: #6759f4;
}

/* ✅ 아이콘 */
.menu-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}
</style>
