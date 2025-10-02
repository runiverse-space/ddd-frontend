<template>
  <div class="row">

    <form @submit.prevent="handleSubmit">
      <div>
        <div class="mb-3">
          <label for="knowledgeTitle" class="form-label">제목<span class="text-danger">*</span></label>
          <input type="text" class="form-control" :class="{ 'is-invalid': touched.knowledgeTitle && errors.knowledgeTitle }" v-model="knowledge.knowledgeTitle">
        </div>
        <div class="mb-3">
          <label for="knowledgeContent" class="form-label">내용<span class="text-danger">*</span></label>
          <textarea class="form-control" :class="{ 'is-invalid': touched.knowledgeContent && errors.knowledgeContent }" style="width: 100rem; height: 200px; resize: none;" rows="3"
            v-model="knowledge.knowledgeContent"></textarea>
        </div>
        <div class="mb-3">
          <LinkIcon class="need-icon" />
          <label for="knowledgeUrl" class="form-label">URL</label>
          <input type="text" class="form-control" v-model="knowledge.knowledgeUrl">
        </div>
        <div class="input-group mb-3 row">
          <div>
            <ArchiveBoxArrowDownIcon class="need-icon" />
            <label for="kfAttach">파일첨부</label>
          </div>
          <div class="mt-1">
            <input type="file" class="form-control" ref="kfAttach">
          </div>
        </div>


        <div class="row">
          <div class="col-sm-12 d-flex justify-content-center">
            <input type="submit" class="btn btn-dark btn-sm me-2" value="등록하기" />
            <input type="button" class="btn btn-dark btn-sm me-2" value="취소" @click="handleCancel" />
          </div>
        </div>

      </div>
    </form>

    <div class="modal fade" id="validationModal" tabindex="-1" aria-labelledby="validationModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="validationModalLabel">⚠️ 입력 오류</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            {{ modalMessage }}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-dark" data-bs-dismiss="modal">확인</button>
          </div>
        </div>
      </div>
    </div>





  </div>
</template>


<!--컴포넌트의 초기화 또는 이벤트 처리-->
<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { LinkIcon, ArchiveBoxArrowDownIcon } from "@heroicons/vue/24/outline";
import knowledgeApi from '@/apis/knowledgeApi';
// @ts-nocheck
import * as bootstrap from 'bootstrap';


// const props = defineProps(["projectId"]);
const store = useStore();
const router = useRouter();
const route = useRoute();
const projectId = route.params.projectId;
const modalMessage = ref('');

const knowledge = ref({
  knowledgeTitle: "",
  knowledgeContent: "",
  knowledgeUrl: "",

})

//에러 상태 추가
const errors = ref({
  knowledgeTitle: "",
  knowledgeContent: ""
});
// 터치 상태
const touched = ref({
  knowledgeTitle: false,
  knowledgeContent: false
})

//제목 검증 함수
function validateTitle() {
  if (!knowledge.value.knowledgeTitle || knowledge.value.knowledgeTitle.trim() === '') {
    errors.value.knowledgeTitle = '제목은 필수 입력 항목입니다.';
    return false;
  }
  errors.value.knowledgeTitle = '';
  return true;
}

//내용 검증 함수
function validateContent() {
  if (!knowledge.value.knowledgeContent || knowledge.value.knowledgeContent.trim() === '') {
    errors.value.knowledgeContent = '내용은 필수 입력 항목입니다.';
    return false;
  }
  errors.value.knowledgeContent = '';
  return true;
}

//전체 폼 검증
function validateForm() {
  const isTitleValid = validateTitle();
  const isContentValid = validateContent();
  return isTitleValid && isContentValid;
}

function showModal(message){
  modalMessage.value= message;
  const modalElement = document.getElementById('validationModal');
  const modal= new bootstrap.Modal(modalElement);
  modal.show();

}


function handleTitleBlur() {
  touched.value.knowledgeTitle = true;
  validateTitle();
}

function handleContentBlur() {
  touched.value.knowledgeContent = true;
  validateContent();
}





//첨부파일
const kfAttach = ref(null);

//멀티 파트 객체 생성
async function handleSubmit() {
  console.log('userId를 확인:', store.state.userId);

  touched.value.knowledgeTitle = true;
  touched.value.knowledgeContent = true;

  if (!validateForm()) {
    showModal('필수 항목을 입력해주세요.');
    return;
  }

  const formData = new FormData();
  formData.append("knowledgeTitle", knowledge.value.knowledgeTitle);
  formData.append("knowledgeContent", knowledge.value.knowledgeContent);
  formData.append("knowledgeUrl", knowledge.value.knowledgeUrl);
  formData.append("userId", store.state.userId);
  //formData.append("userId",userId);
  formData.append("projectId", projectId);// projectId는 처음부터 전달되어서 들어와야하는데 이거를 

  console.log("formdata: ", formData);
  //파일 파트 추가
  if (kfAttach.value.files.length !== 0) {
    formData.append("kfAttach", kfAttach.value.files[0]);
  }

  try {
    const response = await knowledgeApi.knowledgeCreate(formData);

    console.log(response);
    router.back();
  } catch (error) {
    console.log(error);
    if (error.response?.data?.message) {
      showModal(error.response.data.message);
    } else {
      showModal('서버 오류가 발생했습니다.');
    }
  }

}
function handleCancel() {
  router.back();
}

</script>

<style scoped>
.need-icon {
  width: 24px;
  height: 24px;
}
</style>