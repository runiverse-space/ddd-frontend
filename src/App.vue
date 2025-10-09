<template>

  <div class="d-flex flex-column vh-100">
    <RouterView />
  </div>

  <!-- 모달 루트 추가 -->
  <div id="modal-root"></div>
</template>

<script setup>
import { RouterView } from 'vue-router';

</script>

<style scoped>
/* Bootstrap의 기본 모달 z-index보다 항상 위로 */
#modal-root {
  position: relative;
  z-index: 9999;
}
</style>
