<template>
  <div class="container my-5">
    <form @submit.prevent="handleSubmit()">
      <!-- 다른 회원가입 입력 필드들... -->
      <div class="row">
        <!-- 왼쪽: 개인정보 입력 -->
        <div class="col-md-7">
          <h5 class="fw-bold mb-3">개인정보입력 <span class="text-danger small">(필수입력)</span></h5>

          <!-- 아이디 -->
          <div class="mb-3">
            <label class="form-label">아이디 <span class="text-danger">*</span></label>
            <input type="text" class="form-control" placeholder="이름을 입력합니다" v-model="users.userLoginId" />
          </div>

          <!-- 비밀번호 -->
          <div class="mb-3">
            <label class="form-label">비밀번호 <span class="text-danger">*</span></label>
            <input type="password" class="form-control" placeholder="비밀번호를 입력합니다" v-model="users.userPassword" />
          </div>

          <!-- 이름 -->
          <div class="mb-3">
            <label class="form-label">이름 <span class="text-danger">*</span></label>
            <input type="text" class="form-control" placeholder="이름을 입력합니다" v-model="users.userName" />
          </div>

          <!-- 이메일 -->
          <div class="mb-3">
            <label class="form-label">이메일 <span class="text-danger">*</span></label>
            <input type="email" class="form-control" placeholder="이메일을 입력합니다" v-model="users.userEmail" />
          </div>

          <!-- 자기 소개 -->
          <div class="mb-3">
            <label class="form-label">자기 소개</label>
            <input type="text" class="form-control" placeholder="소개글을 입력하세요" v-model="users.userIntro" />
          </div>

          <div class="input-group mb-2">
            <label for="ufAttach" class="col-sm-2 col-form-label">첨부그림</label>
            <div class="col-sm-10">
              <input type="file" class="form-control-file" ref="ufAttach" />
            </div>
          </div>

          <!-- 기술 스택 선택 -->
          <TagSelector label="사용 기술 스택" @tagEvent="handleTagEvent()"/>

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

            <div class="my-5 justify-content-end">
              <button type="submit" class="btn btn-dark m-2">가입하기</button>
              <button type="button" class="btn btn-success m-2" @click="handleReset()">재작성</button>
            </div>

          </div>
        </div>
      </div>



    </form>
  </div>

</template>

<script setup>
import { ref } from "vue";
import TagSelector from "@/components/TagSelector.vue";
import usersApi from "@/apis/usersApi";

// 상태 정의
const users = ref({
  userLoginId: "user1",
  userPassword: "abc123!!",
  userName: "사용자1",
  userEmail: "user1@mycompany.com",
  userIntro: "aaaa",
});

const ufAttach = ref(null);

async function handleSubmit() {
  // 멀티파트 객체 생성
  const formData = new FormData();
  // 문자파트 추가
  formData.append("userLoginId", users.value.userLoginId);
  formData.append("userPassword", users.value.userPassword);
  formData.append("userName", users.value.userName);
  formData.append("userEmail", users.value.userEmail);
  formData.append("userIntro", users.value.userIntro);
  // 파일파트 추가
  if (ufAttach.value.files.length !== 0) {
    formData.append("ufAttach", ufAttach.value.files[0]);
  }
  // 회원가입 요청
  try {
    const response = await usersApi.usersCreate(formData);
    console.log(response.data);
    // router.back();
  } catch (error) {
    console.log(error);
  }
}

function handleReset() {
  users.value = {
    userLoginId: "",
    userPassword: "",
    userName: "",
    userEmail: "",
    userIntro: "",
  }
}

function handleTagEvent() {
  console.log("handleTagEvent() 실행");
}
</script>
