<template>
  <div class="row">

    <form @submit.prevent="handleSubmit">
      <div>
        <div class="mb-3">
          <label for="knowledgeTitle" class="form-label">제목</label>
          <input type="text" class="form-control" v-model="knowledge.knowledgeTitle" 
          :class="{ 'is-invalid': touched.knowledgeTitle && errors.knowledgeTitle }"
          @blur="handleTitleBlur"
            @input="handleTitleInput">
        </div>
        <div class="mb-3">
          <label for="knowledgeContent" class="form-label">내용</label>
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
        <div class="input-group mb-3">
          <div>
            <img v-if="knowledge.kfAttachoname !== null" style="width: 100%; height: auto; border-radius: 8px; object-fit: cover; max-height: 400px;"
              :src="`${axios.defaults.baseURL}/api/knowledge/attachdownload?knowledgeId=${knowledge.knowledgeId}`" />
          </div>

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

        <div class="mb-3">
          <label class="form-label">태그</label>
          <TagSelector :tag-type="knowledge.tagType" v-model="selectedTags" />
        </div>

        <div class="row">
          <div class="col-sm-12 d-flex justify-content-center">
            <input type="submit" class="btn btn-dark btn-sm me-2" value="수정" />
            <input type="button" class="btn btn-dark btn-sm me-2" value="취소" @click="handleCancel" />
          </div>
        </div>

      </div>
    </form>

    <div class="modal fade" id="validationModal" tabindex="-1" aria-labelledby="validationModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="validationModalLabel"> </h5>
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
import knowledgeApi from '@/apis/knowledgeApi';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { ArchiveBoxArrowDownIcon, LinkIcon } from '@heroicons/vue/24/outline';
import TagSelector from '@/components/TagSelector.vue';
import tagApi from '@/apis/tagApi';
import * as bootstrap from 'bootstrap';


const route = useRoute();
const router = useRouter();
const knowledgeId = route.query.knowledgeId;
// console.log(knowledgeId);



const selectedTags = ref([]);
const modalMessage = ref('');
const knowledge = ref({
  knowledgeId: "",
  knowledgeTitle: "",
  knowledgeContent: "",
  knowledgeUrl: "",
  kfAttachoname: "",
  kfAttachtype: "",
  tagType: "KNOWLEDGE"

});

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

function showModal(message) {
  modalMessage.value = message;
  const modalElement = document.getElementById('validationModal');
  const modal = new bootstrap.Modal(modalElement);
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

function handleTitleInput() {
  if (touched.value.knowledgeTitle) {  // ⭐ 이미 터치된 경우에만
    validateTitle();  // 재검증하여 에러를 즉시 제거
  }
}



const kfAttach = ref(null);

async function handleSubmit() {
  if(!validateForm()){
    showModal('필수 항목을 입력해주세요.');
    return;
  }

updateKnowledge();
}


async function updateKnowledge(){
  
  const formData = new FormData();
  formData.append("knowledgeId", knowledgeId);
  // console.log('수정요청 knowledgeId', knowledgeId);
  formData.append("knowledgeTitle", knowledge.value.knowledgeTitle);
  formData.append("knowledgeContent", knowledge.value.knowledgeContent);
  formData.append("knowledgeUrl", knowledge.value.knowledgeUrl);

  if (kfAttach.value.files.length !== 0) {
    formData.append("kfAttach", kfAttach.value.files[0]);
  }

  //게시판 수정 요청
  try {
    const response = await knowledgeApi.knowledgeUpdate(formData);
    
    const updatedKnowledgeId = response.data.knowledgeId;

    //태그 업데이트
    if (selectedTags.value.length > 0) {
      const selectedTagIds = selectedTags.value.map(tag => tag.tagId);

      await tagApi.updateKnowledgeTags({
        knowledgeId: updatedKnowledgeId,
        tagIds: selectedTagIds
      });
    } else {
      await tagApi.updateKnowledgeTags({
        knowledgeId: updatedKnowledgeId,
        tagIds: []
      });
    }
    showModal('수정 완료되었습니다.');
  router.back();
  } catch (error) {
    console.log(error);
    showModal('서버 오류가 발생했습니다.');
  }
}


function handleCancel() {
  router.back();
}

async function getKnowledgeList() {
  try {
    const response = await knowledgeApi.knowledgeDetail(knowledgeId);
    const data = response.data.data;

    knowledge.value = {
      ...data,
      tagType: "KNOWLEDGE"
    }

    const responseTag = await tagApi.getKnowledgeTags(knowledgeId);
   

    selectedTags.value = responseTag.data.tags;

    // console.log("불러온 태그들:", selectedTags.value);

  } catch (error) {
    console.log(error);
  }
}

getKnowledgeList(knowledgeId);

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
