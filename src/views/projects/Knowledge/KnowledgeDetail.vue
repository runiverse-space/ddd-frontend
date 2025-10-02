<template>
  <div class="container-fluid mt-4">
    <div class="row" style="max-width: 1200px; margin: 0 auto;">
      <!-- ✅ 왼쪽: 큰 카드 (항상 가로 배치) -->
      <div class="col-7">
        <!-- ✅ col-md-7 → col-7로 변경 (항상 7칸 차지) -->
        <div class="card" style="height: 100%;">
          <div class="card-body" style="padding: 2rem;">

            <!-- 제목 -->
            <h5 class="card-title mb-3" style="font-size: 1.5rem; font-weight: bold;">
              {{ knowledge.knowledgeTitle }}
            </h5>

            <!-- 내용 -->
            <div class="mb-3">
              <p class="card-text" style="white-space: pre-wrap; line-height: 1.6;">
                {{ knowledge.knowledgeContent }}
              </p>
            </div>

            <!-- URL -->
            <div class="mb-3" v-if="knowledge.knowledgeUrl">
              <div class="d-flex align-items-center">
                <LinkIcon class="need-icon" />
                <span style="font-weight: 500; margin-right: 8px;"> URL</span>
                <a :href="knowledge.knowledgeUrl" target="_blank" class="text-decoration-none" style="color: #0066cc; word-break: break-all;">
                  {{ knowledge.knowledgeUrl }}
                </a>
              </div>
            </div>

            <!-- 이미지 -->
            <div class="mb-3" v-if="kfAttach != null">
              <img :src="kfAttach" alt="첨부 이미지" style="width: 100%; height: auto; border-radius: 8px; object-fit: cover; max-height: 400px;" />
            </div>

            <hr style="margin: 1.5rem 0; border-color: #e0e0e0;">

            <hr style="margin: 1.5rem 0; border-color: #e0e0e0;">



            <!-- ✅ 이전/다음 글 네비게이션 -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <!-- 이전 글 -->
              <div style="flex: 1;">
                <router-link v-if="prevKnowledge" :to="`/project/${projectId}/KnowledgeDetail?knowledgeId=${prevKnowledge.knowledgeId}`" class="text-decoration-none" style="color: #333;">
                  <div class="d-flex align-items-center">
                    <ArrowLeftCircleIcon class="need-icon"/>
                    <div>
                      <div style="font-size: 0.75rem; color: #999;">이전 글</div>
                      <div style="font-size: 0.9rem; font-weight: 500;">{{ prevKnowledge.knowledgeTitle }}</div>
                    </div>
                  </div>
                </router-link>
                <div v-else style="color: #ccc;">
                  <div style="font-size: 0.75rem;">이전 글</div>
                  <div style="font-size: 0.9rem;">이전 글이 없습니다</div>
                </div>
              </div>


              <!-- 다음 글 -->
              <div style="flex: 1; text-align: right;">
                <router-link v-if="nextKnowledge" :to="`/project/${projectId}/KnowledgeDetail?knowledgeId=${nextKnowledge.knowledgeId}`" class="text-decoration-none" style="color: #333;">
                  <div class="d-flex align-items-center justify-content-end">
                    <div>
                      <div style="font-size: 0.75rem; color: #999;">다음 글</div>
                      <div style="font-size: 0.9rem; font-weight: 500;">{{ nextKnowledge.knowledgeTitle }}</div>
                    </div>
                    <ArrowRightCircleIcon class="need-icon"/>
                  </div>
                </router-link>
                <div v-else style="color: #ccc;">
                  <div style="font-size: 0.75rem;">다음 글</div>
                  <div style="font-size: 0.9rem;">다음 글이 없습니다</div>
                </div>
              </div>
            </div>



            <!-- 버튼 -->
            <div class="d-flex justify-content-end gap-2">
              <button class="btn btn-outline-dark btn-sm" @click="moveKnowledgeList">
                목록
              </button>

              <span v-if="store.state.userId == knowledge.userId">
                <button class="btn btn-dark btn-sm me-1" @click="updateKnowledge">
                  수정
                </button>
                <button class="btn btn-danger btn-sm" @click="deleteKnowledge">
                  삭제
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ✅ 오른쪽: 작은 카드 3개 (항상 가로 배치) -->
      <div class="col-5">
        <!-- ✅ col-md-5 → col-5로 변경 (항상 5칸 차지) -->
        <h4>
          <SparklesIcon class="need-icon" />이런 주제는 어떠신가요?
        </h4>
        <span class="p-2 mb-5">등록된 태그와 관련있는 글을 추천해드립니다.</span>
        <!-- 첫 번째 작은 카드 -->
        <div class="card mb-3 mt-3" style="border: 1px solid #e0e0e0;">
          <div class="card-body p-3">
            <div class="d-flex align-items-center gap-3">
              <!-- 썸네일 이미지 -->
              <div style="flex-shrink: 0;">
                <div style="width: 100px; height: 100px; background-color: #8b9196; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white;">
                  이미지
                </div>
              </div>
              <!-- 텍스트 -->
              <div style="flex: 1;">
                <p class="mb-0" style="font-size: 0.9rem; color: #666;">#프로젝트 주제</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 두 번째 작은 카드 -->
        <div class="card mb-3" style="border: 1px solid #e0e0e0;">
          <div class="card-body p-3">
            <div class="d-flex align-items-center gap-3">
              <div style="flex-shrink: 0;">
                <div style="width: 100px; height: 100px; background-color: #8b9196; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white;">
                  이미지
                </div>
              </div>
              <div style="flex: 1;">
                <p class="mb-0" style="font-size: 0.9rem; color: #666;">#프로젝트 주제</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 세 번째 작은 카드 -->
        <div class="card mb-3" style="border: 1px solid #e0e0e0;">
          <div class="card-body p-3">
            <div class="d-flex align-items-center gap-3">
              <div style="flex-shrink: 0;">
                <div style="width: 100px; height: 100px; background-color: #8b9196; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white;">
                  이미지
                </div>
              </div>
              <div style="flex: 1;">
                <p class="mb-0" style="font-size: 0.9rem; color: #666;">#프로젝트 주제</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<!--컴포넌트의 초기화 또는 이벤트 처리-->
<script setup>
import knowledgeApi from '@/apis/knowledgeApi';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon, LinkIcon, SparklesIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
const props = defineProps(['projectId']);

const store = useStore();
const route = useRoute();
const router = useRouter();
const knowledgeId = route.query.knowledgeId;
const prevKnowledge = ref(null);
const nextKnowledge = ref(null);

const knowledge = ref({
  knowledgeId: "",
  knowledgeTitle: "",
  knowledgeContent: "",
  knowledgeUrl: "",
  kfAttachoname: "",
  kfAttachtype: "",
  userId: "",
  projectId: ""

})

const kfAttach = ref(null);

//백엔드에서 게시물 가져오기
async function getKnowledge(knowledgeId) {
  try {
    const response = await knowledgeApi.knowledgeDetail(knowledgeId);
    console.log('요청 URL:', response.data);

    if (response.data.result === 'success') {
      knowledge.value = response.data.data;
      console.log(knowledge.value);
      console.log(knowledge.value.userId);

      prevKnowledge.value = response.data.prevKnowledge;
      nextKnowledge.value = response.data.nextKnowledge;



      if (knowledge.value.kfAttachoname != null) {
        knowledgeAttachDownload(knowledgeId);
      }
      console.log("지식창고 개별 getKnowledge 게시물 가져오기 성공");
    } else {
      console.log("지식 창고 개별 페이지 조회 실패");
    }

  } catch (error) {
    console.log(error);
  }

}

/*
   로그인 처리하면 없앨 임시 코드
*/
getKnowledge(knowledgeId);



async function knowledgeAttachDownload(knowledgeId) {
  try {
    const response = await knowledgeApi.knowledgeAttachDownload(knowledgeId);
    const blob = response.data;
    kfAttach.value = URL.createObjectURL(blob);
    console.log('knowlege첨부파일확인용: ', kfAttach.value);
  } catch (error) {
    console.log(error);
  }
}






//여기에서 router.push( ) update로 가는 쿼리문/ knowledgeId가 넘어갈거다.

function moveKnowledgeList() {
  router.push("KnowledgeList");
}

function updateKnowledge() {
  router.push(`/project/${props.projectId}/KnowledgeUpdate?knowledgeId=${knowledgeId}`);
}

async function deleteKnowledge() {
  try {
    const response = await knowledgeApi.knowledgeDelete(knowledgeId);
    if (response.data.result === "success") {
      router.back();
    }

  } catch (error) {
    console.log(error);
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

}

.card-title {
  color: #333;
}

.card-text {
  color: #555;
  font-size: 0.95rem;
}

.btn {
  min-width: 70px;

}


.need-icon {
  width: 24px;
  height: 24px;
}
</style>