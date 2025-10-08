<template>
    <div class="calendar-page">
        <!-- 상단 헤더 -->
        <CalendarHeader :currentDate="currentDate" @move="handleMove" />

        <!-- 캘린더 -->
        <div ref="calendarRoot" class="calendar-container"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Calendar from "@toast-ui/calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import retrospecApi from "@/apis/retrospecApi";
import CalendarHeader from "./CalendarHeader.vue";

const route = useRoute();
const calendarRoot = ref(null);
const calendarInstance = ref(null);
const currentDate = ref("");

/* ✅ 캘린더 초기화 */
onMounted(async () => {
    calendarInstance.value = new Calendar(calendarRoot.value, {
        defaultView: "month",
        useDetailPopup: true,
        isReadOnly: true,
        month: {
            isAlways6Weeks: true,   // ✅ 항상 6주 보이게
            startDayOfWeek: 0,      // ✅ 일요일부터
            workweek: false,
            narrowWeekend: false,
        },
    });

    updateCurrentDate();
    await loadRetrospecs();
});

/* ✅ 회고 목록 불러오기 */
async function loadRetrospecs() {
    try {
        const res = await retrospecApi.getRetrospecList(route.params.projectId);
        const retrospecs = Array.isArray(res.data) ? res.data : [];

        const colorMap = { KTP: "#F3AAB5", TIL: "#eeeeee", CSS: "#C5BBDE" };

        const events = retrospecs.map((retro) => {
            const start = new Date(retro.retrospecStartAt);
            const end = new Date(retro.retrospecEndAt);
            const isOneDay = start.toDateString() === end.toDateString();

            const bg = colorMap[retro.retrospecTemplateType] || "#ccc";

            return {
                id: String(retro.retroId),
                calendarId: "retrospec",
                title: retro.retrospecTitle,
                category: isOneDay ? "time" : "allday",
                start: start.toISOString(),
                end: end.toISOString(),
                backgroundColor: bg,
                color: "#333",
                borderColor: bg,
            };
        });

        calendarInstance.value.clear();
        calendarInstance.value.createEvents(events);
    } catch (err) {
        console.error("❌ 회고 불러오기 실패:", err);
    }
}

/* ✅ 현재 날짜 업데이트 */
function updateCurrentDate() {
    const date = calendarInstance.value.getDate();
    currentDate.value = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/* ✅ 헤더 이동 */
function handleMove(type) {
    if (!calendarInstance.value) return;
    const actions = { prev: "prev", next: "next", today: "today" };
    const action = actions[type];
    if (action) calendarInstance.value[action]();
    updateCurrentDate();
}
</script>

<style scoped>
.calendar-page {
    padding: 0px;
}

.calendar-container {
    height: 750px;
    border: 1px solid #eee;
    margin-top: 30px;
    /* ✅ 헤더와의 여백 */
}

/* ✅ Toast UI Calendar 기본 색 조정 (화이트 배경) */
:deep(.toastui-calendar-month-dayname-item) {
    font-weight: 600;
    color: #444;
}

:deep(.toastui-calendar-daygrid-cell-date) {
    color: #000;
    font-size: 0.9rem;
}

:deep(.toastui-calendar-daygrid-cell-dayname-sun) {
    color: #e74c3c !important;
}

:deep(.toastui-calendar-daygrid-cell-dayname-sat) {
    color: #3498db !important;
}

:deep(.toastui-calendar-popup-detail) {
    font-family: "Pretendard", sans-serif;
}
</style>
