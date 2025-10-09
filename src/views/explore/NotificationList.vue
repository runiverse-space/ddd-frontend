<template>
    <div class="notification-list">
        <!-- 🔔 아이콘 + 알림 제목 -->
        <div class="title-row">
            <BellIcon class="icon" />
            <h3 class="title">알림</h3>
        </div>

        <ul>
            <li v-for="(notice, i) in notifications" :key="i">
                <p class="text">{{ notice.message }}</p>
                <span class="time">{{ notice.time }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { BellIcon } from "@heroicons/vue/24/outline"; // ✅ 아이콘 추가

const notifications = ref([
    { message: "새 프로젝트 ‘UI 개선’이 생성되었습니다.", time: "5분 전" },
    { message: "가나다 프로젝트에 참여 신청 하였습니다.", time: "1시간 전" },
    { message: "가나다 프로젝트에 초대 받았습니다.", time: "3시간 전" },
]);
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

.text {
    color: #333;
    font-size: 0.85rem;
    margin-bottom: 4px;
}

.time {
    color: #888;
    font-size: 0.75rem;
}
</style>
