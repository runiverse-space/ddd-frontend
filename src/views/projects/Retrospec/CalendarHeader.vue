<template>
    <div class="calendar-header">
        <!-- ✅ Today 버튼 -->
        <button class="today-btn" @click="$emit('move', 'today')">Today</button>

        <!-- ✅ 이전/다음 아이콘 -->
        <button class="nav-btn" @click="$emit('move', 'prev')">
            <ChevronLeftIcon class="icon" />
        </button>
        <button class="nav-btn" @click="$emit('move', 'next')">
            <ChevronRightIcon class="icon" />
        </button>

        <!-- ✅ 현재 연/월 표시 -->
        <span class="current-date">{{ currentDate }}</span>
    </div>
</template>

<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";

defineProps({
    currentDate: {
        type: String,
        required: true,
    },
});
</script>

<style scoped>
.calendar-header {
    display: flex;
    align-items: center;
    gap: 10px;
}

/* ✅ Today 버튼 */
.today-btn {
    background: #fff;
    border: 1px solid #ddd;
    color: #111;
    font-weight: 500;
    padding: 5px 16px;
    border-radius: 9999px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.2s ease;
}

.today-btn:hover {
    border-color: #000;
}

/* ✅ 좌우 네비게이션 버튼 */
.nav-btn {
    background: #fff;
    border: 1px solid #ddd;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.nav-btn:hover {
    border-color: #000;
}

/* ✅ 아이콘 */
.icon {
    width: 14px;
    height: 14px;
    color: #111;
}

/* ✅ 현재 연월 텍스트 */
.current-date {
    margin-left: 10px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #111;
}
</style>
