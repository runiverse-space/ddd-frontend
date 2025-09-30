<template>
  <div class="container my-5">
    <form @submit.prevent="handleSubmit()">
      <!-- 다른 회원가입 입력 필드들... -->
      <div class="row">
        <!-- 왼쪽: 개인정보 입력 -->
        <div class="col-md-7">
          <h5 class="fw-bold mb-3">개인정보입력 <span class="text-danger small">(필수입력)</span></h5>

          <!-- 아이디 -->
          <div class="mb-5 text-start">
            <label class="form-label">아이디 <span class="text-danger">*</span></label>
            <input type="text" class="form-control" placeholder="이름을 입력합니다" />
          </div>

          <!-- 비밀번호 -->
          <div class="mb-5 text-start">
            <label class="form-label">비밀번호 <span class="text-danger">*</span></label>
            <input type="password" class="form-control" placeholder="비밀번호를 입력합니다" />
          </div>

          <!-- 이름 -->
          <div class="mb-5 text-start">
            <label class="form-label">이름 <span class="text-danger">*</span></label>
            <input type="text" class="form-control" placeholder="이름을 입력합니다" />
          </div>

          <!-- 이메일 -->
          <div class="row mb-5 text-start">
            <div class="col">
              <label class="form-label">이메일 <span class="text-danger">*</span></label>
              <div class="input-group">
                <input type="text" class="form-control" placeholder="이메일" />
                <span class="input-group-text">@</span>
                <input type="text" class="form-control" placeholder="직접입력" />
                <!-- <select class="form-select">
                <option>선택하세요</option>
                <option>gmail.com</option>
                <option>naver.com</option>
                <option>daum.net</option>
              </select> -->
              </div>
            </div>
          </div>

          <!-- 태그 -->

        </div>

        <!-- 오른쪽: 약관 동의 -->
        <div class="col-md-5">
          <h5 class="fw-bold mb-3">약관 동의</h5>
          <div class="border rounded p-3 mb-3">
            <div class="form-check mb-2">
              <input class="form-check-input" type="checkbox" id="agreeAll" />
              <label class="form-check-label fw-bold" for="agreeAll">전체 약관 동의</label>
            </div>
            <div class="form-check mb-1">
              <input class="form-check-input" type="checkbox" id="agreeAge" />
              <label class="form-check-label" for="agreeAge">만 14세 이상입니다 (필수)</label>
            </div>
            <div class="form-check mb-1">
              <input class="form-check-input" type="checkbox" id="agreePrivacy" />
              <label class="form-check-label" for="agreePrivacy">개인정보 수집, 이용 동의 (필수)</label>
            </div>
            <div class="form-check mb-1">
              <input class="form-check-input" type="checkbox" id="agreeMarketing" />
              <label class="form-check-label" for="agreeMarketing">마케팅 수신 동의 (선택)</label>
            </div>
            <small class="text-muted">* 필수항목에 동의하지 않으면 서비스 가입이 불가합니다.</small>
          </div>

          <!-- 개인정보 유효기간 선택 -->
          <div class="mb-3">
            <label class="form-label">개인정보 유효기간 선택</label>
            <div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="period" id="period1" />
                <label class="form-check-label" for="period1">1년</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="period" id="period3" />
                <label class="form-check-label" for="period3">3년</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="period" id="periodUnlimited" />
                <label class="form-check-label" for="periodUnlimited">회원탈퇴시</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 기술 스택 선택 -->
      <TagSelector v-model="form.skills" label="사용 기술 스택" />

      <button type="submit" class="btn btn-success mt-3">회원가입</button>
    </form>
  </div>

</template>

<script setup>
import { ref } from "vue";
import TagSelector from "@/components/TagSelector.vue";

const form = ref({
  username: "",
  email: "",
  password: "",
  skills: [],
});

function handleSubmit() {

}
</script>
