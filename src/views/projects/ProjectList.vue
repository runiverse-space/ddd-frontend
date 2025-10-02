<template>

    <div class="dashboard-container">
        <!-- 좌측 : 최근 프로젝트 -->
        <RecentProjects class="left-section" />

        <!-- 우측 : 초대 목록 등 -->
        <div class="right-section">
            <InviteList /> <!-- 초대 목록 컴포넌트 -->
        </div>
    </div>

    <div>
        <!-- 타이틀 -->
        <div class="project-title">
            <ClockIcon class="icon-clock" />
            <h5>내 프로젝트</h5>
        </div>

        <!-- 테이블 -->
        <table class="project-table">
            <thead>
                <tr>
                    <th>프로젝트명</th>
                    <th>만든 날짜</th>
                    <th>그룹장</th>
                    <th>멤버</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="project in projectList" :key="project.projectId">
                    <!-- 프로젝트명 -->
                    <td>
                        <router-link :to="{ name: 'ProjectHome', params: { projectId: project.projectId } }"
                            @click="handleProjectClick(project.projectId)">
                            {{ project.projectTitle }}
                        </router-link>
                    </td>

                    <!-- 만든 날짜 -->
                    <td>
                        {{ formatDate(project.projectCreatedAt) }}
                    </td>


                    <!-- 그룹장 -->
                    <td>{{ project.userName }}</td>

                    <!-- 멤버 -->
                    <td>
                        <div v-if="project.members && project.members.length > 0" class="member-list">
                            <img v-for="member in project.members.slice(0, 6)" :key="member.userId"
                                :src="member.profileUrl" class="member-avatar" :alt="member.userName"
                                :title="member.userName" />
                            <!-- <span v-if="project.members.length > 3" class="member-more">
                                +{{ project.members.length - 3 }}
                            </span> -->
                        </div>
                        <div v-else>멤버 없음</div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ClockIcon } from '@heroicons/vue/24/outline'
import projectApi from '@/apis/projectApi'
import usersApi from '@/apis/usersApi'
import RecentProjects from './project/RecentProjects.vue'

// 라우터에서 넘겨준 projectId 받기
const props = defineProps(['projectId'])

const projectList = ref([]);

async function loadProjects() {
    try {
        const response = await projectApi.getProjectList();
        projectList.value = response.data;
    } catch (error) {
        console.log('프로젝트 목록 조회 실패');
    }
}

async function loadAllProjectMembers() {
    console.log("모든 프로젝트의 멤버 목록 조회 시작")
    for (const project of projectList.value) {
        try {
            // 그룹장 이름
            const userResponse = await usersApi.usersDetail(project.userId)
            project.userName = userResponse.data.data.userName

            // 멤버 목록
            const memberResponse = await projectApi.getProjectMembersList(project.projectId)
            project.members = memberResponse.data.data || []

            // 각 멤버: 프로필 이미지 URL만 세팅
            for (const member of project.members) {
                try {
                    const res = await usersApi.ufAttachDownload(member.userId)
                    const blob = new Blob([res.data], { type: res.headers['content-type'] })
                    member.profileUrl = URL.createObjectURL(blob)
                } catch {
                    member.profileUrl = null // 이미지 없으면 기본 아바타 표시 가능
                }
            }
        } catch (error) {
            console.error(`프로젝트 ${project.projectId} 로딩 실패:`, error)
            project.userName = "(이름 불러오기 실패)"
            project.members = []
        }
    }
}

function formatDate(dateStr) {
    if (!dateStr) return "-"
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

async function handleProjectClick(projectId) {

    console.log('🚀 클릭한 projectId:', projectId);
}

onMounted(async () => {
    await loadProjects();
    await loadAllProjectMembers();
    console.log(" loadAllProjectMembers 실행된다.");

});
</script>

<style scoped>
.project-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
}

.project-title h5 {
    margin: 0;
    font-weight: bold;
}

.icon-clock {
    width: 20px;
    /* recent-projects에 맞춤 */
    height: 20px;
    stroke: black;
    stroke-width: 2;
}

.project-table {
    width: 100%;
    border-collapse: collapse;
}

.project-table th,
.project-table td {
    border-bottom: 1px solid #ddd;
    padding: 12px 8px;
    text-align: left;
}

.project-table th {
    font-weight: bold;
    font-size: 14px;
    color: #333;
}

.project-table td {
    font-size: 14px;
}

/* 멤버 표시 스타일 */
.member-list {
    display: flex;
    gap: 4px;
}

.member-box {
    position: relative;
}

.member-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
    background: #ddd;
}

.member-avatar.fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #555;
    background: #ccc;
}

.member-more {
    font-size: 12px;
    color: #666;
    margin-left: 4px;
}

.dashboard-container {
    display: flex;
    gap: 24px;
    /* 좌우 간격 */
    align-items: flex-start;
    /* 상단 맞춤 */
    margin-bottom: 40px;
    /* 내 프로젝트와 간격 */
}

/* 좌측 최근 프로젝트 */
.left-section {
    flex: 1;
    /* 좌측이 넓게 */
    max-width: 400px;
    /* 카드 폭 제한 */
}

/* 우측 초대 목록 */
.right-section {
    flex: 1;
    /* 우측도 균등 분배 */
    max-width: 400px;
}
</style>