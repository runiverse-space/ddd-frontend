<template>
  <div>
    <h1>프로젝트 {{ props.projectId }} 일정</h1>

    <table class="table align-middle">
      <thead>
        <tr>
          <th scope="col">제목</th>
          <th scope="col">내용</th>
          <th scope="col">시작</th>
          <th scope="col">종료</th>
          <th scope="col">상태</th>
          <th scope="col">담당자</th>
          <th scope="col">수정</th>
        </tr>
      </thead>
      <tbody v-for="schedule in scheduleList" :key="schedule.scheduleId">
        <tr>
          <td>{{ schedule.scheduleTitle }}</td>
          <td>{{ schedule.scheduleContent }}</td>
          <td>{{ formatDate(schedule.scheduleStartDate) }}</td>
          <td>{{ formatDate(schedule.scheduleEndDate) }}</td>
          <td>{{ schedule.scheduleStatus }}</td>
          <td><span v-for="user in schedule.users" :key="user.userId">{{ user.userName }}&nbsp;&nbsp;</span></td>
          <td><button class="btn btn-warning btn-sm" @click="handleUpdate()">수정</button></td>
        </tr>

      </tbody>
    </table>

    <button class="btn btn-dark btn-sm m-2" @click="handleWrite()">새 일정 작성</button>

  </div>
</template>

<!--컴포넌트의 초기화 또는 이벤트 처리-->
<script setup>
import projectApi from '@/apis/projectApi';
import scheduleApi from '@/apis/scheduleApi';
import { ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

const props = defineProps(['projectId']);

const scheduleList = ref([]);

const router = useRouter();

const route = useRoute();

async function loadSchedule() {
  try {
    console.log("스케쥴 조회 시작")
    const response = await projectApi.getProjectSchedulesList(route.params.projectId);
    scheduleList.value = response.data;
    if (response.data.result === 'success') {
      scheduleList.value = response.data.data || [];
      console.log("스케줄 목록:", scheduleList.value);
    } else {
      console.error('스케줄 조회 실패:', response.data.message);
      scheduleList.value = [];
    }
    scheduleList.value.forEach(async schedule => {
      schedule.users = await loadScheduleMember(schedule.scheduleId);
    });
  } catch (error) {
    console.log('스케쥴 목록 조회 실패');
  }
  console.log("스케쥴 로드완료");
}

async function loadScheduleMember(scheduleId) {
  try {
    const response = await scheduleApi.getScheduleMemberList(scheduleId);
    const result = response.data;
    // console.log(result.users);
    return result.users;
  } catch (error) {
    console.log(error);
  }
}

async function handleUpdate() {
  try {
    1;
  } catch (error) {
    console.log(error)
  }
}

async function handleWrite() {
  try {
    router.push(`/project/${route.params.projectId}/schedule/new`);
  } catch (error) {
    console.log(error);
  }
}

function formatDate(dataString) {
  if (!dataString) return '';
  const date = new Date(dataString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

loadSchedule();

</script>
<!--컴포넌트의 스타일 정의-->
<style scoped></style>