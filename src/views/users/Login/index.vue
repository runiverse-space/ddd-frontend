<template>
  <div class="container d-flex flex-column justify-content-center align-items-center vh-100">
    <!-- 로고 -->
    <h1 class="fw-bold mb-5">&lt;DDD/&gt;</h1>

    <!-- 로그인 폼 -->
    <form class="w-50" @submit.prevent="handleSubmit()">
      <div class="form-floating mb-3">
        <input type="text" class="form-control" id="loginId" v-model="loginForm.userLoginId" />
        <label for="loginId">아이디</label>
      </div>

      <div class="form-floating mb-3">
        <input type="password" class="form-control" id="loginPw" v-model="loginForm.userPassword" />
        <label for="loginPw">비밀번호</label>
      </div>

      <span v-if="loginFail" class="text-danger">로그인 정보가 맞지 않습니다</span>

      <!-- 로그인 버튼 -->
      <button type="submit" class="btn btn-dark w-100 py-2 mb-3">로그인</button>

      <!-- 하단 링크 -->
      <div class="text-center small text-muted">
        <RouterLink to="/signup" class="text-muted text-decoration-none">회원가입</RouterLink>
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
      console.log(result);
      loginFail.value = false;
      store.dispatch("saveAuth", result);
      router.push("/");
    } else {
      console.log(result);
      loginFail.value = true;
    }
  } catch (error) {
    console.log(error);
  }
}
</script>
