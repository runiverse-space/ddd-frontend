<template>
  <header class="header">
    <div class="header-container">
      <!-- 왼쪽: 로고 -->
      <div class="logo">
        <RouterLink to="/">
          <img src="@/assets/ddd.png" alt="DDD Logo" />
        </RouterLink>
      </div>

      <!-- 가운데: 메뉴 -->
      <nav class="nav-center">
        <RouterLink to="/">홈</RouterLink>
        <RouterLink to="/explore">탐색</RouterLink>
        <RouterLink to="/community">커뮤니티</RouterLink>
        <RouterLink to="/project">프로젝트</RouterLink>
      </nav>

      <!-- 오른쪽: 버튼 -->
      <div class="auth-buttons" v-if="store.state.userId === ''">
        <button class="btn signup" @click="handleSignUp()">회원가입</button>
        <button class="btn login" @click="handleLogin()">로그인</button>
      </div>

      <div class="auth-buttons" v-if="store.state.userId !== ''">
        <button class="btn edit" @click="handleEditUser()">내 정보 수정</button>
        <button class="btn logout" @click="handleLogout()">로그아웃</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { RouterLink, useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

function handleSignUp() {
  router.push("/signup");
}

function handleLogin() {
  router.push("/login");
}

function handleLogout() {
  store.dispatch("removeAuth");
}
</script>

<style scoped>
.header {
  background: #fff;
  border-bottom: 1px solid #ddd;
  padding: 20px 40px;
  /* 헤더 위아래 여백 */
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 로고 */
.logo {
  text-decoration: none;
  /* 밑줄 제거 */
  cursor: pointer;
  /* 마우스 오버 시 손가락 모양 */
}

.logo img {
  height: 24px;
  /* 로고 실제 크기 */
  display: block;
  /* 이미지 밑 여백 제거 */
}

/* 가운데 메뉴 */
.nav-center {
  display: flex;
  gap: 40px;
  font-weight: 600;
}

.nav-center a {
  text-decoration: none;
  color: #000;
}

.nav-center a:hover {
  color: #6759F4;
}

/* 버튼 공통 */
.auth-buttons {
  display: flex;
  gap: 10px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  border-radius: 20px;
  /* 둥근 모양 */
  font-size: 14px;
  cursor: pointer;
  border: none;
  font-weight: 500;
}

/* 버튼별 색상 */
.signup {
  background: #f1f1f1;
  color: #000;
}

.login {
  background: #222;
  color: #fff;
}

.edit {
  background: #3498db;
  color: #fff;
}

.logout {
  background: #e74c3c;
  color: #fff;
}

/* hover 효과 */
.signup:hover {
  background: #e0e0e0;
}

.login:hover {
  background: #6759F4;
  color: #fff;
}

.edit:hover {
  background: #2980b9;
}

.logout:hover {
  background: #c0392b;
}
</style>
