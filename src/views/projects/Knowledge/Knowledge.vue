<!--컴포넌트의 UI-->
<template>
  <div>
    <p>지식 창고</p>
    <div class="row">
      <div class="col-sm-6 mb-3 mb-sm-0">
        <div class="card">
          <div class="card-body" v-for="item in knowledgeList" :key="item.knowledgeId">
            <h5 class="card-title">DDD 프로젝트</h5>
            <p class="card-text">오늘은 화요일입니다. </p>
            <p>{{ item.knowledgeId }}</p>
            <p>{{ item.userId }}</p>
            <p>{{ item.knowledgeTitle }}</p>
            <p>{{ item.knowledgeContent }}</p>
            <p>{{ item.knowledgeUrl }}</p>
           

          </div>
        </div>
      </div>

      <div class="col-sm-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">DDD 프로젝트</h5>
            <p class="card-text">오늘은 화요일입니다.</p>

          </div>
        </div>
      </div>

      <div class="col-sm-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">DDD 프로젝트</h5>
            <p class="card-text">오늘은 화요일입니다.</p>

          </div>
        </div>
      </div>

      <div class="col-sm-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">DDD 프로젝트</h5>
            <p class="card-text">오늘은 화요일입니다.</p>

          </div>
        </div>
      </div>

    </div>



  </div>
</template>

<!--컴포넌트의 초기화 또는 이벤트 처리-->
<script setup>
import knowledgeApi from '@/apis/knowledgeApi';
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

const props =defineProps(['projectId']);
const knowledgeList=ref([]);


async function getKnowledgeList(){
  try {
    console.log("지식창고 받은 projectId",props.projectId);

    const response = await knowledgeApi.getKnowledgeList(props.projectId);
    knowledgeList.value= response.data;

    console.log('지식 목록 조회 성공:',knowledgeList.value);

  } catch (error) {
    console.log("지식 창고 조회 실패");
  }

}

onMounted(()=>{
  console.log("지식창고 컴포넌트 마운트");
  getKnowledgeList();
})

</script>
<!--컴포넌트의 스타일 정의-->
<style scoped></style>