<template>
    <div class="section-header">
        <div class="icon-title">
            <ClockIcon class="icon" />
            <span class="small-title">타임라인</span>
        </div>

        <div v-if="milestones.length" style="height: 100px;">
            <div class="container-fluid" style="margin-top: 50px;">
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
                                        <RocketLaunchIcon class="icon-inner" />
                                        <!-- <span class="icon-inner">🚀</span> -->
                                    </div>
                                    <div class="mt-2 fw-bold small">{{ formatDate(projectDetail.projectStartDate) }}
                                    </div>
                                    <div class="text-muted small">프로젝트 시작</div>
                                </div>

                                <!-- 중간 마일스톤 -->
                                <div v-for="(milestone, index) in milestones" :key="index"
                                    class="text-center milestone-item"
                                    :style="{ left: (index + 1) / (milestones.length + 1) * 90 + '%' }">
                                    <div class="milestone-circle"
                                        :class="{ active: isPassed(milestone.milestoneDate) }">
                                        <CheckCircleIcon class="icon-inner" v-if="isPassed(milestone.milestoneDate)" />
                                        <!-- <span v-if="isPassed(milestone.milestoneDate)">✔</span> -->
                                        <EllipsisHorizontalIcon class="icon-inner" v-else />
                                    </div>
                                    <div class="mt-2 fw-bold small">{{ formatDate(milestone.milestoneDate) }}</div>
                                    <div class="text-muted small milestone-title" :title="milestone.milestoneTitle">
                                        {{ milestone.milestoneTitle }}
                                    </div>
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
                    </div>
                </div>
            </div>
        </div>

        <p v-else class="empty-text">등록된 타임라인이 없습니다.</p>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { ClockIcon, EllipsisHorizontalIcon, FlagIcon } from "@heroicons/vue/24/outline";
import projectMilestoneApi from "@/apis/projectMilestoneApi";
import { CheckBadgeIcon, CheckCircleIcon, EllipsisHorizontalCircleIcon, RocketLaunchIcon } from "@heroicons/vue/24/solid";

const props = defineProps({
    milestones: Array,
    projectDetail: Object,
});

/* 마일스톤 불러오기 */
// ProjectHome.vue에서 마일스톤과 프로젝트 정보를 props로 받아오는 방식 사용

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

// 날짜 포맷
function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
    ).padStart(2, "0")}`;
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

/* 진행 막대 */
.progress-wrapper {
    position: relative;
    z-index: 1;
    /* 기본 컨테이너 */
}

.progress {
    background-color: #f1f1f1;
    height: 8px;
    border-radius: 20px;
    overflow: hidden;
    z-index: 1;
    /* 막대 자체 */
    position: relative;
}

.progress-bar {
    position: relative;
    z-index: 1;
}

.milestone-item {
    position: absolute;
    margin-bottom: 10px;
    /* background: #fff; */
    border-radius: 8px;
    padding: 10px 14px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

    z-index: 2;

    max-width: 150px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

/* 원 자체 스타일 */
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
    z-index: 2;
    /* 반드시 막대보다 위 */
}

.milestone-title {
    /* font-weight: 600; */
    color: #111;
    font-size: 0.95rem;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    width: 100px;
    height: 20px;
}

.milestone-date {
    font-size: 0.8rem;
    color: #777;
}

.empty-text {
    color: #aaa;
    font-size: 0.9rem;
    margin-top: 10px;
}
</style>
