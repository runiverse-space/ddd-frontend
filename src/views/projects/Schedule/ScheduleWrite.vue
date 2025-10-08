<template>
  <div class="container-fluid my-3">
    <h1>일정 생성 화면</h1>
    <form @submit.prevent="handleSubmit()">
      <div class="row">
        <div class="col-md-8">

          <!-- 일정 제목 -->
          <div class="form-section mt-3">
            <p class="text-muted small">일정 제목 <span class="text-danger">*</span></p>
            <input type="text" class="form-control mb-3" placeholder="일정 제목을 입력합니다" v-model="schedule.scheduleTitle" />
          </div>

          <!-- 일정 내용 -->
          <div class="form-section mt-3">
            <p class="text-muted small">일정 내용</p>
            <input type="text" class="form-control mb-3" placeholder="일정 내용을 입력합니다" v-model="schedule.scheduleContent" />
          </div>

          <!-- 일정 기간 -->
          <div class="form-section mt-3">
            <p class="text-muted small">일정 시작일자를 선택해주세요.</p>
            <input type="date" class="form-control mb-3" v-model="schedule.scheduleStartDate" />
            <p class="text-muted small ">일정 종료일자를 선택해주세요.</p>
            <input type="date" class="form-control" v-model="schedule.scheduleEndDate" />
          </div>

          <!-- 초기 상태 설정 -->
          <div class="form-section mt-3">
            <p class="text-muted small">초기 상태 설정</p>
            <select class="form-select mb-3" v-model="schedule.scheduleStatus">
              <option value="NOT STARTED">시작되지 않음</option>
              <option value="IN PROGRESS">진행 중</option>
              <option value="DONE">완료됨</option>
            </select>
          </div>

          <!-- 추가 가능한 사용자(프로젝트 멤버) 조회 -->
          <div class="form-section mt-3">
            <p class="text-muted small">일정을 배정할 멤버 선택</p>
            <p v-for="projectMember in projectMemberList" :key="projectMember">
              <button type="button" class="btn btn-sm" :class="scheduleMemberList.includes(projectMember.userId) ? 'btn-primary' : 'btn-outline-primary'" @click="toggleScheduleMember(projectMember)">
                {{ projectMember.userLoginId }} {{ projectMember.userName }}
              </button>
            </p>
          </div>

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
  scheduleStatus: route.query.status || "NOT STARTED",
});

const scheduleMemberList = ref([]);

const projectMemberList = ref([]);

const userProjectRoleList = ref([]);

async function handleSubmit() {
  try {
    schedule.value.userIds = scheduleMemberList;
    const response = await scheduleApi.scheduleCreate(schedule.value);
    const result = response.data;
    if (result.result === "success") {
      router.push(`/project/${route.params.projectId}/schedule`);
    }
  } catch (error) {
    console.log(error);
  }
}

async function loadProjectMembers() {
  try {
    const response = await projectApi.getProjectMembersList(projectId);
    if (response.data.result === 'success') {
      userProjectRoleList.value = response.data.data || [];

      // projectMemberList에 사용자 정보 삽입
      userProjectRoleList.value.forEach(async userProjectRole => {
        const response = await usersApi.usersDetailById(userProjectRole.userId);
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
  if (scheduleMemberList.value.includes(scheduleMember.userId)) {
    scheduleMemberList.value = scheduleMemberList.value.filter((t) => t !== scheduleMember.userId);
  } else {
    scheduleMemberList.value.push(scheduleMember.userId);
  }
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