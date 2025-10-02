<!--컴포넌트의 UI-->
<template>
  <div>

    <h3 v-if="projectInfo">{{ projectInfo.projectTitle }} - 지식 창고</h3>
    <p v-else>지식 창고</p>
    
    <div v-if="knowledgeList.length > 0" class="row">
      <div class="col-sm-6 mb-3 mb-sm-0" v-for="item in knowledgeList" :key="item.knowledgeId">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{projectInfo.projectTitle||'DDD 프로젝트'}}</h5>
            <p class="card-text">
              <RouterLink :to="`KnowledgeDetail?knowledgeId=${item.knowledgeId}`" class="text-dark">{{ item.knowledgeTitle }}</RouterLink>
            </p>
            <p>글번호: {{ item.knowledgeId }}</p>
            <p>글쓴이: {{ item.userId }}</p>

            <p>{{ item.knowledgeContent }}</p>
            <p v-if="item.knowledgeUrl" class="card-text">
              <a :href="item.knowledgeUrl" class="text-primary">{{ item.knowledgeUrl }}</a>
            </p>

          </div>

          <div class="mb-3 ms-4">
            <img width="200" height="150"  v-if="item.images != null" :src="item.images" />
            <hr />
          </div>

        </div>
      </div>

    </div>
    <div v-else>
      <p>지식 창고가 비었습니다. 첫번째 지식을 추가해주세요.</p>
    </div>

    <button class="btn btn-dark btn-sm mt-2" @click="createKnowledge"> 글쓰기</button>

  </div>
</template>

<!--컴포넌트의 초기화 또는 이벤트 처리-->
<script setup>
import knowledgeApi from '@/apis/knowledgeApi';
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import KnowledgeDetail from './KnowledgeDetail.vue';
import projectApi from '@/apis/projectApi';
//import { RouterLink } from 'vue-router';

const router = useRouter();
const props = defineProps(['projectId']);
const knowledgeList = ref([]);
const projectInfo=ref(null);

//knowledge가 소속된 프로젝트 타이틀 받기
async function getProjectDetail(){
  try {
    const response = await projectApi.getProjectDetail(props.projectId);
    console.log(response);
    projectInfo.value =response.data.data;
    console.log('프로젝트 정보',projectInfo.value);

  } catch (error) {
    console.log(error);
  }
}



async function getKnowledgeList() {
  try {
    console.log("지식창고 받은 projectId", props.projectId);

    const response = await knowledgeApi.knowledgeList(props.projectId);
    //console.log("전체 응답 구조 확인용 로그 추가",response);

    knowledgeList.value = response.data;
    console.log("지식 목록 조회 성공: ", knowledgeList.value);

    for( const item of knowledgeList.value ){
      if(item.kfAttachoname!=null){
        item.images= await loadAttachDownload(item.knowledgeId);
      }else{
        item.images=null;
      }
    }

  } catch (error) {
    console.log("지식 창고 조회 실패");
  }

}



async function loadAttachDownload(knowledgeId){
  try {
    const response = await knowledgeApi.knowledgeAttachDownload(knowledgeId);
    const blob = response.data;
    const images= URL.createObjectURL(blob);
    console.log(`지식 ${knowledgeId}의 이미지 로드 완료:`, images);
    return images; 
  } catch (error) {
    console.log(error);
    return null;
  }
}

function createKnowledge() {
  router.push(`/project/${props.projectId}/KnowledgeWrite`);
}


onMounted(() => {
  console.log("지식창고 컴포넌트 마운트");
  getProjectDetail();
  getKnowledgeList();
})

</script>
<!--컴포넌트의 스타일 정의-->
<style scoped></style>