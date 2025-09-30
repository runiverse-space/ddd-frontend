<template>
    <div>
        <h1>전체 프로젝트 목록조회</h1>
        <table class="project-table">
            <tbody>
                <tr v-for="project in projectList" :key="project.projectId">
                    <td>
                        <router-link :to="{ name: 'ProjectHome', params: { projectId: project.projectId } }" @click="handleProjectClick(project.projectId)">
                            프로젝트 {{ project.projectId }}
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import projectApi from '@/apis/projectApi';
import { onMounted, ref } from 'vue';

// 라우터에서 넘겨준 projectId 받기
const props = defineProps(['projectId']) 

const projectList= ref([]);

async function loadProjects(){
   try {
     console.log("프로젝트 목록 조회 시작")
    const response = await projectApi.getProjectList();
    projectList.value= response.data;
    console.log("프로젝트 목록: ", projectList.value);
   } catch (error) {
    console.log('프로젝트 목록 조회 실패');
   }
}

async function handleProjectClick(projectId){

    console.log('🚀 클릭한 projectId:', projectId);
} 

onMounted(() => {
    loadProjects();
    console.log("loadProject 실행되면서 projectList 실행된다.");
});



</script>