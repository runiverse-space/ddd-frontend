<template>
  <div class="notification-list">
    <!-- 🔔 아이콘 + 알림 제목 -->
    <div class="title-row">
      <BellIcon class="icon" />
      <h3 class="title">알림</h3>
    </div>

    <div v-if="filteredNotifications.length === 0" class="text-secondary">
      <p>읽지 않은 알림이 없습니다.</p>
    </div>
    <ul>
      <li v-for="(notice, i) in filteredNotifications" :key="i">
        <div v-if="notice.paIsRead === 'N'" class="container-fluid" style="height: 80px; max-height: 80px;">
          <div class="row">
            <div class="col-9 d-flex flex-column h-100">
              <div v-if="notice.paType === 'JOIN_REQUEST'">
                <span class="sender-name">{{ notice.senderName }}</span>
                <span class="text"> 님이 </span>
                <span class="project-title">{{ notice.projectTitle }}</span>
                <span class="text">에 함께하고 싶어 합니다.</span>
                <p class="time align-self-end">{{ formatDate(notice.paCreatedAt) }}</p>
              </div>

              <div v-if="notice.paType === 'SYSTEM_NOTIFICATION' && notice.paStatus === 'APPROVED'">
                <span class="project-title">{{ notice.projectTitle }}</span>
                <span class="text"> 참여가 승인되었습니다. 환영합니다!</span>
                <p class="time align-self-end">{{ formatDate(notice.paCreatedAt) }}</p>
              </div>

              <div v-if="notice.paType === 'SYSTEM_NOTIFICATION' && notice.paStatus === 'REJECTED'">
                <span class="project-title">{{ notice.projectTitle }}</span>
                <span class="text">에 대한 참여 요청이 거절되었습니다.</span>
                <p class="time align-self-end">{{ formatDate(notice.paCreatedAt) }}</p>
              </div>

              <div v-if="notice.paType === 'INVITATION'">
                <span class="project-title">{{ notice.projectTitle }}</span>
                <span class="text">에 초대되었습니다. 함께하시겠어요?</span>
                <p class="time align-self-end">{{ formatDate(notice.paCreatedAt) }}</p>
              </div>
            </div>



            <div v-if="notice.paType === 'JOIN_REQUEST'" class="col-3 d-flex flex-row align-self-start">
              <CheckCircleIcon style="width: 20px; " class="me-2 cursor-pointer"
                @click="handleApproveParticipation(notice)"></CheckCircleIcon>
              <XMarkIcon style="width: 20px;" class="cursor-pointer" @click="handleRejectParticipation(notice)">
              </XMarkIcon>
            </div>

            <div v-if="notice.paType === 'INVITATION'" class="col-3 d-flex flex-row align-self-start">
              <CheckCircleIcon style="width: 20px; " class="me-2 cursor-pointer"
                @click="handleAcceptInvitation(notice)"></CheckCircleIcon>
              <XMarkIcon style="width: 20px;" class="cursor-pointer" @click="handleDeclineInvitation(notice)">
              </XMarkIcon>
            </div>

            <div v-if="notice.paType === 'SYSTEM_NOTIFICATION'" class="col-3 d-flex flex-row align-self-start">
              <CheckIcon style="width: 20px;" class="cursor-pointer" @click="handleRead(notice)"></CheckIcon>
            </div>
          </div>
        </div>

      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { BellIcon, CheckCircleIcon, CheckIcon, XMarkIcon } from "@heroicons/vue/24/outline"; // ✅ 아이콘 추가
import { useStore } from "vuex";
import projectActivityApi from "@/apis/projectActivityApi";
import userprojectroleApi from "@/apis/userprojectroleApi";
import { useNotificationStream } from "@/composables/useNotificationStream";
const { notifications, connect } = useNotificationStream();

const store = useStore();

notifications.value = [];

// const notifications = ref([
// { message: "새 프로젝트 ‘UI 개선’이 생성되었습니다.", time: "5분 전" },
// { message: "가나다 프로젝트에 참여 신청 하였습니다.", time: "1시간 전" },
// { message: "가나다 프로젝트에 초대 받았습니다.", time: "3시간 전" },
// ]);

const filteredNotifications = computed(() =>
  notifications.value.filter(n => n.paIsRead === 'N')
);

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
async function handleApproveParticipation(notice) {
  try {
    console.group("handleApproveParticipation()");
    console.log(notice);
    console.log("userProjectRole 행 추가");
    let response = await userprojectroleApi.addMember(notice.projectId, notice.senderId);
    if (response.data.result === "success") {
      response = await projectActivityApi.approveProjectParticipation(notice);
      console.log("알림 상태 변경");
      console.log(response)

      notifications.value = notifications.value.filter(
        (n) => n.activityId !== notice.activityId
      );

      const projectId = notice.projectId;
      const receiverId = notice.senderId; // 원본 알림을 보낸 사람 -> 답변 알림을 받을 사람
      const res = await projectActivityApi.respondProjectParticipation({
        projectId: projectId,
        senderId: store.state.userId,
        receiverId: receiverId,
        paStatus: "APPROVED"
      });
      console.log(res);
    }
    console.groupEnd();
  } catch (error) {
    console.log(error);
  }

}

// 참여 불허
async function handleRejectParticipation(notice) {
  try {
    console.group("handleRejectParticipation()");
    const response = await projectActivityApi.rejectProjectParticipation(notice);
    console.log(response);

    notifications.value = notifications.value.filter(
      (n) => n.activityId !== notice.activityId
    );

    const projectId = notice.projectId;
    const receiverId = notice.senderId; // 원본 알림을 보낸 사람 -> 답변 알림을 받을 사람
    const res = await projectActivityApi.respondProjectParticipation({
      projectId: projectId,
      senderId: store.state.userId,
      receiverId: receiverId,
      paStatus: "REJECTED"
    });
    console.log(res);
    console.groupEnd();
  } catch (error) {
    console.log(error);
  }
}

// 초대 수락
async function handleAcceptInvitation(notice) {
  try {
    await userprojectroleApi.addMember(notice.projectId, notice.receiverId);

    await projectActivityApi.acceptProjectInvitation(notice);
    notifications.value = notifications.value.filter(
      (n) => n.activityId !== notice.activityId
    );
  } catch (error) {
    console.log(error);
  }
}

// 초대 거절
async function handleDeclineInvitation(notice) {
  try {
    await projectActivityApi.declineProjectInvitation(notice);
    notifications.value = notifications.value.filter(
      (n) => n.activityId !== notice.activityId
    );
  } catch (error) {
    console.log(error);
  }
}

// 읽음 처리
async function handleRead(notice) {
  console.group("handleRead()");
  const response = await projectActivityApi.readResponse(notice);
  console.log(response);

  notifications.value = notifications.value.filter(
    (n) => n.activityId !== notice.activityId
  );
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
  connect(store.state.userId);
  await getAlarms();
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

.cursor-pointer {
  cursor: pointer;
}
</style>
