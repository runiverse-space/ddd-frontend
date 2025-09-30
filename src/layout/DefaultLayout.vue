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

<script setup>
// 공통 헤더 import
import AppHeader from '@/components/AppHeader.vue'
</script>