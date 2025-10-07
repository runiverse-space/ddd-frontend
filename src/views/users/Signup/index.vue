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
      <p class="tag-desc">
        태그는 프로젝트의 목적과 방향을 빠르게 이해할 수 있도록 도와줍니다.
      </p>

      <div ref="dropdownRef">
        <div class="tag-select-box" :class="{ open: isDropdownOpen }" @click="toggleDropdown">
          <div class="selected-tags">
            <template v-if="selectedTags.length > 0">
              <span v-for="tag in selectedTags" :key="tag.tagId" class="tag-pill"
                :style="{ backgroundColor: tagColors[tag.tagName] || '#fff' }">
                {{ tag.tagName }}
                <XMarkIcon class="remove-icon" @click.stop="removeTag(tag.tagId)" />
              </span>
            </template>
            <span v-else class="placeholder">태그를 선택하세요</span>
          </div>
          <ChevronDownIcon class="chevron-icon" :class="{ open: isDropdownOpen }" />
        </div>

        <div v-if="isDropdownOpen" class="tag-dropdown">
          <hr class="tag-divider" />
          <p class="tag-limit">최대 3개까지 선택 가능합니다.</p>

          <div class="tag-list">
            <div v-for="tag in availableTags" :key="tag.tagId" class="tag-option"
              :class="{ selected: selectedTags.some((t) => t.tagId === tag.tagId) }" @click="toggleTag(tag)">
              {{ tag.tagName }}
            </div>
          </div>
        </div>
      </div>
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
import tagApi from "@/apis/tagApi";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";

const form = ref({
  userLoginId: "",
  userPassword: "",
  userName: "",
  userEmail: "",
  userIntro: "",
});

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

const availableTags = ref([]);
const selectedTags = ref([]);
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

const tagColors = {
  Backend: "#CFE2FF",
  Frontend: "#E7E9FF",
  Vue: "#E6DAFF",
  React: "#FFE6F2",
  Java: "#FFF1E6",
  Spring: "#E6FFF0",
};

onMounted(async () => {
  try {
    const res = await tagApi.getTagsByType("USER");
    availableTags.value = res.data;
  } catch (err) {
    console.error("태그 불러오기 실패:", err);
  }

  window.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutside);
});

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isDropdownOpen.value = false;
  }
  if (!e.target.closest(".domain-select-box")) {
    isDomainOpen.value = false;
  }
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function toggleTag(tag) {
  const exists = selectedTags.value.some((t) => t.tagId === tag.tagId);
  if (exists) {
    selectedTags.value = selectedTags.value.filter((t) => t.tagId !== tag.tagId);
  } else {
    if (selectedTags.value.length >= 3) {
      alert("태그는 최대 3개까지 선택할 수 있습니다.");
      return;
    }
    selectedTags.value.push(tag);
  }
}

function removeTag(tagId) {
  selectedTags.value = selectedTags.value.filter((t) => t.tagId !== tagId);
}

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
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: #111;
  cursor: text;
  padding: 0;
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

/* 태그 선택 */
.tag-select-box {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  position: relative;
  min-height: 46px;
  background-color: #fff;
  transition: all 0.2s ease;
}

.tag-select-box.open {
  border-bottom: none;
  border-radius: 8px 8px 0 0;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.placeholder {
  color: 555;
  /* 더 옅은 회색으로 변경 */
  font-size: 0.95rem;
  font-weight: 400;
  background: transparent;
  /* 배경 투명 명시 */
  box-shadow: none;
  /* 혹시 브라우저 기본 그림자 제거 */
  border: none;
}

.tag-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 20px;
  border: 1px solid #ddd;
  font-size: 0.9rem;
  color: #111;
  background-color: #fff;
}

.remove-icon {
  width: 16px;
  height: 16px;
  cursor: pointer;
  color: #555;
}

.chevron-icon {
  width: 20px;
  height: 20px;
  color: #666;
  transition: transform 0.25s ease;
}

.chevron-icon.open {
  transform: rotate(180deg);
}

/* 드롭다운 */
.tag-dropdown {
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 6px 10px 12px;
  background-color: #fff;
}

.tag-divider {
  border: none;
  border-top: 1.5px solid #999;
  width: 100%;
  margin: 4px 0 6px;
}

.tag-limit {
  color: #888;
  font-size: 0.85rem;
  margin: 0 0 6px 3px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-option {
  padding: 8px 14px;
  border: 1px solid #ccc;
  border-radius: 20px;
  cursor: pointer;
  background-color: #f8f8f8;
  font-size: 0.9rem;
  transition: background 0.2s ease;
}

.tag-option:hover {
  background-color: #eee;
}

.tag-option.selected {
  background-color: #000;
  color: #fff;
  border-color: #000;
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
