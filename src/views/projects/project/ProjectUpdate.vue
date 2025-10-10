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
        프로젝트 멤버 추가 <span class="text-muted">(선택사항, 최대 5명)</span>
      </label>

      <!-- 선택된 멤버 목록 표시 -->
      <div v-if="selectedMembers.length > 0" class="selected-members-container mb-3">
        <div v-for="member in selectedMembers" :key="member.userId" class="member-item">
          <!-- ✨ 이미지 표시 방법 -->
          <img :src="member.profileUrl || defaultImg" class="member-avatar" :alt="member.userName" @error="handleImageError" />

          <div class="member-info">
            <span class="member-name">{{ member.userName }}</span>
            <small class="member-email">{{ member.userEmail }}</small>
          </div>

          <button type="button" class="btn-close" @click="removeMember(member.userId)">
            ×
          </button>
        </div>
      </div>

      <!-- 검색 입력창 -->
      <div class="search-container">
        <input type="text" class="form-control" placeholder="이메일로 멤버 검색 (최소 2글자 입력)" v-model="searchEmail" @input="searchUsers" @focus="handleSearchFocus" @blur="handleSearchBlur"
          :disabled="selectedMembers.length >= 5" />

        <!-- 검색 중 로딩 -->
        <span v-if="isSearching" class="search-loading">
          🔍 검색 중...
        </span>

        <!-- 검색 결과 드롭다운 -->
        <div v-if="showDropdown && searchResults.length > 0" class="search-dropdown">
          <div v-for="user in searchResults" :key="user.userId" class="search-result-item" @click="selectMember(user)">
            <!-- ✨ 검색 결과 이미지 -->
            <img :src="user.profileUrl || defaultImg" class="result-avatar" :alt="user.userName" @error="handleImageError" />
            <div class="result-info">
              <span class="result-name">{{ user.userName }}</span>
              <small class="result-email">{{ user.userEmail }}</small>
            </div>
          </div>
        </div>

        <!-- 검색 결과 없음 -->
        <div v-if="showDropdown && searchResults.length === 0 && searchEmail.length >= 2 && !isSearching" class="no-results">
          검색 결과가 없습니다.
        </div>
      </div>

      <!-- 안내 메시지 -->
      <div class="alert alert-info mt-2">
        <small>
          💡 팀장 포함 최대 6명까지 프로젝트에 참여할 수 있습니다.<br>
          현재 선택: 팀장 1명 + 팀원 {{ selectedMembers.length }}/5명
        </small>
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
      <button class="btn btn-outline-secondary w-100" @click="addMilestone()" :disabled="project.projectMilestones.length >= 3">
        <i class="bi bi-plus"></i> 마일스톤 자리
      </button>
    </div>

    <!-- 7단계: 태그 추가 -->
    <div class="tag-section">
      <label>프로젝트 태그 선택(최대 3개)</label>
      <DualTagSelector tagType="PROJECT" v-model="selectedTags" />
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
  </div>

</template>


<script setup>
import projectApi from '@/apis/projectApi';
import { XCircleIcon } from '@heroicons/vue/24/outline';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import tagApi from '@/apis/tagApi'
import projectMilestoneApi from '@/apis/projectMilestoneApi';
import usersApi from '@/apis/usersApi';
import DualTagSelector from '@/components/DualTagSelector.vue';
import defaultImgSrc from '@/assets/default-profile.png';

const props = defineProps(['projectId']);
const router = useRouter();
const route = useRoute();
const projectName = ref('');
const store = useStore();
const userId = store.state.userId;
//태그
const selectedTags = ref([]);


const defaultImg = defaultImgSrc;
const searchEmail = ref('');
const searchResults = ref([]);
const selectedMembers = ref([]);
const isSearching = ref(false);
const showDropdown = ref(false);


const projectId = computed(() => route.query.projectId);
const projectIdNumber = computed(() => parseInt(projectId.value, 10));


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
async function updateProject() {


  //** 필수 입력 검증
  if (!project.value.projectTitle.trim()) {
    alert('프로젝트명을 입력해주세요.');
    return;
  }

  if (!project.value.projectContent.trim()) {
    alert('프로젝트 개요를 입력해주세요.');
    return;
  }

  try {

    const userIds = [];
    for (const member of selectedMembers.value) {
      userIds.push(member.userId);
    }

    project.value.userIds = userIds;


   

    const data={
      ...project.value,
      projectId: projectIdNumber.value,
      userId: userIds
    }
    const response = await projectApi.updateProject(data);

    // console.log("전송할 데이터", response.data);

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
    //태그 연결 선택된 태그가 있을경우만.. 무조건 태그 선택하도록해야함
    if (selectedTags.value.length > 0) {
      const selectedTagIds = selectedTags.value.map(tag => tag.tagId);
      await tagApi.updateProjectTags({
        projectId: projectId,
        tagIds: selectedTagIds
      })
    }

    router.back();

  } catch (error) {
    console.log(error);
  }

}




async function searchUsers() {
  if (searchEmail.value.length < 2) {
    searchResults.value = [];
    showDropdown.value = false;
    return;
  }

  try {
    isSearching.value = true;

    const response = await usersApi.usersSearch(searchEmail.value);
    console.log('검색 응답:', response.data);

    if (response.data.result === 'success') {
      const filteredResults = [];

      //** 검색 결과를 순회
      for (const user of response.data.data) {
        //** 1. 이미 선택된 멤버인지 확인
        let isAlreadySelected = false;

        for (const member of selectedMembers.value) {
          if (member.userId === user.userId) {
            isAlreadySelected = true;
            break;
          }
        }

        //** 2. 본인인지 확인
        const isMe = (user.userId === userId);

        //** 3. 조건 만족 시 추가
        if (!isAlreadySelected && !isMe) {

          try {

            const profileResponse = await usersApi.ufAttachDownload(user.userId);
            const blobUrl = URL.createObjectURL(profileResponse.data);
            user.profileUrl = blobUrl;
          } catch (error) {
            console.warn(`⚠️ ${user.userName} 이미지 없음, 기본 이미지 사용`);
            user.profileUrl = defaultImg;
          }

          filteredResults.push(user);
        }
      }

      searchResults.value = filteredResults;
      showDropdown.value = true;
      console.log('검색 결과:', searchResults.value.length + '명');
    }
  } catch (error) {
    console.error('사용자 검색 실패:', error);
    alert('검색 중 오류가 발생했습니다.');
  } finally {
    isSearching.value = false;
  }
}


function selectMember(user) {
  if (selectedMembers.value.length >= 5) {
    alert('최대 5명까지만 추가할수 있습니다.');
    return;
  }
  //선택된 멤버 추가
  selectedMembers.value.push({
    userId: user.userId,
    userEmail: user.userEmail,
    userName: user.userName,
    ufAttachoname: user.ufAttachoname,
    profileUrl: user.profileUrl
  });
  //초기화
  searchEmail.value = '';
  searchResults.value = [];
  showDropdown.value = false;

}


//멤버 제거함수
function removeMember(targetUserId) {
  const newMember = [];
  for (const member of selectedMembers.value) {
    if (member.userId !== targetUserId) {
      newMember.push(member);
    }
  }
  selectedMembers.value = newMember;
  console.log('멤버 제거됨, 남은 인원:', selectedMembers.value.length + '명');
}

//** ===== 검색창 포커스 처리 함수 =====
function handleSearchFocus() {
  //** 검색 결과가 있으면 드롭다운 표시
  if (searchResults.value.length > 0) {
    showDropdown.value = true;
  }
}

//** ===== 검색창 블러 처리 함수 =====
function handleSearchBlur() {
  //** 200ms 후에 드롭다운 숨김 (클릭 이벤트 처리 시간 확보)
  window.setTimeout(() => {
    showDropdown.value = false;
  }, 200);
}

//** ===== 이미지 로드 실패 처리 =====
function handleImageError(event) {
  //** 이미지 로드 실패 시 기본 아바타로 대체
  event.target.src = defaultImg;
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




</script>

<style scoped>
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
   검색 결과 프로필 이미지 - 24px
=========================== */

.result-avatar {
  width: 24px;
  /* ✅ 24px로 변경 */
  height: 24px;
  /* ✅ 24px로 변경 */
  border-radius: 50%;
  /* 원형 */
  object-fit: cover;
  /* 비율 유지 */
  flex-shrink: 0;
  /* 축소 방지 */
  border: 1px solid #ddd;
  /* 얇은 테두리 */
}

/* ===========================
   검색 컨테이너
=========================== */

.search-container {
  position: relative;
  width: 100%;
}

/* ===========================
   검색 중 로딩
=========================== */

.search-loading {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 0.85rem;
  pointer-events: none;
  /* 클릭 방지 */
}

/* ===========================
   검색 결과 드롭다운
=========================== */

.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ced4da;
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 0;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  /* 이미지와 텍스트 간격 */
  padding: 8px 12px;
  /* 패딩 줄여서 더 컴팩트하게 */
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background: #f8f9fa;
}

/* ===========================
   검색 결과 텍스트 정보
=========================== */

.result-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  /* 긴 텍스트 줄임표 처리 */
}

.result-name {
  font-weight: 500;
  font-size: 0.9rem;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-email {
  color: #6c757d;
  font-size: 0.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===========================
   검색 결과 없음
=========================== */

.no-results {
  padding: 16px;
  text-align: center;
  color: #6c757d;
  font-size: 0.9rem;
  background: white;
  border: 1px solid #ced4da;
  border-top: none;
  border-radius: 0 0 8px 8px;
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