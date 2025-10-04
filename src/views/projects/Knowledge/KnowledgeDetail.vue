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


            <!--댓글 영역 -->

            <div class="mb-4">
              <h6 class="mb-3" style="font-weight: bold; font-size: 1.1rem;">
                댓글 개수: {{ knowledgeCommentList.length }}
              </h6>

              <!-- 댓글 목록-->
              <div v-if="knowledgeCommentList.length > 0" class="mb-4">
                <div v-for="comment in knowledgeCommentList" :key="comment.knowledgeCommentId" class="comment-item p-3 mb-3"
                  style="background-color: #f8f9fa; border-radius: 8px; border-left: 3px solid #6c757d;">

                  <!-- 댓글 헤더 (작성자, 날짜)-->
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <div class="d-flex align-items-center gap-2">
                      <!-- 작성자 아이콘
                      <div
                        style="width: 32px; height: 32px; background-color: #6c757d; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                        {{ comment.userId ? comment.userId.substring(0, 1).toUpperCase() : 'U' }}
                      </div>
-->
                      <!-- 작성자 아이디-->
                      <span style="font-weight: 500; font-size: 0.95rem;">
                        {{ '사용자' + comment.userId }}
                      </span>
                      <!-- 작성자 표시-->
                      <span v-if="comment.userId === knowledge.userId" class="badge bg-primary" style="font-size: 0.7rem;">
                        작성자
                      </span>
                    </div>

                    <!-- 작성 날짜-->
                    <span style="font-size: 0.85rem; color: #6c757d;">
                      {{ formatDate(comment.knowledgeCommentCreatedAt) }}
                    </span>
                  </div>

                  <!--댓글 내용-->
                  <div style="padding-left: 40px;">
                    <p style="margin: 0; white-space: pre-wrap; line-height: 1.6; color: #333;">
                      {{ comment.knowledgeCommentContent }}
                    </p>
                  </div>
                  <!--댓글 수정/ 삭제 본인 댓글만-->
                  <div v-if="store.state.userId === comment.userId" class="d-flex gap-2 mt-2" style="padding-left: 40px;">
                    <button class="btn btn-sm btn-outline-secondary" style="font-size: 0.8rem;">
                      수정
                    </button>
                    <button class="btn btn-sm btn-outline-danger" style="font-size: 0.8rem;">
                      삭제
                    </button>
                  </div>

                </div>
              </div>
               <!-- 댓글이 없을때 -->
                   <div v-else class="text-center p-4" style="background-color: #f8f9fa; border-radius: 8px;">
                      <p style="color: #6c757d; margin: 0;">첫 번째 댓글을 작성해보세요! 💬</p>
                   </div>

              <!--댓글 작성 영역 -->

              <div class="mb-4">
                <label for="knowledgeCommentContent" class="form-label">댓글</label>
                <textarea class="form-control" style="width: 100%; height: 120px; resize: none;" rows="3" placeholder="댓글을 입력하세요..." v-model="knowledgeComment.knowledgeCommentContent">
                  </textarea>
                <div class="d-flex justify-content-end">
                  <button class="btn btn-dark btn-sm mt-2" @click="createComment">등록</button>

                </div>
              </div>



            </div>

            <!-- ✅ 이전/다음 글 네비게이션 -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <!-- 이전 글 -->
              <div style="flex: 1;">
                <RouterLink v-if="prevKnowledge" :to="`/project/${projectId}/KnowledgeDetail?knowledgeId=${prevKnowledge.knowledgeId}`" class="text-decoration-none" style="color: #333;">
                  <div class="d-flex align-items-center">
                    <ArrowLeftCircleIcon class="need-icon" />
                    <div>
                      <div style="font-size: 0.75rem; color: #999;">이전 글</div>
                      <div style="font-size: 0.9rem; font-weight: 500;">{{ prevKnowledge.knowledgeTitle }}</div>
                    </div>
                  </div>
                </RouterLink>
                <div v-else style="color: #ccc;">
                  <div style="font-size: 0.75rem;">이전 글</div>
                  <div style="font-size: 0.9rem;">이전 글이 없습니다</div>
                </div>
              </div>


              <!-- 다음 글 -->
              <div style="flex: 1; text-align: right;">
                <RouterLink v-if="nextKnowledge" :to="`/project/${projectId}/KnowledgeDetail?knowledgeId=${nextKnowledge.knowledgeId}`" class="text-decoration-none" style="color: #333;">
                  <div class="d-flex align-items-center justify-content-end">
                    <div>
                      <div style="font-size: 0.75rem; color: #999;">다음 글</div>
                      <div style="font-size: 0.9rem; font-weight: 500;">{{ nextKnowledge.knowledgeTitle }}</div>
                    </div>
                    <ArrowRightCircleIcon class="need-icon" />
                  </div>
                </RouterLink>

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


    <div class="modal fade" id="fadeModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="fadeModal"> 댓글 등록 성공</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <CheckBadgeIcon class="need-icon" />
            {{ modalMessage }}
          </div>

        </div>
      </div>
    </div>

  </div>
</template>


<!--컴포넌트의 초기화 또는 이벤트 처리-->
<script setup>
import knowledgeApi from '@/apis/knowledgeApi';
import knowledgeCommentApi from '@/apis/knowledgeCommentApi';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon, CheckBadgeIcon, LinkIcon, SparklesIcon } from '@heroicons/vue/24/outline';
import { ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import * as bootstrap from 'bootstrap';
const props = defineProps(['projectId']);

const store = useStore();
const route = useRoute();
const router = useRouter();
const knowledgeId = route.query.knowledgeId;
const prevKnowledge = ref(null);
const nextKnowledge = ref(null);
const modalMessage = ref('');

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
//입력용
const knowledgeComment = ref({
  knowledgeId: "",
  userId: "",
  knowledgeCommentContent: ""
});

//목록용
const knowledgeCommentList = ref([]);

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

      console.log(prevKnowledge.value);
      console.log(nextKnowledge.value);

      kfAttach.value = null;

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

watch(() => route.query.knowledgeId, (newKnowledgeId, oldKnowledgeId) => {
  getKnowledge(newKnowledgeId);
},
  {
    immediate: true  // 컴포넌트 마운트 시 즉시 실행
  }
)

// getKnowledge(knowledgeId);
getKnowledgeCommentList(knowledgeId);

/*
  여기 부터 댓글 게시판 관련 function ▼
*/

//댓글 게시판 글쓰기
async function createComment() {

  try {

    knowledgeComment.value.knowledgeId = knowledgeId;
    knowledgeComment.value.userId = store.state.userId;

    const data = structuredClone(knowledgeComment.value);
    console.log(data);

    const response = await knowledgeCommentApi.knowledgeCommentCreate(data);
    console.log("response의 값", response.data);

    if (response.data !== null) {
      knowledgeComment.value.knowledgeCommentContent = "";

      showModal('댓글 등록에 성공했습니다.');
    }
    await getKnowledgeCommentList(knowledgeId);

  } catch (error) {
    console.log(error);
    showModal('댓글 등록에 실패했습니다.');
  }

}

//댓글 목록
async function getKnowledgeCommentList(knowledgeId) {
  try {
    console.log("댓글 목록 가져오기 도전: ", knowledgeId);
    const response = await knowledgeCommentApi.knowledgeCommentList(knowledgeId);
    //전체 응답
    console.log("응답 전체:", response.data);
    if (response.data.result === 'success') {
      // 백엔드가 commentList로 보냄
      knowledgeCommentList.value = response.data.commentList;

      console.log("댓글 조회 성공");
      console.log("댓글 개수:", knowledgeCommentList.value.length);
      console.log("댓글 데이터:", knowledgeCommentList.value);
    } else {
      knowledgeCommentList.value = [];
    }

  } catch (error) {
    console.error("댓글 조회 에러:", error);
    if (error.response) {
      console.error("서버 응답:", error.response.data);
      console.error("상태 코드:", error.response.status);
    }
    knowledgeCommentList.value = [];
  }
}

// 날짜 포맷 함수
function formatDate(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  // 1분 미만
  if (diff < 60000) return '방금 전';
  // 1시간 미만
  if (diff < 3600000) return Math.floor(diff / 60000) + '분 전';
  // 24시간 미만
  if (diff < 86400000) return Math.floor(diff / 3600000) + '시간 전';
  // 7일 미만
  if (diff < 604800000) return Math.floor(diff / 86400000) + '일 전';

  // 그 외: 날짜 표시
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
}


//모달창 만들기

function showModal(message) {
  modalMessage.value = message;
  const modalElement = document.getElementById('fadeModal');
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
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

.comment-item {
  transition: all 0.2s ease;
}

.comment-item:hover {
  background-color: #e9ecef !important;
  transform: translateX(2px);
}
</style>