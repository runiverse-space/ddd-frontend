<template>
    <div class="project-home">
        <!-- 좌측 -->
        <div class="left-panel">
            <!-- 프로젝트명 -->
            <div class="section-header">
                <div class="icon-title">
                    <FolderIcon class="icon" />
                    <span class="small-title">프로젝트명</span>
                </div>
                <h1 class="project-name">
                    {{ projectDetail?.projectTitle || "프로젝트명" }}
                </h1>
                <p class="project-desc">
                    {{ projectDetail?.projectContent || "프로젝트 설명을 불러오는 중입니다." }}
                </p>
            </div>

            <!-- 타임라인 -->
            <HomeMilestone :projectId="projectIdNumber" />

            <!-- 멤버 -->
            <HomeMember :projectId="projectIdNumber" />
        </div>

        <!-- 세로 분리선 -->
        <div class="divider"></div>

        <!-- 우측 : 일정 -->
        <div class="right-panel">
            <div class="sticky-schedule">
                <HomeSchedule :projectId="projectIdNumber" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { FolderIcon } from "@heroicons/vue/24/outline";
import projectApi from "@/apis/projectApi";
import HomeMilestone from "./project/HomeMilestone.vue";
import HomeSchedule from "./project/HomeSchedule.vue";
import HomeMember from "./project/HomeMember.vue";

/* ✅ props로 들어오는 projectId는 문자열 */
const props = defineProps({
    projectId: { type: String, required: true },
});

/* ✅ 숫자형으로 변환 */
const projectIdNumber = computed(() => parseInt(props.projectId, 10));

const projectDetail = ref({});

/* ✅ 프로젝트 상세 조회 */
async function loadProject() {
    try {
        const res = await projectApi.getProjectDetail(projectIdNumber.value);
        projectDetail.value = res.data.data || res.data;
    } catch (error) {
        console.error("프로젝트 상세 불러오기 실패:", error);
    }
}

onMounted(loadProject);
</script>

<style scoped>
.project-home {
    display: grid;
    grid-template-columns: 7.5fr 0.5px 2.5fr;
    gap: 0;
    padding: 10px 10px;
    background-color: #fff;
    min-height: 100vh;
    align-items: stretch;
}

/* 왼쪽 패널 */
.left-panel {
    display: flex;
    flex-direction: column;
    gap: 40px;
    padding-right: 10px;
    max-width: 100%;
    min-height: 720px;
}

/* 오른쪽 패널 */
.right-panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 0 10px 0 30px;
}

/* 스크롤 시 고정되는 일정 영역 */
.sticky-schedule {
    position: sticky;
    top: 40px;
}

/* 분리선 */
.divider {
    background-color: #d5d5d5;
    width: 1px;
    height: 100%;
}

.project-name {
    font-size: 1.8rem;
    font-weight: 700;
    margin-top: 6px;
    color: #111;
}

.project-desc {
    color: #555;
    font-size: 0.95rem;
    line-height: 1.5;
    margin-top: 4px;
}
</style>

<style>
.icon-title {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #999;
    font-size: 0.9rem;
    margin-bottom: 10px;
}

.icon {
    width: 18px;
    height: 18px;
    stroke-width: 2;
}
</style>
