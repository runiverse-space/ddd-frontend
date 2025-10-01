<template>
    <div class="recent-projects">
        <!-- 타이틀 -->
        <div class="recent-title">
            <ClockIcon class="icon-clock" />
            <h5>최근 프로젝트</h5>
        </div>

        <!-- 최근 프로젝트 목록 -->
        <div class="project-list">
            <div v-for="(project, index) in limitedProjects" :key="project.projectId" class="project-card"
                :class="{ dark: index === 0, gray: index === 1 }">
                <h4 class="project-name">{{ project.projectTitle }}</h4>
                <p class="project-desc">{{ project.projectContent }}</p>
            </div>

            <!-- 프로젝트가 3개 미만일 때만 보이는 '새 프로젝트' 버튼 -->
            <div v-if="limitedProjects.length < 3" class="project-card new-project">
                + 새 프로젝트
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { ClockIcon } from "@heroicons/vue/24/outline"
import projectApi from "@/apis/projectApi"

const projectList = ref([])

// 최대 3개까지만 잘라냄
const limitedProjects = computed(() => projectList.value.slice(0, 3))

async function loadProjects() {
    try {
        const response = await projectApi.getProjectList()
        projectList.value = response.data || []
    } catch (err) {
        console.error("프로젝트 불러오기 실패", err)
    }
}

onMounted(() => {
    loadProjects()
})
</script>

<style scoped>
.recent-projects {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0 8px;
}

.recent-title {
    display: flex;
    align-items: center;
    gap: 6px;
}

.recent-title h5 {
    margin: 0;
    font-weight: bold;
}

.icon-clock {
    width: 20px;
    height: 20px;
    stroke: black;
    stroke-width: 2;
}

.project-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.project-card {
    border-radius: 10px;
    padding: 14px;
    font-size: 14px;
}

.project-card h4 {
    margin: 0 0 6px 0;
    font-size: 15px;
    font-weight: bold;
}

.project-card p {
    margin: 0;
    font-size: 13px;
    color: #ddd;
}

.project-card.dark {
    background: #111;
    color: white;
}

.project-card.gray {
    background: #f4f4f4;
    color: black;
}

.new-project {
    border: 1px solid #ddd;
    text-align: center;
    color: #aaa;
    font-size: 15px;
    cursor: pointer;
    padding: 20px;
}
</style>
