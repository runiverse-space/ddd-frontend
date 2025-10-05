<!-- src/views/projects/ProjectCreate.vue -->
<template>
  <div class="project-create">
    <h1 class="page-title">프로젝트 생성</h1>

    <!-- 1단계: 프로젝트명 -->
    <div class="form-section">
      <label class="form-label">
        프로젝트명 <span class="text-danger">*</span>
      </label>
      <input type="text" class="form-control" placeholder="프로젝트명을 입력하세요" v-model="project.projectTitle" />
    </div>

    <!-- 2단계: 프로젝트 개요 -->
    <div class="form-section">
      <label class="form-label">
        프로젝트 개요 <span class="text-danger">*</span>
      </label>
      <textarea class="form-control" rows="6" placeholder="프로젝트 소개를 입력합니다. (최대 150자 제한)" v-model="project.projectContent" maxlength="150"></textarea>
      <small class="text-muted">{{ project.projectContent.length }}/150 characters</small>
    </div>

    <!-- 3단계: 프로젝트 멤버 추가 -->
    <div class="form-section">
      <label class="form-label">
        프로젝트 멤버 추가 <span class="text-danger">*</span>
      </label>
      <div class="member-section">
        <div class="selected-member mb-3">
          <div class="member-item">
            <img src="/path/to/avatar.jpg" class="member-avatar" alt="member">
            <span>노동하시우</span>
            <button type="button" class="btn-close" @click="removeMember"></button>
          </div>
        </div>
        <input type="text" class="form-control" placeholder="회원 이메일 선택 가능합니다" />
      </div>
      <div class="alert alert-danger mt-2">
        <small>⚠️ 기능을 보여주기위해, 한 화면에 구성하였습니다.</small>
      </div>
    </div>

    <!-- 4단계: 만든이 -->
    <div class="form-section">
      <label class="form-label">
        프로젝트 만든 사람
      </label>
      <div class="creator-info">
        <span>만든이: {{ project.userId }}</span>
      </div>
    </div>

    <!-- 5단계: 프로젝트 일정 -->
    <div class="form-section">
      <label class="form-label">프로젝트 일정을 추가해 주세요</label>
      <p class="text-muted small">프로젝트 시작일자를 선택해주세요.</p>
      <input type="date" class="form-control mb-3" v-model="project.projectStartDate" />
      <p class="text-muted small ">프로젝트 종료일자를 선택해주세요.</p>
      <input type="date" class="form-control" v-model="project.projectEndDate" />
    </div>

    <!-- 6단계: 새 일정 추가 -->
    <div class="form-section">
      <p class="text-muted small">프로젝트 일정을 등록해주세요. (최대 3개 가능)</p>

      <!-- 마일스톤 입력 필드 -->
      <div v-for="(milestone, index) in project.projectMilestones" :key="index" class="mb-3 border rounded p-3">
        <label class="form-label fw-semibold">마일스톤 {{ index + 1 }}</label>
        <input type="date" class="form-control mb-2" v-model="milestone.milestoneDate" placeholder="날짜를 선택하세요" />
        <input type="text" class="form-control" v-model="milestone.milestoneTitle" placeholder="마일스톤 내용을 입력하세요" />

        <!-- 마일스톤 취소 버튼 -->
        <button type="button" class="btn btn-outline-danger btn-sm mt-2 w-100" @click="removeMilestone(index)">
          <i class="bi bi-trash"></i> 마일스톤 취소
        </button>
      </div>

      <!-- 마일스톤 추가 버튼 -->
      <button class="btn btn-outline-secondary w-100" @click="addMilestone()"
        :disabled="project.projectMilestones.length >= 3">
        <i class="bi bi-plus"></i> 마일스톤 자리
      </button>
    </div>

    <!-- 7단계: 태그 추가 -->
    <div class="form-section">
      <label class="form-label">프로젝트에 대한 태그를 추가해 주세요</label>
      <p class="tag-description">태그는 프로젝트의 목적과 방향을 빠르게 이해할 수 있도록 도와줍니다.</p>
      <!-- 전체 태그 리스트 -->
      <div class="tag-category">
        <h6 class="category-title">기능 역할</h6>
        <div class="tag-list">
          <button v-for="tag in availableTags" :key="tag.tagId" :class="['tag-button', { 'tag-selected': selectedTagIds.includes(tag.tagId) }]" @click="toggleTag(tag)">
            {{ tag.tagName }}
          </button>
        </div>
      </div>




      <!-- 선택된 태그 표시 -->
      <div v-if="selectedTagIds.length > 0" class="selected-tags-section">
        <h6 class="selected-title">선택된 태그</h6>
        <div class="selected-tags-list">
          <span v-for="tagId in selectedTagIds" :key="tagId" class="selected-tag-badge">
            {{ getTagName(tagId) }}
            <XCircleIcon class="remove-icon" @click="removeTag(tagId)" />
          </span>
        </div>
      </div>

      <!-- 생성 버튼 -->
      <div class="form-section">
        <button class="btn btn-dark btn-lg " @click="createProject">
          프로젝트 생성
        </button>
        <button class="btn btn-light btn-lg " @click="handleCancel">
          취소
        </button>
      </div>
    </div>
  </div>
</template>


<script setup>
import projectApi from '@/apis/projectApi';
import { XCircleIcon } from '@heroicons/vue/24/outline';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import tagApi from '@/apis/tagApi'
import projectMilestoneApi from '@/apis/projectMilestoneApi';


const props = defineProps(['projectId']);
const router = useRouter();
const projectName = ref('');
const store = useStore();
const userId = store.state.userId;
//태그 테이블에서 가져온 전체 태그
const availableTags = ref([]);
//선택된 태그 Id 배열
const selectedTagIds = ref([]);


const project = ref({
  projectId: "",
  userId: userId,
  projectTitle: "",
  projectContent: "",
  projectStartDate: "",
  projectEndDate: "",
  userIds: [],  // ← 빈 배열 추가
  projectMilestones: [],  // ← 이것도 추가
  tagIds: []

});




//프로젝트 생성하기
async function createProject() {
  console.log("프로젝트 생성하기 1. userId를 확인:", userId);
  // console.log("타입은?: ",typeof userId);

  try {

    project.value.tagIds = selectedTagIds.value;

    const data = structuredClone(project.value);

    const response = await projectApi.createProject(data);

    console.log("response의 값", response.data);

    // 마일스톤 생성
    const result = response.data;
    const projectId = result.data.projectId
    console.log(project.value.projectMilestones);
    for (let milestone of project.value.projectMilestones) {
      console.log(projectId);
      milestone.projectId = projectId;
      console.log("마일스톤 생성하기:", milestone);
      const response = await projectMilestoneApi.createProjectMilestone(milestone);
      console.log(response.data);
    }

    router.back();

  } catch (error) {
    console.log(error);
  }

}

function handleCancel() {
  router.back();
}

// 마일스톤 추가
function addMilestone() {
  if (project.value.projectMilestones.length < 3) {
    project.value.projectMilestones.push({
      milestoneDate: '',
      milestoneTitle: ''
    });
  }
}

// 마일스톤 취소
function removeMilestone(index) {
  project.value.projectMilestones.splice(index, 1);
}


// 전체 태그 테이블에서 프로젝트용 태그 조회 
async function loadProjectTags() {
  try {
    const response = await tagApi.getTags('PROJECT');
    availableTags.value = response.data;
  } catch (error) {
    console.log('전체 태그 테이블에서 태그 조회 실패', error);
  }
}

//태그 선택/해제 토글
function toggleTag(tag) {
  if (selectedTagIds.value.includes(tag.tagId)) {

    const newArray = [];

    //배열을 순회하면서 선택한 태그Id와 다른것만 새 배열에 추가
    for (const tagId of selectedTagIds.value) {
      if (tagId !== tag.tagId) {
        newArray.push(tagId);
      }
    }

    //기존 배열을 새 배열로 교체(클릭한 태그가 제거)
    selectedTagIds.value = newArray;
  } else {
    selectedTagIds.value.push(tag.tagId);
  }
}

//태그 삭제하기
function removeTag(tagId) {

  const newArray = [];

  for (const id of selectedTagIds.value) {
    if (id !== tagId) {//제거할 태그가 아니라면 유지
      newArray.push(id);
    }
  }
  selectedTagIds.value = newArray;
}

//태그 이름찾기
function getTagName(tagId) {
  for (const tag of availableTags.value) {
    if (tag.tagId === tagId) {
      return tag.tagName;
    }
  }

  return ''; //못찾으면 빈문자열
}


onMounted(() => {
  loadProjectTags();
})



// //날짜 포맷 함수
// function formData(dateString){
//   if(!dateString) return '';

//   const date=new Date(dateString);
//   const now = new Date();
//   const diff = now-date;

//   // 1분 미만
//   if (diff < 60000) return '방금 전';
//   // 1시간 미만
//   if (diff < 3600000) return Math.floor(diff / 60000) + '분 전';
//   // 24시간 미만
//   if (diff < 86400000) return Math.floor(diff / 3600000) + '시간 전';
//   // 7일 미만
//   if (diff < 604800000) return Math.floor(diff / 86400000) + '일 전';

//   // 그 외: 날짜 표시
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');

//   return `${year}.${month}.${day}`;
// }


</script>

<style scoped>
.project-create {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 32px;
}

.form-section {
  margin-bottom: 32px;
}

.form-label {
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 14px;
}

.form-control:focus {
  border-color: #6759F4;
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(103, 89, 244, 0.25);
}

.text-danger {
  color: #dc3545;
}

.text-muted {
  color: #6c757d;
}

.member-section {
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 16px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.member-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.btn-close {
  margin-left: auto;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.creator-info {
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.tags-selected .badge {
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
}

.tag-category {
  margin-bottom: 16px;
}

.tag-category h6 {
  font-weight: 600;
  margin-bottom: 12px;
}

.tag-list .badge {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 400;
  cursor: pointer;
  margin-bottom: 8px;
}

.tag-list .badge:hover {
  background-color: #6759F4 !important;
  color: white !important;
}

.alert {
  padding: 12px;
  border-radius: 6px;
}

.alert-danger {
  background-color: #f8d7da;
  border: 1px solid #f5c2c7;
  color: #842029;
}

/* 폼 섹션 */
.form-section {
  margin-bottom: 30px;
}

.form-label {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
}

.tag-description {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 20px;
}

/* 태그 카테고리 */
.tag-category {
  margin-bottom: 25px;
}

.category-title {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 12px;
}

/* 태그 리스트 */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* 태그 버튼 기본 스타일 */
.tag-button {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #dee2e6;
  background-color: #f8f9fa;
  color: #495057;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.tag-button:hover {
  background-color: #e9ecef;
  border-color: #adb5bd;
}

/* 선택된 태그 스타일 */
.tag-button.tag-selected {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.tag-button.tag-selected:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

/* 선택된 태그 섹션 */
.selected-tags-section {
  margin-top: 25px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.selected-title {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 12px;
}

.selected-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 선택된 태그 배지 */
.selected-tag-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: #007bff;
  color: white;
  border-radius: 16px;
  font-size: 14px;
}

/* 삭제 아이콘 */
.remove-icon {
  width: 16px;
  height: 16px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.remove-icon:hover {
  opacity: 0.7;
}


.need-icon {
  weight: 24px;
  height: 24px;
}
</style>