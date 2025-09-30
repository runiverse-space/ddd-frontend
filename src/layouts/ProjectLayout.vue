<!--컴포넌트의 UI-->
<template>
  <!--왼쪽 사이드바-->
  <div class="project-layout d-flex vh-100 ">
    
      <aside class="sidebar">
        <button class="btn btn-dark  btn-lg col-md-12  mt-3 pt-3 fw-bold fs-4 color-white">
         <!-- <RouterLink :to="{ name: 'ProjectHome', params: { projectId: props.projectId } }">홈</RouterLink>-->
          <RouterLink :to="{ name: 'ProjectHome' }">홈</RouterLink>
        </button>

        <button class="btn btn-dark  btn-lg col-xxl-12  mt-3  pt-3 justify-content-center fw-bold fs-4 color-white">
        <RouterLink :to="{ name: 'ScheduleHome', params: { projectId: props.projectId } }">일정</RouterLink>
        </button>

        <button class="btn btn-dark  btn-lg col-xxl-12 mt-3  pt-3 fw-bold fs-4 color-white">
        <RouterLink :to="{ name: 'RetrospecHome', params: { projectId: props.projectId } }">회고</RouterLink>
        </button>

        <button class="btn btn-dark  btn-lg col-xxl-12 mt-3  pt-3 fw-bold fs-4 color-white">
        <RouterLink :to="{ name: 'KnowledgeHome', params: { projectId: props.projectId } }">지식창고</RouterLink>
        </button>
      </aside>

      <div>
        <RouterView />
      </div>


    
  </div>

</template>

<!--컴포넌트의 초기화 또는 이벤트 처리-->
<script setup>
import { RouterView } from 'vue-router';
import { RouterLink } from 'vue-router';

const props = defineProps(['projectId']);



</script>
<!--컴포넌트의 스타일 정의-->
<style scoped>
/* 세로 방향으로 헤더(위) + 콘텐츠(아래) 배치 */
.project-layout {
  /* 레이아웃 컨테이너 */
  display: flex;
  /* 가로 배치 */
  flex-direction: row;
}

/* 좌측 사이드바 스타일 */
.sidebar {
  /* 사이드 영역 고정 폭 */
  width: 200px;
  /* 본문과 시각적 분리 */
  border-right: 1px solid #ddd;
  /* 내부 여백 */
  padding: 20px;
  /* 위 여백을 추가하여 링크들을 더 아래 배치 */
  padding-top: 60px;
}

/* 사이드바 링크를 세로 목록으로 배치 */
.sidebar a {
  /* 블록화하여 전체 폭 클릭 가능 */
  display: block;
  /* 항목 간 간격 */
  margin-bottom: 12px;
}

/* 우측 본문 영역: 남은 공간을 모두 차지 */
.main-content {
  /* 가변 폭으로 확장 */
  flex: 1;
  /* 내부 여백 */
  padding: 20px;
}
/* RouterLink 기본 스타일 제거 및 흰색 적용 */
a {
  text-decoration: none; /* 밑줄 제거 */
  color: white; /* 흰색 글씨 */
}
/* hover 상태도 흰색 유지 */
a:hover {
  color: white;
}
/* visited 상태도 흰색 유지 */
a:visited {
  color: white;
}



</style>