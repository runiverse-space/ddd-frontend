<!-- src/layout/ProjectManagementLayout.vue -->
<template>
  <div class="project-management-layout">
    <aside class="sidebar">
      <!-- 프로젝트 생성 버튼 -->
      <RouterLink :to="{ name: 'ProjectCreate' }" class="create-project-btn">
        <PlusIcon class="btn-icon" />
        <span>프로젝트 생성</span>
      </RouterLink>

      <!-- 프로젝트 섹션 -->
      <div class="menu-section" >
        <h3 class="section-title"><FolderIcon class="btn-icon"/>사이드 프로젝트</h3>
        <div v-for="project in myProjectList" :key="project.projectId">
        <!-- 3팀 프로젝트,윤우주팀.. -->
        <RouterLink :to="{name :'ProjectHome',params:{projectId:project.projectId}}" 
        class="menu-item"  @click="handleProjectClick(project.projectId)">
         <span> {{ project.projectTitle }}</span>
        </RouterLink>
        </div>
      
      </div>
    </aside>

    <main>
      <!-- 자식 라우트(ProjectList 또는 ProjectCreate)가 여기 렌더링됨 -->
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import projectApi from "@/apis/projectApi";
import { FolderIcon, PlusIcon } from "@heroicons/vue/24/outline";
import { onMounted, ref } from "vue";
import { RouterView, RouterLink } from 'vue-router';
import { useStore } from "vuex";

const props = defineProps(['projectId']);
const myProjectList = ref([]);

const store = useStore();


async function loadProjectsList(){
  console.log(`메인 사이드바 프로젝트 조회${props.projectId}`)
  const response = await projectApi.getProjectList();
  console.log('response의 구조 : ',response.data);
  if(response.data!==null){
    myProjectList.value=response.data;
  }else{
    console.log("프로젝트를 불러올 수가 없습니다.");
  }
  

}



function handleProjectClick(projectId){
  console.log('projectId:',projectId);
}


onMounted(async()=>{
  console.log("프로젝트 메인홈 사이드바 컴포넌트 마운트");

  await loadProjectsList();



})











</script>

<style scoped>
.project-management-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  padding: 20px;
  background-color: #f8f9fa;
  border-right: 1px solid #e9ecef;
}

.create-project-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #000000;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 24px;
}

.create-project-btn:hover {
  background-color: #bebdbd;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.menu-section {
  margin-top: 20px;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  margin-bottom: 12px;
  padding: 0 8px;
}

.menu-item {
  display: block;
  padding: 10px 8px;
  color: #212529;
  text-decoration: none;
  border-radius: 6px;
  margin-bottom: 4px;
}

.menu-item:hover {
  background-color: #e9ecef;
  color: #2b2929cc;
}

main {
  flex: 1;
  padding: 40px;
  max-width: 1600px;
}
</style>