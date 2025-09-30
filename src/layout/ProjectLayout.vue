<template>
    <div class="project-layout">
        <!-- 좌측 사이드 -->
        <aside class="sidebar">
            <RouterLink :to="{ name: 'ProjectHome', params: { projectId: props.projectId } }">홈</RouterLink>
            <RouterLink :to="{ name: 'ScheduleHome', params: { projectId: props.projectId } }">일정</RouterLink>
            <RouterLink :to="{ name: 'RetrospecHome', params: { projectId: props.projectId } }">회고</RouterLink>
            <RouterLink :to="{ name: 'KnowledgeHome', params: { projectId: props.projectId } }">지식창고</RouterLink>
        </aside>

        <!-- 우측 메인 -->
        <main class="main-content">
            <RouterView />
        </main>
    </div>
</template>

<script setup>
// props 객체로 받기
const props = defineProps(['projectId']) 
</script>

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
</style>