<template>
  <div class="notification-list">
    <!-- 🔔 아이콘 + 알림 제목 -->
    <div class="title-row">
      <BellIcon class="icon" />
      <h3 class="title">알림</h3>
    </div>

    <ul>
      <li v-for="(notice, i) in notifications" :key="i">
        <!-- <p class="text">{{ notice.message }}</p> -->
        <!-- <span class="time">{{ notice.time }}</span> -->
        <!-- <p class="text">{{ notice }}</p> -->
        <div v-if="notice.paIsRead === 'N'" class="container-fluid" style="height: 80px; max-height: 80px;">
          <div class="row">
            <div class="col-9 d-flex flex-column h-100">
              <div v-if="notice.paType='JOIN_REQUEST'">
                <span class="sender-name">{{ notice.senderName }}</span>
                <span class="text"> 님이 </span>
                <span class="project-title">{{ notice.projectTitle }}</span>
                <span class="text">에 함께하고 싶어 합니다.</span>
              </div>
              <p class="time align-self-end">{{ formatDate(notice.paCreatedAt) }}</p>
            </div>
            <div class="col-3 d-flex flex-row align-self-start">
              <CheckCircleIcon style="width: 20px; " class="me-2" @click="handleAcceptParticipation(notice)"></CheckCircleIcon>
              <XMarkIcon style="width: 20px;" @click="handleRejectParticipation(notice)"></XMarkIcon>
            </div>
          </div>
        </div>

      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { BellIcon, CheckCircleIcon, XMarkIcon } from "@heroicons/vue/24/outline"; // ✅ 아이콘 추가
import { useStore } from "vuex";
import projectActivityApi from "@/apis/projectActivityApi";
import userprojectroleApi from "@/apis/userprojectroleApi";

const store = useStore();

const notifications = ref([
  // { message: "새 프로젝트 ‘UI 개선’이 생성되었습니다.", time: "5분 전" },
  // { message: "가나다 프로젝트에 참여 신청 하였습니다.", time: "1시간 전" },
  // { message: "가나다 프로젝트에 초대 받았습니다.", time: "3시간 전" },
]);

// 알림 구독
function connectNotificationStream(userId, onMessage) {
  const eventSource = new EventSource(`http://localhost:8080/api/project-activity/subscribe?userId=${userId}`);

  eventSource.addEventListener("connect", (event) => {
    console.log("SSE 연결 성공:", event.data);
  });

  eventSource.addEventListener("project-participation", (event) => {
    console.log("참여 요청 알림 수신:", event.data);
    onMessage(event.data);
  });

  eventSource.addEventListener("schedule-assignment", (event) => {
    console.log("일정 알림 수신:", event.data);
    onMessage(event.data);
  });

  eventSource.onerror = (error) => {
    console.error("SSE 연결 오류:", error);
    eventSource.close();
  };

  return eventSource;
}

// 알림 불러오기
async function getAlarms() {
  const response = await projectActivityApi.getAlarms(store.state.userId);
  console.log("기존 알림 목록:", response.data.data);
  for (const alarm of response.data.data) {
    // notifications.value.push({message: alarm.paMessage, time: formatDate(alarm.paCreatedAt)});
    notifications.value.push(alarm);
  }
}

// 참여 허가
async function handleAcceptParticipation(notice) {
  console.group("handleAcceptParticipation()");
  console.log(notice);
  console.log("userProjectRole 행 추가");
  let response = await userprojectroleApi.addMember(notice.projectId, notice.senderId);
  if (response.data.result === "success") {
    response = await projectActivityApi.approveProjectParticipation(notice);
    console.log("알림 상태 변경");
    console.log(response)

    notifications.value = notifications.value.filter(
      (n) => n.paId !== notice.paId
    );
  }
  console.groupEnd();
}

// 참여 불허
function handleRejectParticipation() {
  console.group("handleRejectParticipation");
  console.groupEnd()
}

// 날짜 형식
function formatDate(dataString) {
  if (!dataString) return "";
  const date = new Date(dataString);
  return date.toLocaleString("ko-KR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
}

onMounted(async () => {
  const userId = store.state.userId;
  connectNotificationStream(userId, (message) => {
    notifications.value.push(message);
  });
  await getAlarms();
  console.log("알림 목록:", notifications.value);
});
</script>

<style scoped>
.notification-list {
  display: flex;
  flex-direction: column;
}

/* 아이콘 + 제목 일렬 정렬 */
.title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.icon {
  width: 18px;
  height: 18px;
  color: #000;
  vertical-align: middle;
  transform: translateY(-5px);
  /* ✅ 살짝 위로 올림 */
}

.title {
  font-size: 1rem;
  font-weight: 700;
  color: #000;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  background: #fff;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.sender-name {
  color: #333;
  font-size: 0.85rem;
  margin-bottom: 4px;
  font-weight: 1000;
}

.project-title {
  color: #333;
  font-size: 0.85rem;
  margin-bottom: 4px;
  font-weight: 1000;
}

.text {
  color: #333;
  font-size: 0.85rem;
  margin-bottom: 4px;
  /* font-weight: 1000; */
}

.time {
  color: #888;
  font-size: 0.75rem;
}
</style>
