<template>
  <div class="container-fluid my-5">
    <h1>일정 {{ route.params.scheduleId }} 수정 화면</h1>
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
            <input type="text" class="form-control" placeholder="시작 일시를 입력합니다" v-model="schedule.scheduleStartDate" />
          </div>

          <!-- 종료 일시 -->
          <div class="mb-3">
            <label class="form-label">종료 일시 <span class="text-danger">*</span></label>
            <input type="text" class="form-control" placeholder="종료 일시를 입력합니다" v-model="schedule.scheduleEndDate" />
          </div>

          <!-- 초기 상태 설정 -->
          <div class="mb-3">
            <label class="form-label">초기 상태 설정</label>
            <input type="text" class="form-control" placeholder="초기 상태를 설정하세요" v-model="schedule.scheduleStatus" />
          </div>

          <!-- 추가 가능한 사용자(프로젝트 멤버) 조회 -->
          <p v-for="projectMember in projectMemberList" :key="projectMember">
            <button type="button" class="btn btn-sm" :class="scheduleMemberList.includes(projectMember.userId) ? 'btn-primary' : 'btn-outline-primary'" 
            @click="toggleScheduleMember(projectMember)">
              {{ projectMember.userLoginId }} {{ projectMember.userName }}
            </button>
          </p>

          <button class="btn btn-dark btn-sm m-2">일정 수정</button>
          <button type="button" class="btn active btn-sm m-2" @click="handleReset()">원래대로</button>
          <button type="button" class="btn active btn-sm m-2" @click="handleCancel()">취소</button>

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
  scheduleStatus: "",
});

const scheduleMemberList = ref([]);

const projectMemberList = ref([]);

const userProjectRoleList = ref([]);

const originalSchedule = ref();

async function handleSubmit() {
  try {
    schedule.value.userIds = scheduleMemberList;
    // const response = await scheduleApi.scheduleCreate(schedule.value);
    // const result = response.data;
    // console.log(result);
    // if (result.result === "success") {
    //   router.push(`/project/${route.params.projectId}/schedule`);
    // }
    console.log(schedule.value);
    console.log(scheduleMemberList.value);
    
    const response = await scheduleApi.scheduleUpdate(schedule.value);
    const result = response.data;
    if (result.result === "success") {
      router.push(`/project/${route.params.projectId}/schedule`)
    } else {
      console.log(result.message);
    }
  } catch (error) {
    console.log(error);
  }
}

async function loadSchedule() {
  try {
    const response = await scheduleApi.getSchedule(route.params.scheduleId);
    const result = response.data;
    // console.log(result);
    if (result.result === "success") {
      schedule.value = structuredClone(result.data);
      originalSchedule.value = structuredClone(result.data);
      console.log("originalSchedule", originalSchedule.value);
    }
  } catch (error) {
    console.log(error);
  }
}

async function loadScheduleMembers() {
  try {
    const response = await scheduleApi.getScheduleMemberList(route.params.scheduleId);
    const result = response.data;
    console.log("~~~", result);
    if (result.result === "success") {
      console.log("일정 멤버 목록");
      console.log(result.data);
      result.data.forEach(user => scheduleMemberList.value.push(user.userId));
    } else {
      console.log(result.message);
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
  }, {deep: true}
);

function handleReset() {
  console.log("원래대로");
  schedule.value = originalSchedule.value;
  console.log(originalSchedule.value);
}

function handleCancel() {
  router.push(`/project/${route.params.projectId}/schedule`);
}

loadSchedule();

loadScheduleMembers();

loadProjectMembers();
</script>

<!--컴포넌트의 스타일 정의-->
<style scoped></style>