<template>
  <h3 class="mb-4">프로젝트 {{ props.projectId }} 일정</h3>
  <button class="btn btn-dark btn-sm m-2" @click="handleWrite()">새 일정 작성</button>
  <div class="row">
    <!-- 상태별 칼럼 -->
    <div v-for="status in statuses" :key="status" class="col-md-4">
      <div class="card shadow-sm">
        <div class="card-header text-center fw-bold">
          {{ statusLabels[status] }}
        </div>

        <!-- 드래그 가능 리스트 -->
        <VueDraggableNext v-model="quests" @end="onDragEnd" :move="onMove" tag="ul">
          <li v-for="schedule in schedulesByStatus[status]" :key="schedule.scheduleId">
            <div class="border-dark">
              <div><small>{{ formatDate(schedule.scheduleStartDate) }}~{{ formatDate(schedule.scheduleEndDate) }}</small></div>
              <!-- <p>{{ schedule.scheduleEndDate }}</p> -->
              <a href="#" class="text-primary" @click.prevent="openModal(schedule)">{{ schedule.scheduleTitle }}</a>
              <!-- <p>{{ schedule.scheduleTitle }}</p> -->
              <button class="btn btn-warning btn-sm" @click="handleUpdate(schedule.scheduleId)">수정</button>
            </div>
            <button v-if="!schedule.scheduleStatus" @click="deleteQuest(schedule.scheduleId)">삭제</button>
          </li>
        </VueDraggableNext>

      </div>
    </div>
  </div>

  <!-- 일정 상세 모달 -->
  <div class="modal fade" id="scheduleModal" tabindex="-1" aria-labelledby="scheduleModalLabel" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="scheduleModalLabel">
            일정 상세보기
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" v-if="selectedSchedule">
          <!-- 일정 제목 -->
          <div class="mb-3">
            <label class="form-label">일정명</label>
            <input type="text" class="form-control" v-model="selectedSchedule.scheduleTitle" disabled />
          </div>

          <!-- 일정 내용 -->
          <div class="mb-3">
            <label class="form-label">일정 내용</label>
            <textarea class="form-control" v-model="selectedSchedule.scheduleContent" rows="3" disabled></textarea>
          </div>

          <!-- 일정 기간 -->
          <div class="mb-3">
            <label class="form-label">일정 기간</label>
            <div class="row m-1">
              <div class="col-6">
                <input type="text" class="form-control" :value="formatDate(selectedSchedule.scheduleStartDate)" disabled />
              </div>
              <div class="col-md-1 d-flex align-items-center justify-content-center">
                <span>부터</span>
              </div>
            </div>
            <div class="row m-1">
              <div class="col-6">
                <input type="text" class="form-control" :value="formatDate(selectedSchedule.scheduleEndDate)" disabled />
              </div>
              <div class="col-md-1 d-flex align-items-center justify-content-center">
                <span>까지</span>
              </div>
            </div>

          </div>

          <!-- 담당자 -->
          <div class="mb-3">
            <label class="form-label">담당자</label><br />
            <span v-for="user in selectedSchedule.users" :key="user.userId" class="badge bg-secondary me-1">
              {{ user.userName }}
            </span>
          </div>

          <!-- 상태 -->
          <div class="mb-3">
            <label class="form-label">일정 상태</label>
            <input type="text" class="form-control" :value="selectedSchedule.scheduleStatus" disabled />
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            닫기
          </button>
          <button type="button" class="btn btn-primary" @click="editSchedule(selectedSchedule.scheduleId)">
            수정하기
          </button>
        </div>
      </div>
    </div>
  </div>


</template>

<!--컴포넌트의 초기화 또는 이벤트 처리-->
<script setup>
import projectApi from '@/apis/projectApi';
import scheduleApi from '@/apis/scheduleApi';
import { Modal } from 'bootstrap';
import { reactive } from 'vue';
import { ref } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';
import { RouterLink, useRoute, useRouter } from 'vue-router';

const props = defineProps(['projectId']);

const scheduleList = ref([]);

const router = useRouter();

const route = useRoute();

const statuses = ["NOT STARTED", "IN PROGRESS", "DONE"];
const statusLabels = {
  "NOT STARTED": "시작되지 않음",
  "IN PROGRESS": "진행 중",
  "DONE": "완료됨",
};

const schedulesByStatus = reactive({
  "NOT STARTED": [],
  "IN PROGRESS": [],
  "DONE": [],
});

const selectedSchedule = ref(null);

const modalRef = ref(null);
let modalInstance = null;

async function loadSchedule() {
  try {
    console.log("스케쥴 조회 시작")
    const response = await projectApi.getProjectSchedulesList(route.params.projectId);
    scheduleList.value = response.data;
    if (response.data.result === 'success') {
      scheduleList.value = response.data.data || [];
      console.log("스케줄 목록:", scheduleList.value);

      scheduleList.value.forEach(schedule => {
        // console.log("~~~", schedule);
        if (schedulesByStatus[schedule.scheduleStatus]) {
          schedulesByStatus[schedule.scheduleStatus].push(schedule);
        }
      })

      scheduleList.value.forEach(async schedule => {
        schedule.users = await loadScheduleMember(schedule.scheduleId);
      });
      console.log("스케쥴 로드완료");
    } else {
      console.error('스케줄 조회 실패:', response.data.message);
      scheduleList.value = [];
    }
  } catch (error) {
    console.log('스케쥴 목록 조회 실패');
  }
}

async function loadScheduleMember(scheduleId) {
  try {
    const response = await scheduleApi.getScheduleMemberList(scheduleId);
    const result = response.data;
    return result.data;
  } catch (error) {
    console.log(error);
  }
}

async function handleWrite() {
  try {
    router.push(`schedule/write`);
  } catch (error) {
    console.log(error);
  }
}

async function handleUpdate(scheduleId) {
  try {
    router.push(`schedule/${scheduleId}/update`);
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

function openModal(schedule) {
  selectedSchedule.value = schedule;
  if (!modalInstance) {
    modalInstance = new Modal(modalRef.value);
  }
  modalInstance.show();
}

loadSchedule();

</script>
<!--컴포넌트의 스타일 정의-->
<style scoped></style>