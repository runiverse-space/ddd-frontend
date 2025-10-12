<template>
  <div class="row">

    <form @submit.prevent="handleSubmit">
      <div>
        <div class="mb-3">
          <label for="knowledgeTitle" class="form-label">제목<span class="text-danger">*</span></label>
          <input type="text" class="form-control" :class="{ 'is-invalid': touched.knowledgeTitle && errors.knowledgeTitle }" v-model="knowledge.knowledgeTitle" @blur="handleTitleBlur"
            @input="handleTitleInput">
          <div v-if="touched.knowledgeTitle && errors.knowledgeTitle" class="invalid-feedback">
            {{ errors.knowledgeTitle }}
          </div>
        </div>
        <div class="mb-3">
          <label for="knowledgeContent" class="form-label">내용<span class="text-danger">*</span></label>
          <textarea class="form-control" :class="{ 'is-invalid': touched.knowledgeContent && errors.knowledgeContent }" style="width: 100rem; height: 200px; resize: none;" rows="3"
            v-model="knowledge.knowledgeContent" @blur="handleContentBlur" @input="handleContentInput"> </textarea>
          <div v-if="touched.knowledgeContent && errors.knowledgeContent" class="invalid-feedback">
            {{ errors.knowledgeContent }}
          </div>
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

        <TagSelector :tag-type="knowledge.tagType" v-model="selectedTags" />


        <div class="row">
          <div class="col-sm-12 d-flex justify-content-center">
            <input type="submit" class="btn btn-dark btn-sm me-2" value="등록하기" />
            <input type="button" class="btn btn-dark btn-sm me-2" value="취소" @click="handleCancel" />
          </div>
        </div>

      </div>
    </form>
    <BaseModal 
    :show="Default" 
    type="default" 
    buttonAction="confirm" 
    title="지식창고 등록" 
    button-text="등록"
    @confirm="onConfirm" 
    @close="Default = false" >
     작성하신 글을 등록할까요?
    </BaseModal>

    <BaseModal :show="showErrorModal" type="error" title="등록 실패" @close="showErrorModal = false">
      {{modalMessage }}
    </BaseModal>

  </div>
</template>


<!--컴포넌트의 초기화 또는 이벤트 처리-->
<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { LinkIcon, ArchiveBoxArrowDownIcon } from "@heroicons/vue/24/outline";
import knowledgeApi from '@/apis/knowledgeApi';
// @ts-nocheck
import tagApi from '@/apis/tagApi';
import TagSelector from '@/components/TagSelector.vue';
import BaseModal from '@/components/BaseModal.vue';


const store = useStore();
const router = useRouter();
const route = useRoute();
const projectId = route.params.projectId;

//모달창
const Default = ref(false);  // ⭐ 성공 모달
const showErrorModal = ref(false);    // ⭐ 에러 모달
const modalMessage=ref('');

//태그 추가
const selectedTags = ref([]);
const knowledge = ref({
  knowledgeTitle: "",
  knowledgeContent: "",
  knowledgeUrl: "",
  tagType: "KNOWLEDGE"

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



function handleTitleBlur() {
  touched.value.knowledgeTitle = true;
  validateTitle();
}

function handleContentBlur() {
  touched.value.knowledgeContent = true;
  validateContent();
}

function handleTitleInput() {
  if (touched.value.knowledgeTitle) {  // ⭐ 이미 터치된 경우에만
    validateTitle();  // 재검증하여 에러를 즉시 제거
  }
}

//첨부파일
const kfAttach = ref(null);

//멀티 파트 객체 생성
async function handleSubmit() {
  // console.log('userId를 확인:', store.state.userId);
  console.log("1. handleSubmit 실행");
  touched.value.knowledgeTitle = true;
  touched.value.knowledgeContent = true;

  if (!validateForm()) {
    modalMessage.value = '필수 항목을 입력해주세요.';
    console.log("2. 모달 띄우기");
    showErrorModal.value = true;
    return;
  }
// 확인 모달 띄우기  
  Default.value=true;
  
  
}
// 확인 버튼 클릭 시 실행
function onConfirm(){
  Default.value=false;
  submitKnowledge();

}

//실제 파일과 함께 등록 처리 함수
async function submitKnowledge() {
   console.log("3. submitKnowledge 실행됨!");
  // showInfo.value = false; 
  
  const formData = new FormData();
  formData.append("knowledgeTitle", knowledge.value.knowledgeTitle);
  formData.append("knowledgeContent", knowledge.value.knowledgeContent);
  formData.append("knowledgeUrl", knowledge.value.knowledgeUrl);
  formData.append("userId", store.state.userId);
  formData.append("projectId", projectId);

  //console.log("formdata: ", formData);
  //파일 파트 추가
  if (kfAttach.value.files.length !== 0) {
    formData.append("kfAttach", kfAttach.value.files[0]);
  }

  try {
     console.log("4. API 호출 시작");
    const response = await knowledgeApi.knowledgeCreate(formData);
     console.log("5. API 응답:", response.data);
    const knowledgeId = response.data.knowledgeId;

    if (selectedTags.value.length > 0) {
      const selectedTagIds = selectedTags.value.map(tag => tag.tagId);

      await tagApi.updateKnowledgeTags({
        knowledgeId: knowledgeId,
        tagIds: selectedTagIds
      });
    }
    console.log("6. 등록 완료, 페이지 이동");
    router.back();

    // console.log(response);
  } catch (error) {
    console.log(error);
    modalMessage.value='서버 오류가 발생했습니다.'
    showErrorModal.value=true;

  }

}



function handleCancel() {
  router.back();
}


</script>

<style scoped>
.available-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-btn {
  padding: 6px 16px;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  background-color: #fff;
  color: #495057;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-btn:hover {
  background-color: #f8f9fa;
  border-color: #adb5bd;
}

.tag-btn.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}


.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background-color: #007bff;
  color: white;
  border-radius: 16px;
  font-size: 14px;
}

.remove-tag-btn {
  border: none;
  background: none;
  color: white;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;
}

.remove-tag-btn:hover {
  color: #ffc107;
}



.need-icon {
  width: 24px;
  height: 24px;
}
</style>