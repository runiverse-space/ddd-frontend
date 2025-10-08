<template>
  <h3 v-if="projectInfo">{{ projectInfo.projectTitle }} - 일정</h3>
  <button class="btn btn-dark btn-sm m-2" @click="handleWrite()">새 일정 작성</button>
  <div class="row">
    <!-- 상태별 칼럼 -->
    <div v-for="status in statuses" :key="status" class="col-md-4 ">
      <div class="card shadow-sm border-0 h-100">
        <div class="card-header text-center fw-bold bg-light">
          <span class="badge me-2" :class="{
            'bg-secondary': status === 'NOT STARTED',
            'bg-primary': status === 'IN PROGRESS',
            'bg-success': status === 'DONE'
          }">●{{ statusLabels[status] }}</span>

        </div>

        <!-- 드래그 가능 리스트 -->
        <VueDraggableNext v-model="schedulesByStatus[status]" group="schedules" @end="onDragEnd($event)"
          :data-status="status" tag="div" class="p-2">
          <div v-for="schedule in schedulesByStatus[status]" :key="schedule.scheduleId"
            class="card m-2 shadow-sm border-0">
            <div class="card-body p-2">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <div class="text-muted small">
                    <i class="bi bi-calendar-event">
                      {{ formatDate(schedule.scheduleStartDate) }}~{{ formatDate(schedule.scheduleEndDate) }}
                    </i>
                  </div>
                </div>

              </div>
              <a href="#" class="fw-bold text-decoration-none text-dark" @click.prevent="openModal(schedule)">
                {{ schedule.scheduleTitle }}
              </a>
              <!-- 일정 멤버의 프로필 사진 -->
              <div v-for="user in schedule.users" :key="user.userId" class="d-inline-block me-1">
                <div v-if="user.profileUrl">
                  <img :src="user.profileUrl" class="rounded-circle" width="20" height="20" />
                </div>
                <div v-else class="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                  style="width: 30px; height: 30px; font-size: 14px;">
                  {{ user.userName.charAt(0) }}
                </div>
              </div>
            </div>
          </div>
        </VueDraggableNext>

      </div>
    </div>
  </div>

  <!-- 일정 상세 모달 -->
  <div class="modal fade" id="scheduleModal" tabindex="-1" aria-labelledby="scheduleModalLabel" aria-hidden="true"
    ref="modalRef">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="scheduleModalLabel">
            일정 상세보기
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
            @click="editMode = false"></button>
        </div>
        <div class="modal-body" v-if="selectedSchedule">
          <!-- 일정 제목 -->
          <div class="mb-3">
            <label class="form-label">일정명</label>
            <input type="text" class="form-control" v-model="selectedSchedule.scheduleTitle" :disabled="!editMode" />
          </div>

          <!-- 일정 내용 -->
          <div class="mb-3">
            <label class="form-label">일정 내용</label>
            <textarea class="form-control" v-model="selectedSchedule.scheduleContent" rows="3"
              :disabled="!editMode"></textarea>
          </div>

          <!-- 일정 기간 -->
          <div class="mb-3">
            <label class="form-label">일정 기간</label>
            <div class="row m-1">
              <div class="col-6">
                <input type="text" class="form-control" :value="formatDate(selectedSchedule.scheduleStartDate)"
                  :disabled="!editMode" />
              </div>
              <div class="col-md-1 d-flex align-items-center justify-content-center">
                <span>부터</span>
              </div>
            </div>
            <div class="row m-1">
              <div class="col-6">
                <input type="text" class="form-control" :value="formatDate(selectedSchedule.scheduleEndDate)"
                  :disabled="!editMode" />
              </div>
              <div class="col-md-1 d-flex align-items-center justify-content-center">
                <span>까지</span>
              </div>
            </div>

          </div>

          <!-- 담당자(읽기 모드) -->
          <div class="mb-3" v-if="!editMode">
            <label class="form-label">담당자</label><br />
            <span v-for="user in selectedSchedule.users" :key="user.userId" class="badge bg-secondary me-1">
              {{ user.userName }}
            </span>
          </div>

          <!-- 담당자(수정 모드) -->
          <div class="mb-3" v-if="editMode">
            <label class="form-label">담당자 선택</label><br />
            <span v-for="projectMember in projectMemberList" :key="projectMember.userId" style="cursor: pointer;"
              class="badge me-1"
              :class="scheduleMemberList.includes(projectMember.userId) ? 'bg-secondary' : 'bg-light text-dark'"
              @click="toggleScheduleMember(projectMember)">
              {{ projectMember.userName }}
              ({{ projectMember.userLoginId }})
            </span>
          </div>

          <!-- 진행 상태 -->
          <div class="mb-3">
            <label class="form-label">진행 상태</label>
            <select class="form-select" v-model="selectedSchedule.scheduleStatus" :disabled="!editMode">
              <option value="NOT STARTED">시작되지 않음</option>
              <option value="IN PROGRESS">진행 중</option>
              <option value="DONE">완료됨</option>
            </select>
          </div>
        </div>

        <!-- 하단 버튼 구역 -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="editMode = false">
            닫기
          </button>
          <button type="button" class="btn btn-primary" @click="handleEdit()" v-if="!editMode">
            수정하기
          </button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="handleConfirm()" v-if="editMode">
            수정확인
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
import usersApi from '@/apis/usersApi';
import { Modal } from 'bootstrap';
import { onMounted, reactive } from 'vue';
import { ref } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps(['projectId']);

const router = useRouter();

const route = useRoute();

const scheduleList = ref([]);
const projectInfo = ref(null);
const projectMemberList = ref([]);
const userProjectRoleList = ref([]);
const scheduleMemberList = ref([]);

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

const editMode = ref(false);

async function loadSchedule() {
  try {
    const response = await projectApi.getProjectSchedulesList(route.params.projectId);
    scheduleList.value = response.data;
    if (response.data.result === 'success') {
      scheduleList.value = response.data.data || [];

      // 스케줄 목록을 로드할 때마다 상태별로 초기화
      schedulesByStatus["NOT STARTED"] = [];
      schedulesByStatus["IN PROGRESS"] = [];
      schedulesByStatus["DONE"] = [];

      scheduleList.value.forEach(async schedule => {
        schedule.users = await loadScheduleMembers(schedule.scheduleId);
        // schedu
        for (const user of schedule.users) {
          try {
            const res = await usersApi.ufAttachDownload(user.userId);
            const blob = new Blob([res.data], { type: res.headers['content-type'] });
            user.profileUrl = URL.createObjectURL(blob);
          } catch {
            user.profileUrl = null; // 이미지 없으면 기본 아바타 표시 가능
          }
        }
        if (schedulesByStatus[schedule.scheduleStatus]) {
          schedulesByStatus[schedule.scheduleStatus].push(schedule);
        }
      });

    } else {
      console.error('스케줄 조회 실패:', response.data.message);
      scheduleList.value = [];
    }
  } catch (error) {
    console.log('스케쥴 목록 조회 실패');
  }
}

async function loadScheduleMembers(scheduleId) {
  try {
    const response = await scheduleApi.getScheduleMemberList(scheduleId);
    const result = response.data;
    if (result.result !== "success") {
      console.log(result.message);
      scheduleMemberList.value = [];
    }
    return result.data;
  } catch (error) {
    console.log(error);
  }
}

async function getProjectDetail() {
  try {
    const response = await projectApi.getProjectDetail(props.projectId);
    console.log(response);
    projectInfo.value = response.data.data;
    console.log('프로젝트 정보', projectInfo.value);

  } catch (error) {
    console.log(error);
  }
}

async function loadProjectMembers() {
  try {
    const response = await projectApi.getProjectMembersList(props.projectId);
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

async function handleWrite() {
  try {
    router.push(`schedule/write`);
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

async function openModal(schedule) {
  selectedSchedule.value = schedule;
  console.log("선택된 일정", selectedSchedule.value);
  selectedSchedule.value.users = await loadScheduleMembers(schedule.scheduleId);

  scheduleMemberList.value = selectedSchedule.value.users.map(user => user.userId);

  console.groupEnd();
  if (!modalInstance) {
    modalInstance = new Modal(modalRef.value);
  }
  modalInstance.show();
}

function handleEdit() {
  editMode.value = true;
}

async function handleConfirm() {
  editMode.value = false;
  console.group("handleConfirm()");
  console.groupEnd();
  try {
    selectedSchedule.value.userIds = scheduleMemberList;
    const response = await scheduleApi.scheduleUpdate(selectedSchedule.value);
    const result = response.data;
    if (result.result === "success") {
      await loadSchedule();
      await loadScheduleMembers(selectedSchedule.value.scheduleId);
    } else {
      console.log(result.message);
    }
  } catch (error) {
    console.log(error);
  }
}

// 일정 멤버 토글 함수
function toggleScheduleMember(projectMember) {
  if (scheduleMemberList.value.includes(projectMember.userId)) {
    scheduleMemberList.value = scheduleMemberList.value.filter((t) => t !== projectMember.userId);
  } else {
    scheduleMemberList.value.push(projectMember.userId);
  }
}

async function onDragEnd(event) {
  try {
    const newStatus = event.to.dataset.status;   // 드롭된 컬럼

    const movedSchedule = ref(schedulesByStatus[newStatus][event.newIndex]);

    movedSchedule.value.users = await loadScheduleMembers(movedSchedule.value.scheduleId);
    movedSchedule.value.userIds = movedSchedule.value.users.map(user => user.userId);

    if (!movedSchedule.value) return;

    if (movedSchedule.value.scheduleStatus !== newStatus) {
      movedSchedule.value.scheduleStatus = newStatus;

      const response = await scheduleApi.scheduleUpdate(movedSchedule.value);
      const result = response.data;
      if (result.result === "success") {
        console.log("상태 업데이트 완료");
      } else {
        console.log("상태 업데이트 실패:", response.message);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  console.log("일정 컴포넌트 마운트");
  await getProjectDetail();
  await loadSchedule();
  await loadProjectMembers();
})


</script>
<!--컴포넌트의 스타일 정의-->
<style scoped></style>