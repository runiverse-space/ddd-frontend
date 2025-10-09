<template>
    <div class="section-header">
        <div class="icon-title">
            <ClockIcon class="icon" />
            <span class="small-title">타임라인</span>
        </div>

        <div class="container-fluid">
            <div class="row">
                <div class="col-10">

                    <!-- 진행도 바 -->
                    <div class="progress-wrapper position-relative my-3">
                        <div class="progress" style="height: 8px;">
                            <div class="progress-bar bg-dark" role="progressbar"
                                :style="{ width: progressPercent + 10 + '%' }"></div>
                        </div>

                        <!-- 마일스톤 -->
                        <div class="d-flex justify-content-between align-items-center mt-4 position-relative">
                            <!-- 시작점 -->
                            <div class="text-center milestone-item" :style="{ left: 0 + '%' }">
                                <div class="milestone-circle start"
                                    :class="{ active: isPassed(projectDetail.projectStartDate) }">
                                    <span class="icon-inner">🚀</span>
                                </div>
                                <div class="mt-2 fw-bold small">{{ formatDate(projectDetail.projectStartDate) }}</div>
                                <div class="text-muted small">프로젝트 시작</div>
                            </div>

                            <!-- 중간 마일스톤 -->
                            <div v-for="(milestone, index) in milestones" :key="index"
                                class="text-center milestone-item" :style="{ left: (index + 1) / (milestones.length + 1) * 90 + '%' }">
                                <div class="milestone-circle" :class="{ active: isPassed(milestone.milestoneDate) }">
                                    <span v-if="isPassed(milestone.milestoneDate)">✔</span>
                                </div>
                                <div class="mt-2 fw-bold small">{{ formatDate(milestone.milestoneDate) }}</div>
                                <div class="text-muted small">{{ milestone.milestoneTitle }}</div>
                            </div>

                            <!-- 종료점 -->
                            <div class="text-center milestone-item end-item" :style="{ left: 90 + '%' }">
                                <div class="milestone-circle end"
                                    :class="{ active: isPassed(projectDetail.projectEndDate) }">
                                    <span class="small fw-bold">{{ Math.floor(progressPercent) }}%</span>
                                </div>
                                <div class="mt-2 fw-bold small">{{ formatDate(projectDetail.projectEndDate) }}</div>
                                <div class="text-muted small">종료</div>
                            </div>
                        </div>
                    </div>
                        <!-- 날짜 라벨 -->
                        <!-- <div class="d-flex justify-content-between text-center mb-1">
                            <div class="small text-muted">{{ formatDate(props.projectDetail.projectStartDate) }}</div>
                            <div v-for="(milestone, index) in milestones" :key="index" class="flex-fill"
                                :style="{ left: (index + 1) / (milestones.length + 1) * 100 + '%' }">
                                <div class="small text-muted">{{ formatDate(milestone.milestoneDate) }}</div>
                            </div>
                            <div class="small text-muted">{{ formatDate(props.projectDetail.projectEndDate) }}</div>
                        </div> -->

                        <!-- 마일스톤 점 표시 -->
                        <!-- <div class="milestone-dot" :style="{ left: 0 + '%' }">
                            <div class="dot" :class="{ active: isPassed(props.projectDetail.projectStartDate) }"></div>
                        </div>
                        <div v-for="(milestone, index) in milestones" :key="index" class="milestone-dot"
                            :style="{ left: (index + 1) / (milestones.length + 1) * 100 + '%' }">
                            <div class="dot" :class="{ active: isPassed(milestone.milestoneDate) }"></div>
                        </div>
                        <div class="milestone-dot" :style="{ left: 100 + '%' }">
                            <div class="dot" :class="{ active: isPassed(props.projectDetail.projectEndDate) }"></div>
                        </div> -->

                        <!-- 마일스톤 제목 라벨 -->
                        <!-- <div class="d-flex justify-content-between text-center mb-1">
                            <div v-for="(milestone, index) in milestones" :key="index" class="flex-fill"
                                :style="{ left: (index + 1) / (milestones.length + 1) * 100 + '%' }">
                                <div class="small text-muted">{{ milestone.milestoneTitle }}</div>
                            </div>
                        </div>
                    </div> -->



                    <!-- 진행률 표시 -->
                    <!-- <div class="text-end small text-muted">
                        {{ Math.floor(progressPercent) }}% 진행
                    </div> -->

                </div>
            </div>
        </div>


    </div>
</template>

<script setup>
import { ClockIcon } from "@heroicons/vue/24/outline";
import { computed } from "vue";

const props = defineProps({
    milestones: Array,
    projectDetail: Object,
});

// 전체 진행 퍼센트 계산
const progressPercent = computed(() => {
    const start = new Date(props.projectDetail.projectStartDate);
    const end = new Date(props.projectDetail.projectEndDate);
    const now = new Date();
    if (now < start) return 0;
    if (now >= end) return 100;
    let count = 0;
    props.milestones.forEach(milestone => {
        if (isPassed(milestone.milestoneDate)) count++;
    });
    return ((count) / (props.milestones.length + 1)) * 100;
    // const total = end - start;
    // const passed = Math.min(Math.max(now - start, 0), total);
    // return (passed / total) * 100;
});

// 특정 날짜 위치 계산
function getPositionPercent(dateStr) {
    const start = new Date(props.projectDetail.projectStartDate);
    const end = new Date(props.projectDetail.projectEndDate);
    const date = new Date(dateStr);
    const total = end - start;
    const offset = Math.min(Math.max(date - start, 0), total);
    return (offset / total) * 100;
}

// 날짜 비교
function isPassed(dateStr) {
    return new Date(dateStr) <= new Date();
}

// 날짜 포맷팅
function formatDate(dataString) {
    if (!dataString) return "";
    const date = new Date(dataString);
    return date.toLocaleString("ko-KR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
    });
}
</script>

<style scoped>
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

/* ✅ 진행 바 */
.progress {
  background-color: #f1f1f1;
  height: 10px;
  border-radius: 20px;
  overflow: hidden;
}

/* ✅ 마일스톤 전체 */
.milestones {
  position: relative;
  margin-top: 30px;
}

/* ✅ 마일스톤 컨테이너 */
.milestone-item {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%); /* 가운데 정렬 */
  z-index: 2; /* ✅ 원이 위로 올라옴 */
}

/* ✅ 마일스톤 점 */
/* .milestone-dot {
  position: absolute;
  top: -15px;
  transform: translateX(-50%);
  text-align: center;
} */

/* ✅ 점 스타일 */
.milestone-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #ccc;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 1rem;
  color: #777;
  transition: all 0.2s ease-in-out;
}

.milestone-circle.active {
  background-color: #000;
  border-color: #000;
  color: #fff;
}

/* ✅ 시작/끝 전용 스타일 */
.milestone-circle.start {
  background-color: #000;
  color: #fff;
  font-size: 1.2rem;
}

.milestone-circle.end {
  font-size: 0.8rem;
  border-color: #bbb;
  color: #777;
}

/* ✅ 텍스트 */
.milestone-dot .small {
  display: block;
  margin-top: 4px;
}

/* ✅ 종료점만 살짝 안쪽으로 */
.end-item {
  transform: translate(-50%, -50%);
}

</style>
