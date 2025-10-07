<template>
    <div>
        <h3 class="right-title">
            <span class="day">{{ todayLabel.split(',')[0] }},</span>
            <span class="date">{{ todayLabel.split(',')[1] }}</span>
        </h3>

        <div v-for="(schedule, index) in recentSchedules" :key="index" class="schedule-card"
            :class="schedule.statusClass">
            <div class="schedule-header">
                <span class="status">{{ schedule.statusText }}</span>
            </div>
            <div class="schedule-body">
                <p class="time">{{ schedule.time }}</p>
                <p class="title">{{ schedule.title }}</p>
                <div class="avatars">
                    <img v-for="(m, i) in schedule.members" :key="i" :src="m" class="avatar" />
                </div>
            </div>
        </div>

        <p v-if="recentSchedules.length === 0" class="empty-schedule">
            최근 등록된 일정이 없습니다.
        </p>
    </div>
</template>

<script setup>
defineProps({
    recentSchedules: Array,
    todayLabel: String, // 예: "Wednesday, 8 Oct"
});
</script>

<style scoped>
.right-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 12px;
    display: flex;
    align-items: baseline;
    gap: 6px;
}

/* ✅ 요일은 검정, 날짜는 회색 */
.day {
    color: #111;
}

.date {
    color: #e2e2e2;
    font-weight: 500;
}

/* 기존 스타일 유지 */
.schedule-card {
    border-radius: 14px;
    padding: 16px;
    border: 1px solid #eee;
    background: #f9f9f9;
    margin-bottom: 12px;
}

.schedule-card.active {
    border-left: 4px solid #4f8ef7;
    background: #f5f9ff;
}

.status {
    font-size: 0.85rem;
    font-weight: 500;
    color: #555;
}

.time {
    font-size: 0.85rem;
    color: #777;
}

.title {
    font-weight: 600;
    color: #222;
    margin: 4px 0;
}

.avatars {
    display: flex;
    gap: 4px;
    margin-top: 6px;
}

.avatar {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #fff;
}
</style>
