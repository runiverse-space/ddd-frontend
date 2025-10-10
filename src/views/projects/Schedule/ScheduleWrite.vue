<template>
  <div class="schedule-container">
    <h1 class="page-title">일정 등록</h1>

    <form @submit.prevent="handleSubmit()" class="schedule-form">

      <!-- 일정 제목 -->
      <div class="form-group">
        <label>일정 제목 <span class="required">*</span></label>
        <input
          type="text"
          v-model="schedule.scheduleTitle"
          placeholder="일정 제목을 입력합니다"
          class="form-control title-input"
        />
      </div>

      <!-- 일정 내용 -->
      <div class="form-group">
        <label>내용</label>
        <input
          type="text"
          v-model="schedule.scheduleContent"
          placeholder="일정 내용을 입력합니다"
          class="form-control content-input"
        />
      </div>

      <!-- 일정 기간 -->
      <div class="form-group">
        <label>기간 <span class="required">*</span></label>
        <div class="date-row">
          <input
            type="date"
            class="form-control date-input"
            v-model="schedule.scheduleStartDate"
          />
          <span class="date-separator">~</span>
          <input
            type="date"
            class="form-control date-input"
            v-model="schedule.scheduleEndDate"
            :min="schedule.scheduleStartDate"
          />
        </div>
      </div>

      <!-- 초기 상태 설정 -->
      <div class="form-group status-group">
        <label>상태 설정</label>
        <div class="status-options">
          <div
            v-for="option in statusOptions"
            :key="option.value"
            class="status-item"
            @click="schedule.scheduleStatus = option.value"
            :class="{ active: schedule.scheduleStatus === option.value }"
          >
            <span
              class="status-dot"
              :style="{ backgroundColor: option.color }"
            ></span>
            <span class="status-label">{{ option.label }}</span>
          </div>
        </div>
      </div>

      <!-- 프로젝트 멤버 선택 -->
      <div class="form-group">
        <label>멤버 선택</label>
        <ProjectMemberSelector
          v-model="selectedMembers"
          :projectMembers="projectMemberList"
        />
      </div>

      <!-- 버튼 -->
      <div class="button-row">
        <button class="btn btn-dark btn-sm">확인</button>
        <button type="button" class="btn btn-outline-dark btn-sm" @click="handleCancel()">
          취소
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import userprojectroleApi from "@/apis/userprojectroleApi";
import usersApi from "@/apis/usersApi";
import scheduleApi from "@/apis/scheduleApi";
import ProjectMemberSelector from "@/components/ProjectMemberSelector.vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();
const route = useRoute();

const projectId = route.params.projectId;
const userId = store.state.userId;

let isScheduleTitleBlank = ref(false);
let isScheduleStartDateBlank = ref(false);
let isScheduleEndDateBlank = ref(false);

const schedule = ref({
  projectId,
  userId,
  scheduleTitle: "",
  scheduleContent: "",
  scheduleStartDate: "",
  scheduleEndDate: "",
  scheduleStatus: route.query.status || "NOT STARTED",
});

const selectedMembers = ref([]);
const projectMemberList = ref([]);

/* 상태 옵션 리스트 */
const statusOptions = [
  { value: "NOT STARTED", label: "시작되지 않음", color: "#8e8b86" },
  { value: "IN PROGRESS", label: "진행 중", color: "#2383e2" },
  { value: "DONE", label: "완료됨", color: "#55a77c" },
];

async function handleSubmit() {
  try {
    isScheduleTitleBlank.value = schedule.value.scheduleTitle === "";
    isScheduleStartDateBlank.value = schedule.value.scheduleStartDate === "";
    isScheduleEndDateBlank.value = schedule.value.scheduleEndDate === "";

    if (!isScheduleTitleBlank.value && !isScheduleStartDateBlank.value && !isScheduleEndDateBlank.value) {
      schedule.value.userIds = selectedMembers.value.map((m) => m.userId);
      const response = await scheduleApi.scheduleCreate(schedule.value);
      if (response.data.result === "success") {
        router.push(`/project/${projectId}/schedule`);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

/* 프로젝트 멤버 불러오기 */
async function loadProjectMembers() {
  try {
    const response = await userprojectroleApi.getMemberList(projectId);
    const uprList = Array.isArray(response.data) ? response.data : [];
    const promises = uprList.map(async (upr) => {
      try {
        const userRes = await usersApi.usersDetailById(upr.userId);
        return userRes.data?.data;
      } catch {
        return null;
      }
    });
    const members = await Promise.all(promises);
    projectMemberList.value = members.filter(Boolean);
  } catch (error) {
    console.error("멤버 목록 조회 실패:", error);
  }
}

function handleCancel() {
  router.back();
}

loadProjectMembers();
</script>

<style scoped>
.schedule-container {
  max-width: 600px;
  margin: 20px auto;
  background: #fff;
  padding: 0px 20px;
}

.page-title {
  font-size: 1.7rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 28px;
  text-align: left;
}

/* 세로 일렬 배치 */
.schedule-form {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
}

.required {
  color: #dc3545;
}

.form-control {
  font-size: 0.95rem;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.form-control:focus {
  border-color: #666;
  box-shadow: 0 0 0 2px rgba(103, 89, 244, 0.2);
}

/* placeholder 스타일 */
::placeholder {
  color: #aaa;
  font-size: 0.9rem;
}

/* 날짜 입력 */
.date-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.date-separator {
  color: #666;
}

/* 상태 설정 */
.status-options {
  display: flex;
  gap: 35px;
  margin-top: 4px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #555;
  transition: 0.2s;
}

.status-item:hover {
  transform: scale(1.02);
}

.status-item.active .status-label {
  font-weight: 600;
  color: #222;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

/* 버튼 */
.button-row {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>
