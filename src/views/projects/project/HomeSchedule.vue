<template>
    <div class="home-schedule">
        <!-- 날짜 -->
        <h3 class="right-title" v-if="todayLabel">
            <span class="day">{{ todayLabel?.split(',')[0] || "" }},</span>
            <span class="date">{{ todayLabel?.split(',')[1] || "" }}</span>
        </h3>

        <!-- 일정 카드 -->
        <div v-for="(schedule, index) in recentSchedules" :key="index" class="schedule-card" :class="{
            'not-started': schedule.status === 'NOT STARTED',
            'in-progress': schedule.status === 'IN PROGRESS',
            'done': schedule.status === 'DONE',
        }">
            <!-- 상태 영역 -->
            <div class="status-header">
                <div class="status-box">
                    <span class="status-dot"></span>
                    <span class="status-text">{{ schedule.statusText }}</span>
                </div>
            </div>

            <!-- 흰색 카드 -->
            <div class="inner-card">
                <div class="time-row">
                    <div class="time-icon-group">
                        <CalendarIcon class="calendar-icon" />
                        <p class="time">{{ schedule.time }}</p>
                    </div>
                </div>

                <p class="title">{{ schedule.title }}</p>

                <div class="avatars">
                    <img v-for="(m, i) in schedule.members" :key="i" :src="m" class="avatar" />
                </div>
            </div>
        </div>

        <!-- 일정 없음 -->
        <p v-if="recentSchedules.length === 0" class="empty-schedule">
            최근 등록된 일정이 없습니다.
        </p>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { CalendarIcon } from "@heroicons/vue/24/outline";
import scheduleApi from "@/apis/scheduleApi";
import defaultProfile from "@/assets/default-profile.png";

const props = defineProps({
    projectId: { type: Number, required: true },
});

const recentSchedules = ref([]);

// ✅ 일정 데이터 로드
async function loadSchedules() {
    try {
        const res = await scheduleApi.getProjectScheduleList(props.projectId);
        const list = res.data.data || res.data;

        if (!Array.isArray(list)) return;

        // 최신순 3개
        const sorted = list.sort(
            (a, b) => new Date(b.scheduleStartDate) - new Date(a.scheduleStartDate)
        );
        const sliced = sorted.slice(0, 3);

        recentSchedules.value = sliced.map((s) => ({
            scheduleId: s.scheduleId,
            title: s.scheduleTitle,
            time: `${formatTime(s.scheduleStartDate)} - ${formatTime(s.scheduleEndDate)}`,
            status: s.scheduleStatus,
            statusText:
                s.scheduleStatus === "NOT STARTED"
                    ? "시작되지 않음"
                    : s.scheduleStatus === "IN PROGRESS"
                        ? "진행 중"
                        : s.scheduleStatus === "DONE"
                            ? "완료"
                            : "상태없음",
            members: [defaultProfile, defaultProfile],
        }));
    } catch (error) {
        console.error("일정 조회 실패:", error);
    }
}

function formatTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(
        2,
        "0"
    )}`;
}

// ✅ 오늘 날짜 표시
const todayLabel = computed(() => {
    const now = new Date();
    const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
    const month = now.toLocaleString("en-US", { month: "short" });
    return `${weekday}, ${now.getDate()} ${month}`;
});

onMounted(() => {
    loadSchedules();
});
</script>

<style scoped>
.right-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 16px;
    display: flex;
    align-items: baseline;
    gap: 6px;
}

.day {
    color: #111;
}

.date {
    color: #bdbdbd;
    font-weight: 500;
}

.schedule-card {
    border-radius: 10px;
    padding: 12px;
    margin-bottom: 16px;
    transition: 0.2s;
}

.schedule-card.not-started {
    background-color: #f9f8f7;
}

.schedule-card.in-progress {
    background-color: #f4f9fc;
}

.schedule-card.done {
    background-color: #f6f9f7;
}

.status-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    margin-left: 3px;
}

.status-box {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #333;
}

.schedule-card.not-started .status-dot {
    background-color: #8e8b86;
}

.schedule-card.in-progress .status-dot {
    background-color: #2383e2;
}

.schedule-card.done .status-dot {
    background-color: #55a77c;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
}

.inner-card {
    background-color: #fff;
    border-radius: 12px;
    padding: 14px 16px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.time-row {
    display: flex;
    align-items: center;
}

.time-icon-group {
    display: flex;
    align-items: center;
    gap: 6px;
}

.calendar-icon {
    width: 16px;
    height: 16px;
    color: #777;
    flex-shrink: 0;
}

.time {
    font-size: 0.88rem;
    color: #555;
    line-height: 1.2;
    margin: 0;
}

.title {
    font-weight: 700;
    color: #111;
    margin: 10px 0 12px;
}

.avatars {
    display: flex;
    gap: 4px;
}

.avatar {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #fff;
}

.empty-schedule {
    text-align: center;
    color: #aaa;
    margin-top: 16px;
}
</style>
