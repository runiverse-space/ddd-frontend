<!-- src/views/projects/ProjectCreate.vue -->
<template>
  <div class="project-create">
    <h1 class="page-title">프로젝트 생성</h1>

    <!-- 1단계: 프로젝트명 (✨ 유효성 검사 추가) -->
    <div class="form-section">
      <label class="form-label">
        프로젝트명 <span class="text-danger">*</span>
      </label>
      <input type="text" class="form-control" :class="{ 'is-invalid': touched.projectTitle && errors.projectTitle }" placeholder="프로젝트명을 입력하세요" v-model="project.projectTitle" @focus="handleTitleFocus"
        @blur="handleTitleBlur" @input="handleTitleInput" />
      <div v-if="touched.projectTitle && errors.projectTitle" class="invalid-feedback">
        {{ errors.projectTitle }}
      </div>
    </div>

    <!-- 2단계: 프로젝트 개요 (✨ 유효성 검사 추가) -->
    <div class="form-section">
      <label class="form-label">
        프로젝트 개요 <span class="text-danger">*</span>
      </label>
      <textarea class="form-control" :class="{ 'is-invalid': touched.projectContent && errors.projectContent }" rows="6" placeholder="프로젝트 소개를 입력합니다. (최대 150자 제한)" v-model="project.projectContent"
        maxlength="150" @focus="handleContentFocus" @blur="handleContentBlur" @input="handleContentInput"></textarea>
      <div v-if="touched.projectContent && errors.projectContent" class="invalid-feedback">
        {{ errors.projectContent }}
      </div>
      <small class="text-muted">{{ project.projectContent.length }}/150 characters</small>
    </div>

    <!-- 3단계: 프로젝트 멤버 추가 -->
    <div>
      <MemberSelector v-model="projectMembers" />
    </div>

    <!-- 4단계: 만든이 -->
    <div class="form-section">
      <label class="form-label mt-3"></label>
      <div class="creator-info">
        <img :src="creatorInfo.profileUrl" alt="profile" class="creator-img" />
        <span class="creator-name">{{ creatorInfo.userName || '로딩 중...' }}</span>
      </div>
    </div>

    <!-- 5단계: 프로젝트 일정 -->
    <div class="form-section">
      <label class="form-label">프로젝트 일정을 추가해 주세요</label>
      <p class="text-muted small">프로젝트 시작일자를 선택해주세요.</p>
      <input type="date" class="form-control mb-3" v-model="project.projectStartDate" :min="today" />

      <p class="text-muted small">프로젝트 종료일자를 선택해주세요.</p>
      <input type="date" class="form-control mb-3" :min="minEndDate" v-model="project.projectEndDate" />
    </div>

    <!-- 6단계: 새 일정 추가 -->
    <div class="form-section">
      <p class="text-muted small">프로젝트 일정을 등록해주세요. (최대 3개 가능)</p>

      <div v-for="(milestone, index) in project.projectMilestones" :key="index" class="mb-3 border rounded p-3">
        <label class="form-label fw-semibold">마일스톤 {{ index + 1 }}</label>
        <input type="date" class="form-control mb-2" v-model="milestone.milestoneDate" placeholder="날짜를 선택하세요" />
        <input type="text" class="form-control" v-model="milestone.milestoneTitle" placeholder="마일스톤 내용을 입력하세요" />

        <button type="button" class="btn btn-outline-danger btn-sm mt-2 w-100" @click="removeMilestone(index)">
          <i class="bi bi-trash"></i> 마일스톤 취소
        </button>
      </div>

      <button class="btn btn-outline-secondary w-100" @click="addMilestone()" :disabled="project.projectMilestones.length >= 3">
        <i class="bi bi-plus"></i> 마일스톤 자리
      </button>
    </div>

    <!-- 7단계: 태그 추가 (✨ 유효성 검사 추가) -->
    <div class="tag-section">
      <label>
        프로젝트 태그(최대 3개)<span class="text-danger">*</span>
      </label>
      <div :class="{ 'border border-danger rounded p-2': touched.tags && errors.tags }">
        <DualTagSelector tagType="PROJECT" v-model="selectedTags" @update:modelValue="handleTagsChange" />
      </div>
      <div v-if="touched.tags && errors.tags" class="text-danger small mt-1">
        {{ errors.tags }}
      </div>
    </div>

    <!-- 생성 버튼 -->
    <div class="form-section button-group">
      <button class="btn btn-dark btn-lg" @click="createProject">
        프로젝트 생성
      </button>
      <button class="btn btn-light btn-lg" @click="handleCancel">
        취소
      </button>
    </div>

    <!-- 프로젝트 등록 -->
    <BaseModal 
    :show="showDefault" 
    buttonAction="confirm"
    buttonText="등록"
    type="default" 
    title="프로젝트 등록" 
    @close="showDefault = false"
    @confirm="createConfirm">
      프로젝트를 등록하시겠습니까?
    </BaseModal>

    <!-- 프로젝트 등록 완료 모달 -->
    <BaseModal :show="showDefaultCompleted" type="default" title="등록 완료" @close="showDefaultCompleted = false; router.push('/project')">
      프로젝트 등록이 완료되었습니다.
    </BaseModal>

    <!-- ✨ 에러 모달 추가 -->
    <BaseModal :show="showErrorModal" type="error" title="등록 실패" @close="showErrorModal = false">
      {{ modalMessage }}
    </BaseModal>
  </div>
</template>


<script setup>
import projectApi from '@/apis/projectApi';
import { XCircleIcon } from '@heroicons/vue/24/outline';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import tagApi from '@/apis/tagApi'
import projectMilestoneApi from '@/apis/projectMilestoneApi';
import usersApi from '@/apis/usersApi';
import DualTagSelector from '@/components/DualTagSelector.vue';
import defaultImgSrc from '@/assets/default-profile.png';
import MemberSelector from '@/components/MemberSelector.vue';
import BaseModal from '@/components/BaseModal.vue';

const props = defineProps(['projectId']);
const router = useRouter();
const store = useStore();
const userId = store.state.userId;
//태그
const selectedTags = ref([]);
const defaultImg = defaultImgSrc;
const selectedMembers = ref([]);

// memberselecto로 수정
const projectMembers = ref([]);

//모달창 등록
const showDefault = ref(false);
const showDefaultCompleted = ref(false);

const showErrorModal = ref(false);    // ⭐ 에러 모달
const modalMessage = ref('');

//유효성검사 빨갛게 띄우기

//에러 상태 추가
const errors = ref({
  projectTitle: "",
  projectContent: "",
  tags: ""
});

// 터치 상태
const touched = ref({
  projectTitle: false,
  projectContent: false,
  tags: false
})

//제목 검증 함수
function validateTitle() {

  if (!project.value.projectTitle || project.value.projectTitle.trim() === '') {
    errors.value.projectTitle = '제목은 필수 입력 항목입니다.';
    return false;
  }
  errors.value.projectTitle = '';
  return true;
}

//내용 검증 함수
function validateContent() {
  if (!project.value.projectContent || project.value.projectContent.trim() === '') {
    errors.value.projectContent = '내용은 필수 입력 항목입니다.';
    return false;
  }
  errors.value.projectContent = '';
  return true;
}

// ✨ 태그 검증 함수 
function validateTags() {
  if (!selectedTags.value || selectedTags.value.length === 0) {
    errors.value.tags = '최소 1개 이상의 태그를 선택해주세요.';
    return false;
  }
  if (selectedTags.value.length > 3) {
    errors.value.tags = '태그는 최대 3개까지 선택 가능합니다.';
    return false;
  }
  errors.value.tags = '';
  return true;
}

//전체 폼 검증
function validateForm() {
  const isTitleValid = validateTitle();
  const isContentValid = validateContent();
  const isTagsValid = validateTags();
  return isTitleValid && isContentValid && isTagsValid;
}


// ✨ 제목 focus (지나갈 때 바로 touched 설정)
function handleTitleFocus() {
  touched.value.projectTitle = true;
}

// 제목 blur (검증 실행)
function handleTitleBlur() {
  validateTitle();
}

// 제목 input (실시간 에러 제거)
function handleTitleInput() {
  if (touched.value.projectTitle) {
    validateTitle();
  }
}

// ✨ 내용 focus (지나갈 때 바로 touched 설정)
function handleContentFocus() {
  touched.value.projectContent = true;
}

// 내용 blur (검증 실행)
function handleContentBlur() {
  validateContent();
}

// 내용 input (실시간 에러 제거)
function handleContentInput() {
  if (touched.value.projectContent) {
    validateContent();
  }
}

// ✨ 태그 변경 핸들러 (선택/해제 시 즉시 검증)
function handleTagsChange() {
  touched.value.tags = true;
  validateTags();
}

//** 오늘 날짜를 YYYY-MM-DD 형식으로 생성
const today = computed(() => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
});

const minEndDate = computed(() => {
  return project.value.projectStartDate || today.value;
});


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

const creatorInfo = ref({
  userId: userId,
  userName: "",
  profileUrl: defaultImg
})

async function getCreatorInfo() {
  try {
    const response = await usersApi.usersDetailById(userId);

    if (response.data.result === 'success') {
      const userData = response.data.data;
      creatorInfo.value.userName = userData.userName; //** 사용자 이름 저장

      //** 프로필 이미지도 가져오려면 (선택사항)
      try {
        const imgRes = await usersApi.ufAttachDownload(userId);
        creatorInfo.value.profileUrl = URL.createObjectURL(imgRes.data);
      } catch (err) {
        // console.log('프로필 이미지 로드 실패, 기본 이미지 사용');
        creatorInfo.value.profileUrl = defaultImg;
      }
    }
  } catch (error) {
    console.error('생성자 정보 조회 실패:', error);
    creatorInfo.value.userName = '알 수 없음'; //** 실패 시 기본값
  }
}

//프로젝트 생성하기
async function createProject() {
  // console.log("1.프로젝트 생성하기 1단계 유효성검사")
  //  console.log("=== 유효성 검사 시작 ===");
  // console.log("제목:", project.value.projectTitle);
  // console.log("내용:", project.value.projectContent);
  // console.log("태그:", selectedTags.value);

  touched.value.projectTitle = true;
  touched.value.projectContent = true;
  touched.value.tags = true;

  // 전체 유효성 검사
  if (!validateForm()) {
    showErrorModal.value = true;
    modalMessage.value = '필수 항목을 모두 입력해주세요.';
    console.log("2. 유효성검사완료");
    return;
  }
console.log("3. 유효성검사 진짜 완료");
  showDefault.value = true;

}

async function createConfirm() {
  // console.log("3.등록하기 버튼 누르고 난후에 실제 api 호출하기")
  showDefault.value = false;

  try {
    // console.log("=== 멤버 데이터 흐름 시작 ===");
    // console.log("1. selectedMembers.value:", projectMembers.value);


    const userIds = [];
    for (const member of projectMembers.value) {
      userIds.push(member.userId);
      // console.log("생성되는 프로젝트 멤버",member.userId);
    }
    project.value.userIds = userIds;

    //  console.log("2. 추출된 userIds 배열:", userIds);
    // console.log("3. project.value.userIds:", project.value.userIds);

    const data = {
      ...project.value,
      projectId: props.projectId,
      members: projectMembers.value.map(m => m.userId)
    };

    

    const response = await projectApi.createProject(data);

    

    // 마일스톤 생성
    const result = response.data;
    const projectId = result.data.projectId
    
    for (let milestone of project.value.projectMilestones) {
      
      milestone.projectId = projectId;
      
      const response = await projectMilestoneApi.createProjectMilestone(milestone);
   
    }
    //태그 연결 선택된 태그가 있을경우만.. 무조건 태그 선택하도록해야함
    if (selectedTags.value.length > 0) {
      const selectedTagIds = selectedTags.value.map(tag => tag.tagId);
      await tagApi.updateProjectTags({
        projectId: projectId,
        tagIds: selectedTagIds
      })
    }
    // console.log("4. showDefaultCompleted 완료")
    showDefaultCompleted.value = true;

  } catch (error) {
    // console.log(error);
    showErrorModal.value = true;
    modalMessage.value = '오류가 발생했습니다.'
  }


}



function handleCancel() {
  router.push('/project');
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

//** 컴포넌트 마운트 시 생성자 정보 로드
onMounted(() => {
  getCreatorInfo();
});


</script>

<style scoped>
.creator-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
}

.creator-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.creator-name {
  font-weight: 600;
  color: #333;
}


.button-group {
  display: flex;
  justify-content: flex-end;
  /* ✅ 오른쪽 정렬 */
  gap: 12px;
  /* 버튼 간격 */
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
  /* 구분선 (선택사항) */
}

.btn {
  min-width: 120px;
  /* 버튼 최소 너비 */
}


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


/* ===========================
   검색 input
=========================== */

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  border-radius: 6px 6px 0 0;
  /* 드롭다운 열릴 때 위쪽만 둥글게 */
}

.form-control:disabled {
  background-color: #e9ecef;
  opacity: 0.6;
  cursor: not-allowed;
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