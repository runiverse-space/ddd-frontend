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
          <div>
            <img v-if="knowledge.kfAttachoname!==null"
                  width="200" height="150"
                  :src="`${axios.defaults.baseURL}/api/knowledge/attachdownload?knowledgeId=${knowledge.knowledgeId}`"            
            />
          </div>


          <div>
          <input type="file" class="form-control" ref="kfAttach">
          </div>

          <div>
          <label class="input-group-text" for="kfAttach">Upload</label>
          </div>
        </div>


        <div class="row">
          <div class="col-sm-12 d-flex justify-content-center">
            <input type="submit" class="btn btn-dark btn-sm me-2" value="수정" />
            <input type="button" class="btn btn-dark btn-sm me-2" value="취소" @click="handleCancel" />
          </div>
        </div>

      </div>
    </form>

  </div>
</template>

<!--컴포넌트의 초기화 또는 이벤트 처리-->
<script setup>
import knowledgeApi from '@/apis/knowledgeApi';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';


const route=useRoute();
const router=useRouter();
const knowledgeId= route.query.knowledgeId;
console.log(knowledgeId);

const knowledge =ref({
  knowledgeId:"",
  knowledgeTitle:"",
  knowledgeContent:"",
  knowledgeUrl:"",
  kfAttachoname:"",
  kfAttachtype:""
});

const kfAttach =ref(null);

async function handleSubmit(){
  console.log("----------수정 눌렀을때 1")
  const formData= new FormData();
  formData.append("knowledgeId",knowledgeId);
  console.log('수정요청 knowledgeId',knowledgeId);
  formData.append("knowledgeTitle",knowledge.value.knowledgeTitle);
  formData.append("knowledgeContent",knowledge.value.knowledgeContent);
  formData.append("knowledgeUrl",knowledge.value.knowledgeUrl);
  
  if(kfAttach.value.files.length !==0){
    formData.append("kfAttach",kfAttach.value.files[0]);
  }

  //게시판 수정 요청
  try {
    const response = await knowledgeApi.knowledgeUpdate(formData);
    // router.push(``);
  } catch (error) {
    console.log(error);
  }

}
function handleCancel(){
  router.back();
}

async function getKnowledgeList(knowledgeId){
  try {
    const response = await knowledgeApi.knowledgeDetail(knowledgeId);
    knowledge.value = response.data.data;
    console.log("불러온 데이터",knowledge.value);

  } catch (error) {
    console.log(error);
  }
}

getKnowledgeList(knowledgeId);

</script>

<style scoped>
</style>
