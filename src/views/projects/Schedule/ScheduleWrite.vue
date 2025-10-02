<template>
  <div class="container-fluid my-5">
    <h1>일정 생성 화면</h1>
    <form @submit.prevent="handleSubmit()">
      <div class="row">
        <div class="col-md-12">

          <!-- 일정 제목 -->
          <div class="mb-3">
            <label class="form-label">일정 제목 <span class="text-danger">*</span></label>
            <input type="text" class="form-control" placeholder="일정 제목을 입력합니다" v-model="schedule.scheduleTitle" />
          </div>

          <!-- 일정 내용 -->
          <div class="mb-3">
            <label class="form-label">일정 내용</label>
            <input type="text" class="form-control" placeholder="일정 내용을 입력합니다" v-model="schedule.scheduleContent" />
          </div>

          <!-- 시작 일시 -->
          <div class="mb-3">
            <label class="form-label">시작 일시 <span class="text-danger">*</span></label>
            <input type="text" class="form-control" placeholder="yyyy-mm-dd" v-model="schedule.scheduleStartDate" />
          </div>

          <!-- 종료 일시 -->
          <div class="mb-3">
            <label class="form-label">종료 일시 <span class="text-danger">*</span></label>
            <input type="text" class="form-control" placeholder="yyyy-mm-dd" v-model="schedule.scheduleEndDate" />
          </div>

          <!-- 초기 상태 설정 -->
          <div class="mb-3">
            <label class="form-label">초기 상태 설정</label>
            <select class="form-select" v-model="schedule.scheduleStatus">
              <option value="NOT STARTED">시작되지 않음</option>
              <option value="IN PROGRESS">진행 중</option>
              <option value="DONE">완료됨</option>
            </select>
          </div>

          <!-- 추가 가능한 사용자(프로젝트 멤버) 조회 -->
          <p v-for="projectMember in projectMemberList" :key="projectMember">
            <button type="button" class="btn btn-sm" :class="scheduleMemberList.includes(projectMember.userId) ? 'btn-primary' : 'btn-outline-primary'" @click="toggleScheduleMember(projectMember)">
              {{ projectMember.userLoginId }} {{ projectMember.userName }}
            </button>
          </p>

          <button class="btn btn-dark btn-sm">일정 생성</button>

        </div>

      </div>
    </form>
  </div>

</template>

<!--컴포넌트의 초기화 또는 이벤트 처리-->
<script setup>
import projectApi from '@/apis/projectApi';
import scheduleApi from '@/apis/scheduleApi';
import usersApi from '@/apis/usersApi';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();

const router = useRouter();

const route = useRoute();

const projectId = route.params.projectId;

const userId = store.state.userId;

const schedule = ref({
  projectId,
  userId,
  scheduleTitle: "",
  scheduleContent: "",
  scheduleStartDate: "",
  scheduleEndDate: "",
  scheduleStatus: "NOT STARTED",
});

const scheduleMemberList = ref([]);

const projectMemberList = ref([]);

const userProjectRoleList = ref([]);

async function handleSubmit() {
  try {
    schedule.value.userIds = scheduleMemberList;
    const response = await scheduleApi.scheduleCreate(schedule.value);
    const result = response.data;
    // console.log(result);
    if (result.result === "success") {
      router.push(`/project/${route.params.projectId}/schedule`);
    }
  } catch (error) {
    console.log(error);
  }
}

async function loadProjectMembers() {
  console.log("모든 프로젝트의 멤버 목록 조회 시작")
  try {
    console.log(`프로젝트 ${projectId}의 멤버 목록 조회 시작`);
    const response = await projectApi.getProjectMembersList(projectId);
    if (response.data.result === 'success') {
      userProjectRoleList.value = response.data.data || [];
      console.log("멤버 목록:", userProjectRoleList.value);

      // projectMemberList에 사용자 정보 삽입
      userProjectRoleList.value.forEach(async userProjectRole => {
        const response = await usersApi.usersDetail(userProjectRole.userId);
        const result = response.data;
        projectMemberList.value.push(result.data);
      });
    } else {
      console.log('멤버 조회 실패:', response.data.message);
      projectMemberList.value = [];
    }
  } catch (error) {
    console.log('멤버 목록 조회 실패:', error);
  }
}

// 일정 멤버 토글 함수
function toggleScheduleMember(scheduleMember) {
  // console.log(structuredClone(selectedTagList));
  if (scheduleMemberList.value.includes(scheduleMember.userId)) {
    scheduleMemberList.value = scheduleMemberList.value.filter((t) => t !== scheduleMember.userId);
  } else {
    scheduleMemberList.value.push(scheduleMember.userId);
  }
  // emit("handleTagEvent", tag)
}

watch(scheduleMemberList, (newScheduleMemberList, oldScheduleMemberList) => {
  console.log("선택된 멤버:", structuredClone(newScheduleMemberList));
}, { deep: true }
);

function handleCancel() {
  router.back();
}

loadProjectMembers();
</script>

<!--컴포넌트의 스타일 정의-->
<style scoped></style>