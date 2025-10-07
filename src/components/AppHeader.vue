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
        <RouterLink to="/">메인</RouterLink>
        <RouterLink to="/explore">탐색</RouterLink>
        <RouterLink to="/community">커뮤니티</RouterLink>
        <RouterLink to="/project">프로젝트</RouterLink>
      </nav>

      <!-- 오른쪽: 로그인 전 -->
      <div class="auth-buttons" v-if="!isLoggedIn">
        <button class="btn login" @click="handleLogin()">로그인</button>
      </div>

      <!-- 오른쪽: 로그인 후 -->
      <div class="user-menu" v-else>
        <img :src="userProfileUrl || defaultProfile" alt="Profile" class="profile-img" />
        <div class="user-actions">
          <span class="edit-text" @click="handleEditUser()">내 정보 수정</span>
          <span class="dot">•</span>
          <span class="logout-text" @click="handleLogout()">
            <ArrowRightStartOnRectangleIcon class="logout-icon" />
            로그아웃
          </span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { RouterLink, useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, computed, onMounted } from "vue";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/vue/24/outline";
import usersApi from "@/apis/usersApi";

const router = useRouter();
const store = useStore();

const isLoggedIn = computed(() => store.state.userId !== "");
const userProfileUrl = ref("");
const defaultProfile = new URL("@/assets/default-profile.png", import.meta.url).href;

// 프로필 이미지(blob) 가져오기
async function loadUserProfile() {
  try {
    if (!store.state.userId) return;
    const response = await usersApi.ufAttachDownload(store.state.userId);
    if (response && response.data) {
      const blob = new Blob([response.data]);
      userProfileUrl.value = URL.createObjectURL(blob);
    } else {
      userProfileUrl.value = defaultProfile;
    }
  } catch (error) {
    console.warn("⚠️ 프로필 이미지 로드 실패:", error);
    userProfileUrl.value = defaultProfile;
  }
}

onMounted(() => {
  if (isLoggedIn.value) loadUserProfile();
});

function handleLogin() {
  router.push("/login");
}

function handleLogout() {
  store.dispatch("removeAuth");
  router.push("/");
}

function handleEditUser() {
  router.push("/edit");
}
</script>

<style scoped>
.header {
  background: #fff;
  border-bottom: 1px solid #ddd;
  padding: 20px 40px;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 로고 */
.logo img {
  height: 24px;
  display: block;
  cursor: pointer;
}

/* 메뉴 */
.nav-center {
  display: flex;
  gap: 60px;
  font-weight: 600;
}

.nav-center a {
  text-decoration: none;
  color: #000;
}

.nav-center a:hover {
  color: #6759f4;
}

/* 로그인 버튼 */
.auth-buttons {
  display: flex;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  font-weight: 500;
}

.login {
  background: #222;
  color: #fff;
}

.login:hover {
  background: #6759f4;
  color: #fff
}

/* 로그인 후: 유저 영역 */
.user-menu {
  display: flex;
  align-items: center;
  gap: 14px;
}

.profile-img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ddd;
}

/* 텍스트 스타일 */
.user-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #000;
  font-weight: 500;
}

.user-actions span {
  cursor: pointer;
}

.user-actions .dot {
  font-weight: 700;
}

.edit-text:hover,
.logout-text:hover {
  color: #6759f4;
}

/* 로그아웃 아이콘 */
.logout-icon {
  width: 15px;
  height: 15px;
  margin-right: 2px;
  vertical-align: middle;
}
</style>
