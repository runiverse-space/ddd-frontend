<template>
    <div class="calendar-page">
        <!-- ✅ 상단 헤더 -->
        <CalendarHeader :currentDate="currentDate" />

        <!-- ✅ 캘린더 -->
        <div ref="calendarRoot" class="calendar-container"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Calendar from "@toast-ui/calendar";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import "tui-date-picker/dist/tui-date-picker.css";
import "tui-time-picker/dist/tui-time-picker.css";
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
            isAlways6Weeks: true,
            startDayOfWeek: 0,
            workweek: false,
            narrowWeekend: false,
        },
        /* ✅ 템플릿(enum)별 캘린더 그룹 정의 */
        calendars: [
            { id: "KTP", name: "KTP 회고", backgroundColor: "#F3AAB5", borderColor: "#F3AAB5" },
            { id: "TIL", name: "TIL 회고", backgroundColor: "#eeeeee", borderColor: "#eeeeee" },
            { id: "CSS", name: "CSS 회고", backgroundColor: "#C5BBDE", borderColor: "#C5BBDE" },
        ],
    });

    updateCurrentDate();
    await loadRetrospecs();
});

/* ✅ 회고 목록 불러오기 */
async function loadRetrospecs() {
    try {
        const res = await retrospecApi.getRetrospecList(route.params.projectId);
        const retrospecs = Array.isArray(res.data) ? res.data : [];

        const events = retrospecs.map((retro) => {
            const start = new Date(retro.retrospecStartAt);
            const end = new Date(retro.retrospecEndAt);

            return {
                id: String(retro.retroId),
                calendarId: retro.retrospecTemplateType, // KTP/TIL/CSS
                title: retro.retrospecTitle,
                body: retro.retrospecContent,
                start: start.toISOString(),
                end: end.toISOString(),
                category: "time",
                color: "#fff",
                state: "",
            };
        });

        calendarInstance.value.clear();
        calendarInstance.value.createEvents(events);
    } catch (err) {
        console.error("❌ 회고 불러오기 실패:", err);
    }
}

/* 현재 날짜 표시 */
function updateCurrentDate() {
    const date = calendarInstance.value.getDate();
    currentDate.value = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
}
</script>

<style scoped>
.calendar-page {
    padding: 0;
}

.calendar-container {
    height: 800px;
    border: 1px solid #ddd;
    background-color: #fff;
    margin-top: 30px;
}

/* 하단 버튼(Edit/Delete) 제거 */
:deep(.toastui-calendar-section-button),
:deep(.toastui-calendar-popup-section-button) {
    display: none !important;
}

/* 팝업 내부 불필요한 아이콘 및 라벨 제거 */
:deep(.toastui-calendar-ic-user-b),
:deep(.toastui-calendar-icon.toastui-calendar-ic-user-b),
:deep(.toastui-calendar-detail-item.toastui-calendar-detail-item-indent) {
    display: none !important;
}

/* 날짜 및 요일 스타일 */
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

/* 오늘 날짜 표시 */
:deep(.toastui-calendar-month-daygrid-cell--today .toastui-calendar-daygrid-cell-date),
:deep(.toastui-calendar-weekday-grid-date.toastui-calendar-weekday-grid-date-decorator) {
    background-color: #000 !important;
    color: #fff !important;
    border-radius: 50% !important;
}
</style>
