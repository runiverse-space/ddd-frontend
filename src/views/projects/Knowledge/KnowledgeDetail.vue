<template>
  <div class="row">

    <div>
      <div class="card" style="width: 18rem;">
        <div class="card-body">
          <div class="container-fluid">
            <div class="row">
              <div class="col-md-6">
                <h5 class="card-title">{{ knowledge.knowledgeTitle }}</h5>
                <p class="card-text">{{ knowledge.knowledgeContent }}</p>
                <p class="card-text">{{ knowledge.knowledgeUrl }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <img width="200" height="150" v-if="kfAttach != null" :src="kfAttach" />
            <hr />
          </div>

        </div>
        <div class="mt-3">
          <button class="btn btn-dark btn-sm me-2" @click="moveKnowledgeList">목록</button>
          <span>
            <!--  <span v-if="store.state.user === knowledge.userId">  글쓴사람만 수정삭제 가능  -->
            <button class="btn btn-dark btn-sm me-2" @click="updateKnowledge">수정</button>
            <button class="btn btn-dark btn-sm me-2" @click="deleteKnowledge">삭제</button>
          </span>
        </div>


      </div>
    </div>

  </div>
</template>


<!--컴포넌트의 초기화 또는 이벤트 처리-->
<script setup>
import knowledgeApi from '@/apis/knowledgeApi';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const route = useRoute();
const router = useRouter();
const knowledgeId = route.query.knowledgeId;
console.log("-----------", knowledgeId);

const knowledge = ref({
  knowledgeId: "",
  knowledgeTitle: "",
  knowledgeContent: "",
  knowledgeUrl: "",
  kfAttachoname: "",
  kfAttachtype: ""

})

const kfAttach = ref(null);

//백엔드에서 게시물 가져오기
async function getKnowledge(knowledgeId) {
  try {
    const response = await knowledgeApi.knowledgeDetail(knowledgeId);
    console.log('요청 URL', response.knowledgeId);
    knowledge.value = response.data.data;
    console.log(knowledge.value);

     if (knowledge.value.kfAttachoname != null) {
      knowledgeAttachDownload(knowledgeId);//밑에  코드가 없으니까 await를 안써도된다. 기다릴 필요가 없으니까..awati를 붙일때는 밑에서 받아서 뭔가를 할때만 붙이면된다.
    }
    //  if(knowledge.value.result==='success'){
    //    들어오면 여기로 옮겨야한다.
    //  }else{
    //   console.log("지식 창고 개별 페이지 조회 실패");
    //  }

  } catch (error) {
    console.log(error);
  }
console.log("지식창고 개별 getKnowledge 게시물 가져오기 성공");
}

/*
   로그인 처리하면 없앨 임시 코드
*/
getKnowledge(knowledgeId);



async function knowledgeAttachDownload(knowledgeId){
  try {
    const response = await knowledgeApi.knowledgeAttachDownload(knowledgeId);
    const blob = response.data;
    kfAttach.value = URL.createObjectURL(blob);
    console.log('knowlege첨부파일확인용: ',kfAttach.value);
  } catch (error) {
    console.log(error);
  }
}



//여기에서 router.push( ) update로 가는 쿼리문/ knowledgeId가 넘어갈거다.

function moveKnowledgeList() {
  router.push("KnowledgeList");
}

function updateKnowledge() {
  router.push(`KnowledgeUpdate?knowledgeId=${knowledgeId}`);
}

async function deleteKnowledge() {
   try {
    const response =await knowledgeApi.knowledgeDelete(knowledgeId);
    if(response.data.result ==="success"){
      router.back();
    }
    
  } catch (error) {
    console.log(error);
  }
}
</script>

<style scoped></style>