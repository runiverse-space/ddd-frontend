<!--컴포넌트의 UI-->
<template>
  <!-- 상단 공통 헤더 -->
  <header class="header">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">&lt;DDD/&gt;</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <RouterLink class="nav-link active" aria-current="page" to="/">홈</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link active" aria-current="page" to="/explore">탐색</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link active" aria-current="page" to="/community">커뮤니티</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link active" aria-current="page" to="/project">프로젝트</RouterLink>
            </li>

          </ul>
          <div class="d-flex" v-if="store.state.user === ''">
            <button class="btn btn-dark btn-sm m-2" @click="handleSignUp()">회원가입</button>
            <button class="btn active btn-sm m-2" @click="handleLogin()">로그인</button>
          </div>

          <div class="d-flex" v-if="store.state.user !== ''">
            <!-- <button class="btn btn-dark btn-sm m-2" @click="handleSignUp()">회원가입</button> -->
            <button class="btn disabled btn-sm m-2" @click="handleEditUser()">내 정보 수정</button>
            <button class="btn active btn-sm m-2" @click="handleLogout()">로그아웃</button>
          </div>
        </div>
      </div>

      
    </nav>
  </header>
</template>

<!--컴포넌트의 초기화 또는 이벤트 처리-->
<script setup>

import { RouterLink, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();

const store = useStore();

// 회원가입 페이지로 이동
function handleSignUp() {
  router.push("/signup");
}

// 로그인 페이지로 이동
function handleLogin() {
  router.push("/login");
}

// 내 정보 수정 페이지로 이동
function handleEditUser() {
  
}

// 로그아웃
function handleLogout() {
  store.dispatch("removeAuth")
}

</script>
<!--컴포넌트의 스타일 정의-->

<!--<style scoped>


.header {
  /* 헤더 배경색 */
  background: #f8f8f8;
  /* 안쪽 여백 */
  padding: 15px;
  /* 시각적 분리 */
  border-bottom: 1px solid #ddd;
}

nav {
  /* 가로 레이아웃 */
  display: flex;
  /* 링크 사이 간격 */
  gap: 50px;
  /* 중앙 정렬 */
  justify-content: center;
}

</style>-->