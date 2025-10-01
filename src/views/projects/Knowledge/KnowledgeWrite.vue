<template>
  <div class="row">

    <form @submit.prevent="handleSubmit">
      <div>
        <div class="mb-3">
          <label for="knowledgeTitle" class="form-label">제목</label>
          <input type="text" class="form-control"  v-model="knowledge.knowledgeTitle">
        </div>
        <div class="mb-3">
          <label for="knowledgeContent" class="form-label">내용</label>
          <textarea class="form-control"  rows="3" v-model="knowledge.knowledgeContent"></textarea>
        </div>
        <div class="mb-3">
          <label for="knowledgeUrl" class="form-label">URL</label>
          <input type="text" class="form-control"  v-model="knowledge.knowledgeUrl">
        </div>
        <div class="input-group mb-3">
          <input type="file" class="form-control" ref="kfAttach">
          <label class="input-group-text" for="kfAttach">Upload</label>
        </div>


        <div class="row">
          <div class="col-sm-12 d-flex justify-content-center">
            <input type="submit" class="btn btn-dark btn-sm me-2" value="등록하기" />
            <input type="submit" class="btn btn-dark btn-sm me-2" value="취소" @click="handleCancel" />
          </div>
        </div>

      </div>
    </form>

  </div>
</template>


<!--컴포넌트의 초기화 또는 이벤트 처리-->
<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { defineProps } from 'vue';
import knowledgeApi from '@/apis/knowledgeApi';

// const props = defineProps(["projectId"]);
//잠시 하드 코딩타입입니다. const store = useStore();
const router = useRouter();
const route = useRoute();
// 잠시 하드 코딩타입입니다. const projectId = route.params.projectId;

//** 테스트용 하드코딩 (위 주석 해제하고 이 줄들 삭제)
const userId = 45;
const projectId = 58;

const knowledge = ref({
  knowledgeTitle:"",
  knowledgeContent:"",
  knowledgeUrl:"",

})



//첨부파일
const kfAttach =ref(null);

//멀티 파트 객체 생성
async function handleSubmit() {

  const formData = new FormData();
  formData.append("knowledgeTitle",knowledge.value.knowledgeTitle);
  formData.append("knowledgeContent",knowledge.value.knowledgeContent);
  formData.append("knowledgeUrl",knowledge.value.knowledgeUrl);
  // formData.append("userId",store.state.user);
  formData.append("userId",userId);
  formData.append("projectId",projectId);// projectId는 처음부터 전달되어서 들어와야하는데 이거를 
  
  console.log("formdata: ",formData);
  //파일 파트 추가
  if(kfAttach.value.files.length !==0){
    formData.append("kfAttach",kfAttach.value.files[0]);
  }

  try{
    const response= await knowledgeApi.createKnowledge(formData);
    console.log(response);
    router.back();
  }catch(error){
    console.log(error);
  }

}
function handleCancel() {
  router.back();
}

</script>

<style scoped></style>