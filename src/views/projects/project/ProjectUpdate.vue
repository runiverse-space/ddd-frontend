<!-- src/views/projects/ProjectCreate.vue -->
<template>
  <div class="project-create">
    <h1 class="page-title">프로젝트 수정하기</h1>

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
      <small class="text-muted">{{ project.projectContent?.length || 0 }}/150 characters</small>
    </div>



    <!-- 3단계: 프로젝트 멤버 추가 -->
    <!-- 기존 멤버 -->
    <div class="form-section">
      <label class="form-label">프로젝트 멤버</label>
      <!-- ✅ 수정: projectMembers → selectedMembers -->
      <MemberSelector v-model="selectedMembers" />
    </div>
    <!-- 4단계: 만든이 -->
    <div class="form-section">
      <label class="form-label mt-3"></label>
      <div class="creator-info">
        <!-- ✅ 프로필 이미지 + 이름 표시 -->
        <img :src="creatorInfo.profileUrl" alt="profile" class="creator-img" />
        <span class="creator-name">{{ creatorInfo.userName || '로딩 중...' }}</span>
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
      <div v-for="(milestone, index) in project.projectMilestones || []" :key="index" class="mb-3 border rounded p-3">
        <label class="form-label fw-semibold">마일스톤 {{ index + 1 }}</label>
        <input type="date" class="form-control mb-2" v-model="milestone.milestoneDate" placeholder="날짜를 선택하세요" />
        <input type="text" class="form-control" v-model="milestone.milestoneTitle" placeholder="마일스톤 내용을 입력하세요" />

        <!-- 마일스톤 취소 버튼 -->
        <button type="button" class="btn btn-outline-danger btn-sm mt-2 w-100" @click="removeMilestone(index)">
          <i class="bi bi-trash"></i> 마일스톤 취소
        </button>
      </div>

      <!-- 마일스톤 추가 버튼 -->
      <button class="btn btn-outline-secondary w-100" @click="addMilestone()" :disabled="(project.projectMilestones?.length || 0) >= 3">
        <i class="bi bi-plus"></i> 마일스톤 자리
      </button>
    </div>

    <!-- 7단계: 태그 추가 -->
    <div class="tag-section">
      <label>프로젝트 태그</label>
      <DualTagSelector tagType="PROJECT" v-model="selectedTags" />
    </div>

    <!-- 생성 버튼 -->
    <div class="form-section button-group">
      <button class="btn btn-dark btn-lg" @click="updateProject">
        프로젝트 수정
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
import MemberSelector from '@/components/MemberSelector.vue';
import userprojectroleApi from '@/apis/userprojectroleApi';


const props = defineProps(['projectId']);
const router = useRouter();
const route = useRoute();
const projectName = ref('');
const store = useStore();
const userId = store.state.userId;
//태그
const selectedTags = ref([]);
const originalMemberIds = ref([]);

const defaultImg = defaultImgSrc;

const selectedMembers = ref([]);

const projectId = computed(() => route.query.projectId);
const projectIdNumber = computed(() => parseInt(projectId.value, 10));
// memberselecto로 수정
const projectMembers = ref([]);

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


//프로젝트 수정하기
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
    const currentMemberIds = selectedMembers.value.map(member => member.userId);

    //새로운 멤버 추가
    const newMemberIds = currentMemberIds.filter(
      id => !originalMemberIds.value.includes(id)
    );

    // 삭제된 멤버
    const removedMemberIds = originalMemberIds.value.filter(
      id => !currentMemberIds.includes(id)
    );

    console.log('원본 멤버:', originalMemberIds.value);
    console.log('현재 멤버:', currentMemberIds);
    console.log('추가할 멤버:', newMemberIds);
    console.log('삭제할 멤버:', removedMemberIds);

    const data = {
      projectId: projectIdNumber.value,
      projectTitle: project.value.projectTitle,
      projectContent: project.value.projectContent,
      projectStartDate: project.value.projectStartDate,
      projectEndDate: project.value.projectEndDate,
      userIds: newMemberIds,
      projectMilestones: []
    }

    // ✅ 삭제할 멤버가 있으면 removeUserIds 추가
    if (removedMemberIds.length > 0) {
      data.removeUserIds = removedMemberIds;
      console.log('🗑️ 삭제할 멤버 추가:', removedMemberIds);
    }

    // ✅ 로그 출력
    if (newMemberIds.length > 0) {
      console.log('➕ 새로 추가할 멤버:', newMemberIds);
    }

    if (newMemberIds.length === 0 && removedMemberIds.length === 0) {
      console.log('✅ 멤버 변경 없음');
    }


    console.log('백엔드로 전송할 데이터:', data);
    const response = await projectApi.updateProject(data);
    console.log('프로젝트 수정 응답:', response);
    console.log('응답 상태:', response.data);

    if (response.data.result !== 'success') {
      throw new Error(response.data.message || '프로젝트 수정 실패');
    }

    //기존의 마일스톤 있으면 수정, 없으면 생성
    if (project.value.projectMilestones && project.value.projectMilestones.length > 0) {
      for (let milestone of project.value.projectMilestones) {
        milestone.projectId = projectIdNumber.value;
        // console.log(projectIdNumber.value);

        if (!milestone.milestoneId) {
          const response = await projectMilestoneApi.createProjectMilestone(milestone);
        } else {
          const response = await projectMilestoneApi.updateProjectMilestone(milestone);
        }

      }
    }

    //태그 연결 선택된 태그가 있을경우만.. 무조건 태그 선택하도록해야함
    if (selectedTags.value.length > 0) {
      // const selectedTagIds = selectedTags.value.map(tag => tag.tagId);
      await tagApi.updateProjectTags({
        projectId: projectIdNumber.value,
        tagIds: selectedTags.value.map(tag => tag.tagId)
      });
    }

    router.back();

  } catch (error) {
    console.log(error);
  }

}

//기존 프로젝트 내용 조회하기
//** ===== 기존 프로젝트 내용 조회하기 (디버깅 버전) =====
async function loadProjectDetail() {
  try {
    //** 1️⃣ 프로젝트 기본 정보 불러오기
    const response = await projectApi.getProjectDetail(projectIdNumber.value);
    const data = response.data.data;
    console.log('📦 1단계: 프로젝트 기본 정보', data);

    project.value = {
      ...data,
      projectStartDate: formatDateForInput(data.projectStartDate),
      projectEndDate: formatDateForInput(data.projectEndDate),
      tagType: "PROJECT"
    };

    //** 2️⃣ 만든이 정보 불러오기
    try {
      const creatorResponse = await usersApi.usersDetailById(data.userId);
      const creatorData = creatorResponse.data.data;
      console.log('👤 2단계: 만든이 정보', creatorData);
      
      try {
        const profileResponse = await usersApi.ufAttachDownload(creatorData.userId);
        const blobUrl = URL.createObjectURL(profileResponse.data);
        creatorInfo.value = {
          userName: creatorData.userName,
          profileUrl: blobUrl
        };
      } catch {
        creatorInfo.value = {
          userName: creatorData.userName,
          profileUrl: defaultImg
        };
      }
    } catch (error) {
      console.error('❌ 만든이 정보 로드 실패:', error);
    }

    //** 3️⃣ 프로젝트 멤버 목록 불러오기
    console.log('🔍 3단계: 멤버 목록 조회 시작, projectId:', projectIdNumber.value);
    
    const memberResponse = await userprojectroleApi.getMemberList(projectIdNumber.value);
    // console.log('📥 멤버 API 전체 응답:', memberResponse);
    // console.log('📥 멤버 API result:', memberResponse.data.result);
    // console.log('📥 멤버 API data:', memberResponse.data.data);

      const members = memberResponse.data.data ||  memberResponse.data ||[];
      // console.log('👥 불러온 멤버 목록 (전체):', members);
      // console.log('👥 멤버 수:', members.length);

      //** 각 멤버의 역할 확인

      if (Array.isArray(members) && members.length > 0) {
      members.forEach((member, index) => {
        console.log(`  멤버 ${index + 1}:`, {
          userId: member.userId,
          uprRole: member.uprRole,
          isAdmin: member.uprRole === 'ADMIN'
        });
      });

      //** ADMIN이 아닌 멤버 필터링
      const nonAdminMembers = members.filter(m => m.uprRole !== 'ADMIN');
      // console.log('👥 ADMIN이 아닌 멤버:', nonAdminMembers);
      // console.log('👥 ADMIN이 아닌 멤버 수:', nonAdminMembers.length);

      //** 원본 멤버 ID 저장
      originalMemberIds.value = nonAdminMembers.map(m => m.userId);
      // console.log('💾 원본 멤버 ID 저장:', originalMemberIds.value);
      //새배열을 생성
      const loadedMembers = []; 
      //** ADMIN이 아닌 멤버들의 상세 정보 불러오기
      for (const member of nonAdminMembers) {
        // console.log(`🔄 멤버 상세 정보 조회 중: userId=${member.userId}`);
        
        const userResponse = await usersApi.usersDetailById(member.userId);
        const userData = userResponse.data.data;
        // console.log('  ✅ 상세 정보:', userData);

        //** 프로필 이미지 로드
        try {
          const profileResponse = await usersApi.ufAttachDownload(userData.userId);
          const blobUrl = URL.createObjectURL(profileResponse.data);
          userData.profileUrl = blobUrl;
          // console.log('  ✅ 프로필 이미지 로드 성공');
        } catch (error) {
          userData.profileUrl = defaultImg;
          // console.log('  ⚠️ 프로필 이미지 로드 실패, 기본 이미지 사용');
        }


        loadedMembers.push({
          userId: userData.userId,
            userEmail: userData.userEmail,
            userName: userData.userName,
            ufAttachoname: userData.ufAttachoname,
            profileUrl: userData.profileUrl
        })

        //  console.log('  ✅ loadedMembers에 추가:', loadedMembers.length, '명');
        
      }
      selectedMembers.value=loadedMembers;
      //   console.log('  ✅ selectedMembers에 추가:', selectedMembers.value.length,"명");
      // console.log('✅ 최종 selectedMembers:', selectedMembers.value);
      // console.log('✅ 최종 selectedMembers 길이:', selectedMembers.value.length);
    }else {
      //** 멤버가 없거나 배열이 아닌 경우
      console.warn('⚠️ 멤버 데이터가 없거나 잘못된 형식입니다:', members);
      selectedMembers.value = [];
      originalMemberIds.value = [];
    }
    

    //** 4️⃣ 마일스톤 불러오기
    const milestonesResponse = await projectMilestoneApi.getProjectMilestones(projectIdNumber.value);
    // console.log('📅 4단계: 마일스톤 응답', milestonesResponse.data);
    
    if (milestonesResponse.data.result === 'success') {
      project.value.projectMilestones = (milestonesResponse.data.data || []).map(milestone => ({
        ...milestone,
        milestoneDate: formatDateForInput(milestone.milestoneDate)
      }));
    } else {
      project.value.projectMilestones = [];
    }

    //** 5️⃣ 태그 내용 불러오기
    const tagResponse = await tagApi.getProjectTags(projectIdNumber.value);
    // console.log('🏷️ 5단계: 태그 응답', tagResponse.data);
    
    selectedTags.value = tagResponse.data.tags || [];

    // console.log('✅ 프로젝트 데이터 로드 완료');
    // console.log('원본 멤버 ID:', originalMemberIds.value);
    // console.log('현재 멤버:', selectedMembers.value);

  } catch (error) {
    // console.error('❌ 프로젝트 데이터 로드 실패:', error);
    // console.error('❌ 에러 상세:', error.response || error.message);
    alert('프로젝트 데이터를 불러오는데 실패했습니다.');
    router.back();
  }
}


//** ===== 날짜 포맷 변환 함수 추가 =====
function formatDateForInput(dateValue) {
  //** null, undefined, 빈 문자열 체크
  if (!dateValue) return '';

  try {
    //** Date 객체로 변환
    const date = new Date(dateValue);

    //** 유효한 날짜인지 확인
    if (isNaN(date.getTime())) return '';

    //** "YYYY-MM-DD" 형식으로 변환
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('날짜 변환 오류:', error);
    return '';
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

onMounted(() => {
  loadProjectDetail();
});


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