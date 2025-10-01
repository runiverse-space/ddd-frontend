<template>
  <div class="login-container">
    <!-- 로고 -->
    <div class="logo-box">
      <img src="@/assets/ddd.png" alt="DDD 로고" class="logo mb-4" />
    </div>

    <!-- 로그인 폼 -->
    <form class="login-form" @submit.prevent="handleSubmit()">
      <input type="text" placeholder="아이디" id="loginId" v-model="loginForm.userLoginId" class="login-input" />
      <input type="password" placeholder="비밀번호" id="loginPw" v-model="loginForm.userPassword" class="login-input" />

      <span v-if="loginFail" class="error-msg">로그인 정보가 맞지 않습니다</span>

      <button type="submit" class="login-btn">로그인</button>

      <!-- 하단 링크 -->
      <div class="login-links">
        <RouterLink to="/find-password" class="link">비밀번호 찾기</RouterLink>
        <span>|</span>
        <RouterLink to="/find-id" class="link">아이디 찾기</RouterLink>
        <span>|</span>
        <RouterLink to="/signup" class="link">회원가입</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import usersApi from '@/apis/usersApi';
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

let loginFail = ref(false);

const loginForm = ref({
  userLoginId: "",
  userPassword: ""
});

async function handleSubmit() {
  try {
    const data = structuredClone(loginForm.value);
    const response = await usersApi.usersLogin(data);
    const result = response.data;
    if (result.result === "success") {
      loginFail.value = false;
      store.dispatch("saveAuth", result);
      router.push("/");
    } else {
      loginFail.value = true;
    }
  } catch (error) {
    console.log(error);
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 폼은 중앙 */
  justify-content: center;
  min-height: 70vh;
  background: #fff;
}

.logo-box {
  width: 320px;
  /* 폼과 동일 너비 */
  display: flex;
  justify-content: flex-start;
  /* 왼쪽 정렬 */
  margin-left: -10px;
  margin-bottom: 40px;
}

.logo {
  width: 180px;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 380px;
}

.login-input {
  width: 100%;
  height: 50px;
  padding: 0 15px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
}

.login-input:focus {
  border-color: #000;
}

.error-msg {
  color: #BB0003;
  font-size: 13px;
  margin-bottom: 10px;
}

.login-btn {
  width: 100%;
  height: 55px;
  background: #111;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 50px;
}

.login-btn:hover {
  background: #000;
}

.login-links {
  display: flex;
  gap: 25px;
  justify-content: center;
  font-size: 11px;
  color: #aaa;
}

.login-links .link {
  color: #aaa;
  text-decoration: none;
}

.login-links .link:hover {
  text-decoration: underline;
}
</style>