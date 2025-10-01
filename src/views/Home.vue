<!--컴포넌트의 UI-->
<template>
  <div class="home">
    <img src="@/assets/home-ddd.png" alt="DDD-home" />
  </div>
</template>

<!--컴포넌트의 초기화 또는 이벤트 처리-->
<script setup>
</script>

<style scoped>
.home {
  width: 100%;
  /* 가로 화면에 꽉 맞춤 */
  overflow-x: hidden;
  /* 가로 스크롤 방지 */
  overflow-y: hidden;
}

.home img {
  width: 100%;
  /* 가로는 항상 100% */
  height: auto;
  /* 세로는 비율 유지 */
  display: block;
  /* 이미지 밑 여백 제거 */
}
</style>