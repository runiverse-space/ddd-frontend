<template>
  <div class="section-header">
    <div class="icon-title">
      <ClockIcon class="icon" />
      <span class="small-title">타임라인</span>
    </div>

    <div v-if="milestones && milestones.length" class="timeline-wrapper">
      <div class="timeline-line">
        <!-- 전체 라인 -->
        <div class="line-bg"></div>
        <div class="line-active" :style="{ width: progressLineWidth + '%' }"></div>

        <!-- 시작점 -->
        <div class="milestone start">
          <div class="circle start-circle">
            <RocketLaunchIcon class="rocket" />
          </div>
          <div class="top-text">{{ formatShortDate(projectDetail.projectStartDate) }}</div>
          <div class="bottom-text">프로젝트 시작</div>
        </div>

        <!-- 중간 마일스톤 -->
        <div
          v-for="(m, i) in milestones"
          :key="i"
          class="milestone mid"
          :style="{ left: getEvenlyPosition(i, milestones.length) + '%' }"
        >
          <div class="circle" :class="{ active: isPassed(m.milestoneDate) }">
            <CheckIcon class="check" :class="{ active: isPassed(m.milestoneDate) }" />
          </div>
          <div class="top-text">{{ formatShortDate(m.milestoneDate) }}</div>
          <div class="bottom-text multiline">{{ m.milestoneTitle }}</div>
        </div>

        <!-- 종료점 -->
        <div class="milestone end">
          <div class="circle end-circle">
            <span>{{ Math.floor(progressPercent) }}%</span>
          </div>
          <div class="top-text">{{ formatShortDate(projectDetail.projectEndDate) }}</div>
          <div class="bottom-text bold">프로젝트 종료</div>
        </div>
      </div>
    </div>

    <p v-else class="empty-text">등록된 타임라인이 없습니다.</p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { ClockIcon, RocketLaunchIcon, CheckIcon } from "@heroicons/vue/24/solid";

const props = defineProps({
  milestones: Array,
  projectDetail: Object,
});

/* ✅ 진행 퍼센트 계산 */
const progressPercent = computed(() => {
  const start = new Date(props.projectDetail.projectStartDate);
  const end = new Date(props.projectDetail.projectEndDate);
  const now = new Date();
  if (now < start) return 0;
  if (now >= end) return 100;
  const total = end - start;
  const passed = now - start;
  return (passed / total) * 100;
});

/* ✅ 라인 진행도 (최소 3%) */
const progressLineWidth = computed(() => Math.max(Math.min(progressPercent.value, 100), 3));

/* ✅ 균등 배치 */
function getEvenlyPosition(index, total) {
  return ((index + 1) / (total + 1)) * 100;
}

/* ✅ 날짜 비교 */
function isPassed(dateStr) {
  return new Date(dateStr) <= new Date();
}

/* ✅ 날짜 포맷 (MMM dd) */
function formatShortDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", { month: "short", day: "numeric" }); // Oct 15
}
</script>

<style scoped>
.section-header {
  margin-top: 10px;
}

.icon-title {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #999;
  font-size: 0.9rem;
}

.icon {
  width: 18px;
  height: 18px;
}

/* ===== 타임라인 전체 ===== */
.timeline-wrapper {
  position: relative;
  margin-top: 70px;
  height: 100px;
}

/* ✅ 라인 컨테이너 */
.timeline-line {
  position: relative;
  width: 85%;
  margin: 0 auto;
  margin-left: 40px;
  display: flex;
  align-items: center;
}

/* ✅ 배경 라인 */
.line-bg {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 15px;
  background: #f3f3f3;
  border-radius: 999px;
  z-index: 0;
}

/* ✅ 진행 라인 */
.line-active {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 15px;
  background: #111;
  border-radius: 999px;
  transition: width 0.3s ease;
  z-index: 1;
}

/* ===== 마일스톤 ===== */
.milestone {
  position: absolute;
  top: -18px;
  transform: translateX(-50%);
  text-align: center;
  z-index: 2;
}

.top-text {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  color: #000;
  font-weight: 600;
  white-space: nowrap;
}

.bottom-text {
  position: absolute;
  top: 55px;
  left: 50%;
  transform: translateX(-50%);
  color: #000;
  font-size: 0.8rem;
  line-height: 1.2;
  width: 120px;
}

.bottom-text.bold {
  font-weight: 700;
}

/* ✅ 10글자 초과 시 2줄 */
.multiline {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

/* ===== 원형 아이콘 ===== */
.circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 5px solid #f3f3f3;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: all 0.3s ease;
  margin-top: -3px;
}

.circle.active {
  border-color: #111;
  background: #111;
}

/* ✅ 시작점 */
.start-circle {
  width: 40px;
  height: 40px;
  background: #111;
  color: #fff;
  border: 5px solid #fff; /* ✅ 흰색 테두리 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25); /* ✅ 그림자 */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ✅ 종료점 */
.end-circle {
  width: 42px;
  height: 42px;
  background: #111;
  color: #fff;
  border: 5px solid #fff; /* ✅ 흰색 테두리 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25); /* ✅ 그림자 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

/* ===== 아이콘 ===== */
.rocket {
  width: 20px;
  height: 20px;
  color: #fff;
}

/* ✅ 체크 아이콘 두께 강화 */
.check {
  width: 16px;
  height: 16px;
  stroke: #e9e9e9;
  stroke-width: 2.5; /* ✅ 두께 강화 */
  color: #e9e9e9;
  transition: all 0.3s ease;
}

.check.active {
  color: #fff;
  stroke: #fff;
  stroke-width: 2.5;
}

/* ===== 위치 ===== */
.start {
  left: 0%;
}

.end {
  right: 0%;
  transform: translateX(50%);
}

/* ===== 빈 텍스트 ===== */
.empty-text {
  color: #aaa;
  font-size: 0.9rem;
  margin-top: 10px;
}
</style>
