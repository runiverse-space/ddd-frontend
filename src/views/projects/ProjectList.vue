<template>

    <div class="dashboard-container">
        <!-- 좌측 : 최근 프로젝트 -->
        <RecentProjects class="left-section" />

        <!-- 우측 : 초대 목록 등 -->
        <div class="right-section">
            <p>초대목록 InviteList <!-- 초대 목록 컴포넌트 --></p>
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
                <tr v-for="project in myProjectList" :key="project.projectId">
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
                    <td>{{ project.adminName || '그룹장 없음' }}</td>

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
import { useStore } from 'vuex'
import userprojectroleApi from '@/apis/userprojectroleApi'

const myProjectList = ref([])
const store = useStore()

// ✅ 로그인한 유저의 프로젝트만 불러오기
async function loadUserProjects() {
    try {
        const userId = store.state.userId
        if (!userId) {
            console.warn('로그인 정보가 없습니다.')
            return
        }

        // 🔹 userId 기반으로 필터링된 프로젝트 목록 API 호출
        const response = await projectApi.getUserProjectList(userId)
        myProjectList.value = response.data

        // 🔹 각 프로젝트에 멤버 / 그룹장 정보 추가
        for (const project of myProjectList.value) {
            try {
                const uprResponse = await userprojectroleApi.getProjectAdmin(project.projectId)
                const uprData = uprResponse.data

                if (uprData.success && uprData.userId !== 0) {
                    const userResponse = await usersApi.usersDetailById(uprData.userId)
                    project.adminName = userResponse.data.data.userName
                } else {
                    project.adminName = null
                }

                const memberResponse = await projectApi.getProjectMembersList(project.projectId)
                project.members = memberResponse.data.data || []

                for (const member of project.members) {
                    try {
                        const res = await usersApi.ufAttachDownload(member.userId)
                        const blob = new Blob([res.data], { type: res.headers['content-type'] })
                        member.profileUrl = URL.createObjectURL(blob)
                    } catch {
                        member.profileUrl = null
                    }
                }
            } catch (error) {
                console.error(`프로젝트 ${project.projectId} 로딩 실패:`, error)
                project.members = []
            }
        }
    } catch (error) {
        console.error('❌ 내 프로젝트 목록 조회 실패:', error)
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// ✅ 마운트 시 호출
onMounted(async () => {
    await loadUserProjects()
})
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