<template>
    <h1>{{ props.projectId }}번 째 프로젝트</h1>
</template>

<script setup>
// 라우터에서 넘겨준 projectId 받기
const props = defineProps(['projectId']) 
</script>