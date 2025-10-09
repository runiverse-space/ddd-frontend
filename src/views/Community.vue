<template>
  <div>
    <h6>멤버 추가</h6>
    <MemberSelector v-model="projectMembers" />
  </div>

  <br />

  <div>
    <h6>지식창고 태그</h6>
    <SingleTagSelector v-model="selectedProjectTags" tagType="KNOWLEDGE" />
  </div>

  <div class="board-container">
    <div v-for="column in columns" :key="column.status" class="status-column" :class="{
      'not-started': column.status === 'NOT STARTED',
      'in-progress': column.status === 'IN PROGRESS',
      'done': column.status === 'DONE',
    }">
      <!-- 상태 제목 -->
      <div class="column-header">
        <span class="status-dot"></span>
        {{ column.label }}
      </div>

      <!-- 일정 카드 -->
      <div v-for="schedule in column.schedules" :key="schedule.id" class="schedule-card">
        <div class="card-top">
          <div class="date">
            <CalendarIcon class="icon" />
            {{ schedule.time }}
          </div>
          <div class="card-icons">
            <ListBulletIcon class="action-icon" title="상세보기" />
            <PencilSquareIcon class="action-icon" title="수정하기" />
            <XMarkIcon class="action-icon" title="삭제하기" />
          </div>
        </div>

        <div class="card-title">{{ schedule.title }}</div>

        <div class="card-members">
          <img v-for="(member, index) in schedule.members" :key="index" :src="member" class="profile-img" />
        </div>
      </div>

      <!-- 새 일정 추가 -->
      <div class="add-schedule">
        <PlusIcon class="plus-icon" />
        새 일정 추가
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  CalendarIcon,
  ListBulletIcon,
  PencilSquareIcon,
  XMarkIcon,
  PlusIcon,
} from "@heroicons/vue/24/outline";
import SingleTagSelector from "@/components/SingleTagSelector.vue";
import MemberSelector from "@/components/MemberSelector.vue";
import { ref } from "vue";

const projectMembers = ref([]);

const columns = [
  {
    status: "NOT STARTED",
    label: "시작되지 않음",
    schedules: [
      {
        id: 1,
        title: "데이터베이스 작성하기",
        time: "09:00 - 09:00",
        members: [
          "https://i.pravatar.cc/30?img=1",
          "https://i.pravatar.cc/30?img=2",
          "https://i.pravatar.cc/30?img=3",
        ],
      },
    ],
  },
  {
    status: "IN PROGRESS",
    label: "진행 중",
    schedules: [
      {
        id: 2,
        title: "화면 레이아웃 구상하기",
        time: "09:00 - 09:00",
        members: ["https://i.pravatar.cc/30?img=4"],
      },
    ],
  },
  {
    status: "DONE",
    label: "완료",
    schedules: [],
  },
];
</script>

<style scoped>
/* ✅ 전체 */
.board-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  /* 높이를 맞추지 않음 */
  gap: 24px;
  padding: 24px;
  background-color: #fff;
}

/* ✅ 컬럼 공통 */
.status-column {
  flex: 1;
  border-radius: 16px;
  padding: 16px;
  display: inline-flex;
  /* ✅ 높이를 자동으로 맞추려면 inline-flex */
  flex-direction: column;
  width: 100%;
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
  font-size: 0.9rem;
  margin-bottom: 16px;
  color: #333;
}

/* ✅ 상태별 점 색상 */
.not-started .status-dot {
  background-color: #8e8b86;
}

.in-progress .status-dot {
  background-color: #2383e2;
}

.done .status-dot {
  background-color: #55a77c;
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
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 12px;
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
  font-size: 0.85rem;
  gap: 4px;
}

.icon {
  width: 16px;
  height: 16px;
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
  color: #6759F4;
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
  margin-top: 8px;
  /* 카드와 간격 */
  text-align: center;
  border: 1.5px solid #d0d7de;
  color: #9ca3af;
  font-weight: 600;
  border-radius: 10px;
  padding: 12px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  background-color: transparent;
}

.add-schedule:hover {
  background-color: #dfe3e8;
  color: #111827;
  border-color: #c5c9ce;
}

.plus-icon {
  width: 18px;
  height: 18px;
  margin-right: 6px;
  vertical-align: middle;
}
</style>
