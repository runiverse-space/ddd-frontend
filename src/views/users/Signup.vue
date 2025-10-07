<template>
  <div class="signup-container">
    <h1 class="title">회원가입</h1>

    <!-- 개인정보 입력 -->
    <section class="section">
      <h3 class="section-title">
        개인정보입력
        <span class="required-text">(*필수입력)</span>
      </h3>

      <div class="form-group">
        <label>아이디 <span class="required">*</span></label>
        <input v-model="form.userLoginId" placeholder="이름을 입력합니다" />
      </div>

      <div class="form-group">
        <label>비밀번호 <span class="required">*</span></label>
        <input type="password" v-model="form.userPassword" placeholder="비밀번호를 입력합니다" />
      </div>

      <div class="form-group">
        <label>이름 <span class="required">*</span></label>
        <input v-model="form.userName" placeholder="이름을 입력합니다" />
      </div>

      <!-- 이메일 입력 -->
      <div class="form-group email-group">
        <label>이메일 <span class="required">*</span></label>
        <div class="email-row">
          <input type="text" v-model="emailLocal" placeholder="이메일" />
          <span>@</span>

          <!-- 이메일 선택 or 직접입력 -->
          <div class="email-domain-wrapper">
            <div class="domain-select-box" @click="toggleDomainDropdown">
              <template v-if="emailDomain === 'direct'">
                <input v-model="emailCustomDomain" placeholder="직접입력" class="direct-input" @click.stop />
              </template>
              <template v-else>
                {{ emailDomain || '선택하세요' }}
              </template>
              <ChevronDownIcon class="domain-icon" :class="{ open: isDomainOpen }" />
            </div>

            <div v-if="isDomainOpen" class="domain-dropdown">
              <div v-for="domain in domainOptions" :key="domain" class="domain-option" @click="selectDomain(domain)">
                {{ domain }}
              </div>
              <div class="domain-option" @click="selectDomain('direct')">직접입력</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 태그 선택 -->
    <section class="section">
      <h3 class="section-title">기술 스택에 대한 태그를 추가해 주세요</h3>
      <p class="tag-desc">태그는 프로젝트의 목적과 방향을 빠르게 이해할 수 있도록 도와줍니다.</p>

      <!-- 태그 props -->
      <TagSelector v-model="selectedTags" tagType="USER" />
    </section>

    <!-- 버튼 -->
    <div class="submit-box">
      <button class="submit-btn" @click="handleSubmit">가입하기</button>
      <button class="cancel-btn" @click="goBack">취소</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import usersApi from "@/apis/usersApi";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import TagSelector from "@/components/TagSelector.vue";

/* ----------------------------
   기본 회원가입 폼 데이터
---------------------------- */
const form = ref({
  userLoginId: "",
  userPassword: "",
  userName: "",
  userEmail: "",
  userIntro: "",
});

/* ----------------------------
   이메일 입력 관련 로직
---------------------------- */
const emailLocal = ref("");
const emailDomain = ref("");
const emailCustomDomain = ref("");
const isDomainOpen = ref(false);
const domainOptions = ["gmail.com", "naver.com", "daum.net", "kakao.com"];

function toggleDomainDropdown() {
  isDomainOpen.value = !isDomainOpen.value;
}

function selectDomain(domain) {
  emailDomain.value = domain;
  isDomainOpen.value = false;
  if (domain !== "direct") emailCustomDomain.value = "";
}

/* ----------------------------
   태그 선택 (TagSelector 연동)
---------------------------- */
const selectedTags = ref([]);

/* ----------------------------
   외부 클릭 감지 (이메일만 처리)
---------------------------- */
function handleClickOutside(e) {
  if (!e.target.closest(".domain-select-box")) {
    isDomainOpen.value = false;
  }
}

onMounted(() => {
  window.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutside);
});

/* ----------------------------
   회원가입 처리
---------------------------- */
async function handleSubmit() {
  const domain = emailDomain.value === "direct" ? emailCustomDomain.value : emailDomain.value;
  form.value.userEmail = `${emailLocal.value}@${domain}`;

  if (!form.value.userLoginId || !form.value.userPassword || !form.value.userName || !form.value.userEmail) {
    alert("필수 항목을 모두 입력해주세요.");
    return;
  }

  const signupData = {
    user: form.value,
    tagIds: selectedTags.value.map((t) => t.tagId),
  };

  try {
    const res = await usersApi.usersCreate(signupData);
    if (res.data.result === "success") {
      alert("회원가입이 완료되었습니다!");
      window.location.href = "/login";
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.error(err);
    alert("회원가입 중 오류가 발생했습니다.");
  }
}

function goBack() {
  window.history.back();
}
</script>

<style scoped>
.signup-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 30px;
}

.section {
  margin-bottom: 35px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 15px;
}

.required-text {
  font-size: 0.85rem;
  color: #bb0003;
  font-weight: 500;
}

label {
  font-weight: 700;
  display: block;
  margin-bottom: 6px;
}

.required {
  color: #bb0003;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #fff;
  outline: none;
}

/* 이메일 입력 */
.email-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.email-row input[type="text"]:first-child {
  flex: 0 0 50%;
}

.email-domain-wrapper {
  position: relative;
  flex: 1;
}

.domain-select-box {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: #fff;
}

.direct-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: #111;
  cursor: text;

  /* ✅ 추가 부분 */
  padding: 0;
  line-height: normal;
  height: 22px;
  /* 높이 통일 */
  display: flex;
  align-items: center;
}


.domain-dropdown {
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  position: absolute;
  width: 100%;
  top: 45px;
  z-index: 10;
}

.domain-option {
  padding: 10px;
  cursor: pointer;
}

.domain-option:hover {
  background-color: #f5f5f5;
}

.domain-icon {
  width: 18px;
  height: 18px;
  color: #555;
  cursor: pointer;
  transition: transform 0.2s;
}

.domain-icon.open {
  transform: rotate(180deg);
}

/* 버튼 */
.submit-box {
  text-align: center;
  margin-top: 30px;
}

.submit-btn {
  background-color: #000;
  color: #fff;
  padding: 10px 25px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 10px;
}

.cancel-btn {
  background-color: #ccc;
  color: #fff;
  padding: 10px 25px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
}

.submit-btn:hover {
  opacity: 0.9;
}
</style>
