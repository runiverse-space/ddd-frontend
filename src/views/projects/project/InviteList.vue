<template>
    <div class="invite-list">
        <div class="invite-header">
            <BellIcon class="icon-clock" />
            <h5>초대 목록</h5>
        </div>

        <div v-if="filteredNotifications.length === 0" class="text-secondary">
            <p>받은 초대가 없습니다.</p>
        </div>
        <ul class="invite-list-projects">
            <li v-for="(notice, i) in filteredNotifications" :key="i">
                <!-- <p class="text">{{ notice.message }}</p> -->
                <!-- <span class="time">{{ notice.time }}</span> -->
                <!-- <p class="text">{{ notice }}</p> -->
                <div v-if="notice.paIsRead === 'N'" class="container-fluid" style="height: 80px; max-height: 80px;">
                    <div class="row">
                        <div class="col-9 d-flex flex-column h-100">
                            <div v-if="notice.paType === 'INVITATION'">
                                <span class="project-title">{{ notice.projectTitle }}</span>
                                <span class="text">에 초대되었습니다. 함께하시겠어요?</span>
                                <p class="time align-self-end">{{ formatDate(notice.paCreatedAt) }}</p>
                            </div>
                        </div>

                        <div v-if="notice.paType === 'INVITATION'" class="col-3 d-flex flex-row align-self-start">
                            <CheckCircleIcon style="width: 20px; " class="me-2 cursor-pointer"
                                @click="handleAcceptInvitation(notice)"></CheckCircleIcon>
                            <XMarkIcon style="width: 20px;" class="cursor-pointer"
                                @click="handleDeclineInvitation(notice)">
                            </XMarkIcon>
                        </div>

                    </div>
                </div>

            </li>
        </ul>
    </div>
</template>

<script setup>
import { BellIcon, CheckCircleIcon, CheckIcon, XMarkIcon } from "@heroicons/vue/24/outline"
import { computed, onMounted } from "vue";
import { useNotificationStream } from "@/composables/useNotificationStream";
import { useStore } from "vuex";
import projectActivityApi from "@/apis/projectActivityApi";
import userprojectroleApi from "@/apis/userprojectroleApi";
const { notifications, connect } = useNotificationStream();

const store = useStore();

notifications.value = [];

const filteredNotifications = computed(() =>
    notifications.value.filter(n => n.paIsRead === 'N' && n.paType === 'INVITATION')
);

// 알림 불러오기
async function getAlarms() {
    const response = await projectActivityApi.getAlarms(store.state.userId);
    console.log("기존 알림 목록:", response.data.data);
    for (const alarm of response.data.data) {
        notifications.value.push(alarm);
    }
}

// 초대 수락
async function handleAcceptInvitation(notice) {
    try {
        await userprojectroleApi.addMember(notice.projectId, notice.receiverId);

        await projectActivityApi.acceptProjectInvitation(notice);
        notifications.value = notifications.value.filter(
            (n) => n.paId !== notice.paId
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
            (n) => n.paId !== notice.paId
        );
    } catch (error) {
        console.log(error);
    }
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
.invite-list-projects {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0 8px;
}

.invite-list {
    /* display: flex; */
    align-items: center;
    gap: 6px;
}

.invite-header {
    display: flex;
}

.invite-list h5 {
    margin: 0;
    font-weight: bold;
}

.icon-clock {
    width: 20px;
    height: 20px;
    stroke: black;
    stroke-width: 2;
}

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