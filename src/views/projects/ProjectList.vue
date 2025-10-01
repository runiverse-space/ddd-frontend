<template>
    <div>
        <h1>전체 프로젝트 목록조회</h1>
        <table class="project-table">
            <thead>
                <tr>
                    <th>프로젝트 링크 │</th>
                    <th>프로젝트 타이틀 │</th>
                    <th>프로젝트 내용 │</th>
                    <th>만든사람 │</th>
                    <th>멤버 목록 </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="project in projectList" :key="project.projectId">
                    <td>
                        <router-link :to="{ name: 'ProjectHome', params: { projectId: project.projectId } }" @click="handleProjectClick(project.projectId)">
                            프로젝트 {{ project.projectId }}
                        </router-link>
                    </td>
                    <td>{{ project.projectTitle }}</td>
                    <td>{{ project.projectContent }}</td>
                    <td>{{ project.userId }}</td>
                    <td>
                        <!-- 멤버 목록 표시 -->
                        <div v-if="project.members && project.members.length > 0">
                            <span 
                                v-for="(member, index) in project.members" 
                                :key="member.userId"
                            >
                                사용자{{ member.userId }}
                                <span :class="{'admin-badge': member.uprRole === 'ADMIN'}">
                                    ({{ member.uprRole }})
                                </span>
                                <span v-if="index < project.members.length - 1">, </span>
                            </span>
                        </div>
                        <div v-else-if="project.membersLoading">
                            로딩중...
                        </div>
                        <div v-else>
                            멤버 없음
                        </div>
                    </td>
                </tr>



            </tbody>
        </table>
    </div>
</template>

<script setup>
import projectApi from '@/apis/projectApi';
//import userprojectroleApi from '@/apis/userprojectroleApi';
import { onMounted, ref } from 'vue';

// 라우터에서 넘겨준 projectId 받기
const props = defineProps(['projectId'])

const projectList = ref([]);
const memberList = ref([]);

async function loadProjects() {
    try {
        console.log("프로젝트 목록 조회 시작")
        const response = await projectApi.getProjectList();
        projectList.value = response.data;
        console.log("프로젝트 목록: ", projectList.value);
    } catch (error) {
        console.log('프로젝트 목록 조회 실패');
    }
}

async function loadAllProjectMembers(){
    console.log("모든 프로젝트의 멤버 목록 조회 시작")
    for( const project of projectList.value){
        try {
            const memberResponse = await projectApi.getProjectMembers(project.projectId);
            project.members = memberResponse.data.data;
            console.log(`프로젝트 ${project.projectId}의 멤버:`, project.members);
        
        
        } catch (error) {
            console.error(`프로젝트 ${project.projectId}의 멤버 조회 실패:`, error);
            project.members = [];
            
        }
    }
    console.log("모든 프로젝트의 멤버 로드 완료");
}

async function handleProjectClick(projectId) {

    console.log('🚀 클릭한 projectId:', projectId);
}

onMounted(async() => {
    await loadProjects();

    await loadAllProjectMembers();
    console.log(" loadAllProjectMembers 실행된다.");

});



</script>