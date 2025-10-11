<template>
  <div class="schedule-page">
    <div class="calendar-header-ui">
      <!-- ✅ 요일 + 날짜 -->
      <h3 class="today-title" v-if="todayLabel">
        <span class="day">{{ todayLabel?.split(",")[0] || "" }},</span>
        <span class="date">{{ todayLabel?.split(",")[1] || "" }}</span>
      </h3>
    </div>
  </div>

  <!-- <button class="btn btn-dark btn-sm m-2" @click="handleWrite()">새 일정 작성</button> -->
  <div class="board-container">
    <div
      v-for="status in statuses"
      :key="status"
      class="status-column"
      :class="{
        'not-started': status === 'NOT STARTED',
        'in-progress': status === 'IN PROGRESS',
        done: status === 'DONE',
      }"
    >
      <!-- 상태 제목 -->
      <div class="column-header">
        <span class="status-dot"></span>
        {{ statusLabels[status] }}
      </div>

      <VueDraggableNext v-model="schedulesByStatus[status]" group="schedules" @end="onDragEnd($event)" :data-status="status" tag="div" class="p-2">
        <!-- 일정 카드 -->
        <div v-for="schedule in schedulesByStatus[status]" :key="schedule.scheduleId" class="schedule-card">
          <div class="card-top">
            <div class="date">
              <CalendarIcon class="icon" />
              {{ formatDate(schedule.scheduleStartDate) }} - {{ formatDate(schedule.scheduleEndDate) }}
            </div>
            <div class="card-icons">
              <ListBulletIcon class="action-icon" title="상세보기" @click="openModal(schedule)" />
              <PencilSquareIcon
                class="action-icon"
                title="수정하기"
                @click="
                  () => {
                    openModal(schedule);
                    handleEdit();
                  }
                "
              />
              <XMarkIcon class="action-icon" title="삭제하기" @click="handleDelete(schedule)" />
            </div>
          </div>

          <div class="card-title">{{ schedule.scheduleTitle }}</div>

          <div class="card-members">
            <img v-for="user in schedule.users" :key="user.userId" :src="user.profileUrl" class="profile-img" />
          </div>
        </div>

        <!-- 새 일정 추가 -->
        <div class="add-schedule" @click="handleWrite(status)">
          <PlusIcon class="plus-icon" />
          + 새 일정 추가
        </div>
      </VueDraggableNext>
    </div>
  </div>

  <!-- 일정 삭제 모달 -->
  <div class="modal fade" id="scheduleDeleteModal" tabindex="-1" aria-labelledby="scheduleDeleteModalLabel" aria-hidden="true" ref="deleteModalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="scheduleDeleteModalLabel">일정 삭제</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">삭제된 일정은 복구할 수 없습니다. 정말 삭제하시겠습니까?</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">아니요</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="handleDeleteConfirm()">예</button>
        </div>
      </div>
    </div>
  </div>

  <BaseModal :show="showDeleteCompleted" type="default" title="일정 삭제 완료" @close="showDeleteCompleted = false">
    일정이 삭제되었습니다.
  </BaseModal>

  <!-- 일정 상세 모달 -->
  <div class="modal fade" id="scheduleDetailModal" tabindex="-1" aria-labelledby="scheduleModalLabel" aria-hidden="true" ref="detailModalRef">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="scheduleModalLabel">일정 상세보기</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="editMode = false"></button>
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
            <textarea class="form-control" v-model="selectedSchedule.scheduleContent" rows="3" :disabled="!editMode"></textarea>
          </div>

          <!-- 일정 기간(수정 모드) -->
          <div class="mb-3" v-if="editMode">
            <p class="text-muted small">일정 시작일자를 선택해주세요.</p>
            <input type="date" class="form-control mb-3" v-model="selectedSchedule.scheduleStartDate" />
            <p class="text-muted small">일정 종료일자를 선택해주세요.</p>
            <input type="date" class="form-control" v-model="selectedSchedule.scheduleEndDate" />
          </div>

          <!-- 일정 기간(일기 모드) -->
          <div class="mb-3" v-if="!editMode">
            <label class="form-label">일정 기간</label>
            <div class="row m-1">
              <div class="col-6">
                <input type="text" class="form-control" :value="formatDate(selectedSchedule.scheduleStartDate)" :disabled="!editMode" />
              </div>
              <div class="col-md-1 d-flex align-items-center justify-content-center">
                <span>부터</span>
              </div>
            </div>
            <div class="row m-1">
              <div class="col-6">
                <input type="text" class="form-control" :value="formatDate(selectedSchedule.scheduleEndDate)" :disabled="!editMode" />
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
            <span v-for="projectMember in projectMemberList" :key="projectMember.userId" style="cursor: pointer" class="badge me-1" :class="scheduleMemberList.includes(projectMember.userId) ? 'bg-secondary' : 'bg-light text-dark'" @click="toggleScheduleMember(projectMember)">
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

          <!-- 하단 버튼 구역 -->
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="editMode = false">닫기</button>
            <button type="button" class="btn btn-primary" @click="handleEdit()" v-if="!editMode">수정하기</button>
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="handleUpdateConfirm()" v-if="editMode">수정확인</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!--컴포넌트의 초기화 또는 이벤트 처리-->
<script setup>
import projectApi from "@/apis/projectApi";
import scheduleApi from "@/apis/scheduleApi";
import usersApi from "@/apis/usersApi";
import BaseModal from "@/components/BaseModal.vue";
import { CalendarIcon, ListBulletIcon, PencilSquareIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { Modal } from "bootstrap";
import { computed, onMounted, reactive } from "vue";
import { ref } from "vue";
import { VueDraggableNext } from "vue-draggable-next";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const props = defineProps(["projectId"]);

const router = useRouter();

const route = useRoute();

const store = useStore();

const scheduleList = ref([]);
const projectInfo = ref(null);
const projectMemberList = ref([]);
const userProjectRoleList = ref([]);
const scheduleMemberList = ref([]);

const todayLabel = computed(() => {
  const now = new Date();
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
  const month = now.toLocaleString("en-US", { month: "short" });
  return `${weekday}, ${now.getDate()} ${month}`;
});

const statuses = ["NOT STARTED", "IN PROGRESS", "DONE"];

const statusLabels = {
  "NOT STARTED": "시작되지 않음",
  "IN PROGRESS": "진행 중",
  DONE: "완료됨",
};

const schedulesByStatus = reactive({
  "NOT STARTED": [],
  "IN PROGRESS": [],
  DONE: [],
});

const selectedSchedule = ref(null);

const detailModalRef = ref(null);
const deleteModalRef = ref(null);
let modalInstance = null;

const showDeleteCompleted = ref(false);

const editMode = ref(false);

async function loadSchedule() {
  try {
    const response = await projectApi.getProjectSchedulesList(route.params.projectId);
    scheduleList.value = response.data;
    if (response.data.result === "success") {
      scheduleList.value = response.data.data || [];

      // 스케줄 목록을 로드할 때마다 상태별로 초기화
      schedulesByStatus["NOT STARTED"] = [];
      schedulesByStatus["IN PROGRESS"] = [];
      schedulesByStatus["DONE"] = [];

      scheduleList.value.forEach(async (schedule) => {
        schedule.users = await loadScheduleMembers(schedule.scheduleId);
        for (const user of schedule.users) {
          try {
            const res = await usersApi.ufAttachDownload(user.userId);
            const blob = new Blob([res.data], { type: res.headers["content-type"] });
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
      console.error("스케줄 조회 실패:", response.data.message);
      scheduleList.value = [];
    }
  } catch (error) {
    console.log("스케쥴 목록 조회 실패");
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
    projectInfo.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
}

async function loadProjectMembers() {
  try {
    const response = await projectApi.getProjectMembersList(props.projectId);
    if (response.data.result === "success") {
      userProjectRoleList.value = response.data.data || [];

      // projectMemberList에 사용자 정보 삽입
      userProjectRoleList.value.forEach(async (userProjectRole) => {
        const response = await usersApi.usersDetailById(userProjectRole.userId);
        const result = response.data;
        projectMemberList.value.push(result.data);
      });
    } else {
      console.log("멤버 조회 실패:", response.data.message);
      projectMemberList.value = [];
    }
  } catch (error) {
    console.log("멤버 목록 조회 실패:", error);
  }
}

async function handleWrite(status) {
  try {
    router.push(`schedule/write?status=${status}`);
  } catch (error) {
    console.log(error);
  }
}

function formatDate(dataString) {
  if (!dataString) return "";
  const date = new Date(dataString);
  return date.toLocaleString("ko-KR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    // hour: '2-digit',
    // minute: '2-digit'
  });
}

async function openModal(schedule) {
  editMode.value = false;
  selectedSchedule.value = schedule;
  selectedSchedule.value.users = await loadScheduleMembers(schedule.scheduleId);

  scheduleMemberList.value = selectedSchedule.value.users.map((user) => user.userId);

  console.groupEnd();
  // if (!modalInstance) {
  modalInstance = new Modal(detailModalRef.value);
  // }
  modalInstance.show();
}

function handleEdit() {
  editMode.value = true;
}

async function handleUpdateConfirm() {
  editMode.value = false;
  console.group("handleUpdateConfirm()");
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

function handleDelete(schedule) {
  selectedSchedule.value = schedule;
  // if (!modalInstance) {
  modalInstance = new Modal(deleteModalRef.value);
  // }
  modalInstance.show();
}

async function handleDeleteConfirm() {
  try {
    const response = await scheduleApi.scheduleDelete(selectedSchedule.value.scheduleId);
    const result = response.data;
    if (result.result === "success") {
      showDeleteCompleted.value = true;
      await loadSchedule();
    } else {
      console.log("일정 삭제 실패:", result.message);
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
    const newStatus = event.to.dataset.status; // 드롭된 컬럼

    const movedSchedule = ref(schedulesByStatus[newStatus][event.newIndex]);

    movedSchedule.value.users = await loadScheduleMembers(movedSchedule.value.scheduleId);
    movedSchedule.value.userIds = movedSchedule.value.users.map((user) => user.userId);

    for (const user of movedSchedule.value.users) {
      try {
        const res = await usersApi.ufAttachDownload(user.userId);
        const blob = new Blob([res.data], { type: res.headers["content-type"] });
        user.profileUrl = URL.createObjectURL(blob);
      } catch {
        user.profileUrl = null; // 이미지 없으면 기본 아바타 표시 가능
      }
    }

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
  await getProjectDetail();
  await loadSchedule();
  await loadProjectMembers();
});
</script>
<!--컴포넌트의 스타일 정의-->
<style scoped>
/* ✅ 전체 */
.schedule-page {
  padding: 0px 10px;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
}

.board-container {
  display: flex;
  flex-wrap: wrap; /* ✅ 반응형으로 자동 줄바꿈 */
  justify-content: flex-start; /* ✅ 가운데 정렬 제거 */
  align-items: flex-start;
  gap: 40px;
  padding: 10px 40px;
  width: 100%;
  box-sizing: border-box; /* ✅ padding 포함 계산 */
}

/* ✅ 컬럼 공통 */
.status-column {
  flex: 1 1 320px; /* ✅ 유연한 폭 (반응형) */
  max-width: 480px;
  border-radius: 5px;
  padding: 10px;
  display: inline-flex;
  /* ✅ 높이를 자동으로 맞추려면 inline-flex */
  flex-direction: column;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  height: auto;
  /* ✅ 내용만큼만 높이 */
}

/* ✅ 컬럼별 배경색 */
.status-column.not-started {
  background-color: #f9f8f7;
}

.status-column.in-progress {
  background-color: #f4f9fc;
}

.status-column.done {
  background-color: #f6f9f7;
}

/* ✅ 헤더 */
.column-header {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 0.8rem;
  margin: 0px 0px 0px 16px;
  color: #333;
}

/* ✅ 상태별 점 색상 */
.not-started .status-dot {
  background-color: #8e8b86;
  transform: translateY(-1px);
}

.in-progress .status-dot {
  background-color: #2383e2;
  transform: translateY(-1px);
}

.done .status-dot {
  background-color: #55a77c;
  transform: translateY(-1px);
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 7px;
}

/* ✅ 일정 카드 */
.schedule-card {
  background-color: #fff;
  border-radius: 5px;
  padding: 15px 15px;
  margin-bottom: 15px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.08);
}

/* 상단 날짜 및 아이콘 */
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date {
  display: flex;
  align-items: center;
  color: #555;
  font-size: 0.7rem;
  gap: 4px;
}

.icon {
  width: 16px;
  height: 16px;
  margin-top: -5px;
}

/* 카드 아이콘 */
.card-icons {
  display: flex;
  gap: 6px;
}

.action-icon {
  width: 18px;
  height: 18px;
  color: #555;
  cursor: pointer;
  transition: 0.2s;
}

.action-icon:hover {
  color: #6759f4;
}

/* 일정 제목 */
.card-title {
  font-weight: 700;
  font-size: 0.95rem;
  margin: 8px 0;
  color: #111;
}

/* 멤버 */
.card-members {
  display: flex;
  gap: 4px;
  margin-top: 6px;
}

.profile-img {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
}

/* ✅ 새 일정 추가 */
.add-schedule {
  margin-top: 10px;
  /* 카드와 간격 */
  text-align: center;
  border: 1.5px solid #d0d7de;
  color: #9ca3af;
  font-weight: 500;
  border-radius: 5px;
  padding: 12px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
  background-color: transparent;
}

.add-schedule:hover {
  background-color: rgba(0, 0, 0, 0.05); /* ✅ 아주 옅은 반투명 어둠 */
  color: #555;
  border-color: rgba(0, 0, 0, 0.05);
}

.plus-icon {
  width: 18px;
  height: 18px;
  margin-right: 6px;
  vertical-align: middle;
}

/* 헤더 UI */
.calendar-header-ui {
  display: flex;
  align-items: flex-end;
  /* 밑줄 기준선 맞춤 */
  gap: 20px;
  border-bottom: 1px solid #eee;
  /* 회색 기본선 */
  position: relative;
  margin-bottom: 20px;
}

/* ✅ 캘린더 버튼 (리스트 제거됨) */
.tab-btn {
  background: transparent;
  border: none;
  font-size: 1rem;
  font-weight: 700;
  cursor: default;
  color: #000;
  padding: 8px 0;
  border-bottom: 3px solid #000;
}

/* ✅ 오른쪽 글쓰기 버튼 */
.write-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  color: #fff;
  margin-left: auto;
  margin-bottom: 10px;
  border: none;
  border-radius: 999px;
  height: 36px;
  padding: 0 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.25s ease;
}

.write-btn:hover {
  background: #4d3df0;
}

/* 날짜 */
.calendar-header-ui {
  display: flex;
  align-items: center;
  padding: 0px;
  border-bottom: 1px #eee;
}

/* ✅ 날짜 스타일 */
.today-title {
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-top: 10px;
}

.today-title .day {
  color: #111111;
}

.today-title .date {
  color: #e2e2e2;
  font-weight: 500;
  font-size: 1.4rem;
}
</style>
