<!--컴포넌트의 UI-->
<template>
  <!-- 기본 레이아웃: 홈/탐색/커뮤니티에서 공통 사용 -->
    <div class="default-layout">
        <AppHeader />

        <main>
            <!-- child route를 이 위치에 렌더링 (Home/Explore/community) -->
            <RouterView />
            <!-- 홈/탐색/커뮤니티 내용 표시-->
        </main>
    </div>
</template>

<!--컴포넌트의 초기화 또는 이벤트 처리-->
<script setup>
import AppHeader from '@/components/AppHeader.vue';
import { RouterView } from 'vue-router';



</script>
<!--컴포넌트의 스타일 정의-->
<style scoped>
 
</style>