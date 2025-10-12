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

            <div class="mb-3">

              <div class="d-flex align-items-center">
                <!--  member.userId → knowledge.userId -->
                <!-- userProfileUrl ref 사용 -->
                <img :src="userProfileUrl || defaultProfile" :key="knowledge.userId" class="member-avatar me-2" alt="프로필 이미지" />
                <!-- users.userName으로 접근  -->
                <span class="me-4">by {{ users.userName || '알 수 없는 사용자' }}</span>


                <span class="ms-5">{{ formatDate(knowledge.knowledgeCreatedAt) }}</span>
              </div>

            </div>

            <!--태그 표시 영역 추가 -->
            <div class="mb-3" v-if="knowledgeTags.length > 0">
              <div class="knowledge-tags">
                <span v-for="tag in knowledgeTags" :key="tag.tagId" class="knowledge-tag">
                  {{ tag.tagName }}
                </span>
              </div>
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

            <!-- 내용 -->
            <div class="mb-3">
              <p class="card-text" style="white-space: pre-wrap; line-height: 1.6;">
                {{ knowledge.knowledgeContent }}
              </p>
            </div>


            <hr style="margin: 1.5rem 0; border-color: #e0e0e0;">


            <!--댓글 영역 -->

            <div class="mb-4">
              <span class="mb-3" style="font-weight: lighter; font-size: 1.1rem;">
                댓글 {{ knowledgeCommentList.length }}
              </span>

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
                      <span v-if="comment.userId === knowledge.userId" class="badge bg-primary " style="font-size: 0.7rem;">
                        작성자
                      </span>

                      <!-- 작성 날짜-->
                      <span style="font-size: 0.85rem; color: #6c757d; ">
                        {{ formatDate(comment.knowledgeCommentCreatedAt) }}
                      </span>

                    </div>


                  </div>

                  <!--댓글 내용-->
                  <div style="padding-left: 40px;">
                    <!--일반 모드 -->
                    <p v-if="editingKnowledgeCommentId !== comment.knowledgeCommentId" style="margin: 0; white-space: pre-wrap; line-height: 1.6; color: #333;">
                      {{ comment.knowledgeCommentContent }}
                    </p>
                    <!-- 수정 모드 -->
                    <div v-else>
                      <textarea v-model="editingKnowledgeCommentContent" class="form-control mb-2" style="width: 100%; height: 100px; resize: none;" placeholder="댓글을 입력하세요...">

                      </textarea>

                    </div>

                  </div>

                  <!--댓글 수정/ 삭제 본인 댓글만-->
                  <div v-if="store.state.userId === comment.userId" class="d-flex gap-2 mt-2" style="padding-left: 40px;">
                    <!-- 일반 모드 버튼 -->
                    <button v-if="editingKnowledgeCommentId !== comment.knowledgeCommentId" class="btn btn-sm btn-outline-secondary" style="font-size: 0.8rem;" @click="updateStart(comment)">
                      수정
                    </button>
                    <button v-if="editingKnowledgeCommentId !== comment.knowledgeCommentId" class="btn btn-sm btn-outline-danger" style="font-size: 0.8rem;"
                      @click="deleteKnowledgeComment(comment.knowledgeCommentId)">
                      삭제
                    </button>

                    <!-- 수정 모드 버튼 -->
                    <button v-if="editingKnowledgeCommentId === comment.knowledgeCommentId" class="btn btn-sm btn-primary" style="font-size: 0.8rem;" @click="saveKnowledgeComment">
                      수정 완료
                    </button>
                    <button v-if="editingKnowledgeCommentId === comment.knowledgeCommentId" class="btn btn-sm btn-secondary" style="font-size: 0.8rem;" @click="cancelUpdateKnowledgeComment">
                      취소
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
    <!-- 지식창고 삭제 확인 모달-->
    <BaseModal :show="deleteModal" 
    type="default" 
    buttonAction="confirm" 
    title="지식창고 삭제" 
    button-text="삭제"
    @confirm="handleDeleteConfirm"
    @close="deleteModal = false">
      삭제된 지식창고는 복구할수 없습니다. 정말 삭제하시겠습니까?
    </BaseModal>

    <!-- 삭제 완료 모달 -->
    <BaseModal :show="showDeleteCompleted" type="default" title="지식창고 삭제 완료" @close="showDeleteCompleted = false">
     지식창고 글이 삭제 되었습니다
    </BaseModal>

    <!-- 삭제 에러 모달-->
    <BaseModal :show="deleteErrorModal" type="error" title="삭제 실패" @close="deleteErrorModal = false">
      {{modalMessage }}
    </BaseModal>


    <!-- 여기 부터 댓글 생성/수정/삭제-->

    <!-- 댓글 생성 성공-->
    <BaseModal :show="showDefault" type="default" title="댓글 등록" @close="showDefault = false">
      {{ modalMessage }}
    </BaseModal>


     <!-- 댓글 수정 에러 모달 -->
    <BaseModal :show="showErrorModal" type="error" title="댓글 수정 실패" @close="showErrorModal = false">
      {{ modalMessage }}
    </BaseModal>
    
    
    <!-- 댓글 수정 확인 모달-->
    <BaseModal :show="commentUpdate" 
    type="default" 
    buttonAction="confirm" 
    title="댓글 수정" 
    button-text="수정" 
    @confirm="handleUpdateCommentConfirm" 
    @close="commentUpdate = false">
      작성하신 댓글을 수정할까요?
    </BaseModal>
    <!-- 댓글 수정 완료 모달-->
    <BaseModal 
    :show="commentUpdateCompleted" 
    type="default" 
    title="댓글 수정 완료" 
    @close="commentUpdateCompleted = false">
     댓글 수정이 완료되었습니다.
    </BaseModal>

    <!-- 댓글 삭제 확인 모달-->
    <BaseModal :show="deleteCommentModal" 
    type="default" 
    buttonAction="confirm" 
    title="댓글 삭제" 
    button-text="삭제"
    @confirm="handleDeleteCommentConfirm"
    @close="deleteCommentModal = false">
      삭제된 지식창고는 복구할수 없습니다. 정말 삭제하시겠습니까?
    </BaseModal>

    <!-- 댓글 삭제 완료 모달-->
    <BaseModal 
    :show="showDeleteCommentCompleted" 
    type="default" 
    title="지식창고 삭제 완료" 
    @close="showDeleteCommentCompleted = false">
     지식창고 글이 삭제 되었습니다
    </BaseModal>
   


  </div>
</template>


<!--컴포넌트의 초기화 또는 이벤트 처리-->
<script setup>
import knowledgeApi from '@/apis/knowledgeApi';
import knowledgeCommentApi from '@/apis/knowledgeCommentApi';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon, CheckBadgeIcon, LinkIcon, SparklesIcon } from '@heroicons/vue/24/outline';
import { computed, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import * as bootstrap from 'bootstrap';
import usersApi from '@/apis/usersApi';
import tagApi from '@/apis/tagApi';
import defaultProfile from '@/assets/default-profile.png';
import BaseModal from '@/components/BaseModal.vue';
const userProfileUrl = ref(null); 

const props = defineProps(['projectId']);

const store = useStore();
const route = useRoute();
const router = useRouter();
const prevKnowledge = ref(null);
const nextKnowledge = ref(null);

const modalTitle = ref('알림');
const modalType = ref('alert');  // 'alert' 또는 'confirm'
const modalCallback = ref(null);
const knowledgeId = computed(() => route.query.knowledgeId);

const knowledgeTags = ref([]);
const profileImage = computed(() => {
  return userProfileUrl.value || defaultProfile;
});


//모달창
const deleteModal=ref(false);
const showDeleteCompleted=ref(false);
const modalMessage = ref('');

const deleteErrorModal=ref(false);

const deleteCommentModal=ref(false);
const showDeleteCommentCompleted=ref(false);
const deletingCommentId = ref(null);  // 삭제할 댓글 ID 저장

const commentUpdate=ref(false);
const commentUpdateCompleted=ref(false);
const showErrorModal=ref(false);
const showDefault=ref(false);


const users = ref({
  userName: "",
  userId: ""
});


const knowledge = ref({
  knowledgeId: "",
  knowledgeTitle: "",
  knowledgeContent: "",
  knowledgeUrl: "",
  kfAttachoname: "",
  kfAttachtype: "",
  userId: "",
  projectId: "",
  tagType: "KNOWLEDGE",
  knowledgeCreatedAt: ""

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

//수정용 상태 객체
const isEditMode = ref(false);

const editingKnowledgeCommentId = ref(null);
const editingKnowledgeCommentContent = ref('');



//백엔드에서 게시물 가져오기
async function getKnowledge() {
  try {
    //** ✅ 유효성 검사 추가
    if (!knowledgeId.value) {
      console.error("knowledgeId가 없습니다!");
      return;
    }

    const response = await knowledgeApi.knowledgeDetail(knowledgeId.value);
    // console.log('요청 URL:', response.data);

    if (response.data.result === 'success') {
      knowledge.value = response.data.data;
      // console.log("지식창고 구조",knowledge.value);
      // console.log("knowledgeCreatedAt:", knowledge.value.knowledgeCreatedAt);
      // console.log(knowledge.value.userId);
      const userId = knowledge.value.userId;

      const userResponse = await usersApi.usersDetailById(userId);
      // console.log("users에서 userName 찾기", userResponse.data);
      users.value = userResponse.data.data;

      //** 사용자 프로필 이미지 가져오기
      try {
        const profileResponse = await usersApi.ufAttachDownload(userId);
        //** blob 데이터를 URL로 변환하여 img src에 사용 가능하게 만듦
        userProfileUrl.value = URL.createObjectURL(profileResponse.data);
      } catch (error) {
        //** 프로필 이미지가 없으면 기본 이미지 사용
        // console.log("프로필 이미지 없음, 기본 이미지 사용");
        userProfileUrl.value = "/images/default-profile.png";
      }


      try {
        const tagResponse = await tagApi.getKnowledgeTags(knowledgeId.value);
        //console.log("태그 응답:", tagResponse.data);
        knowledgeTags.value = tagResponse.data.tags || [];
        //console.log("태그목록", knowledgeTags.value);

      } catch (error) {
        console.log("태그 가져오기 실패", error);
        knowledgeTags.value = [];
      }


      prevKnowledge.value = response.data.prevKnowledge;
      nextKnowledge.value = response.data.nextKnowledge;



      kfAttach.value = null;

      if (knowledge.value.kfAttachoname != null) {
        knowledgeAttachDownload();
      }

    } else {
      console.log("지식 창고 개별 페이지 조회 실패");
    }

  } catch (error) {
    console.log(error);
  }

}

// /*
//    로그인 처리하면 없앨 임시 코드
// */
//getKnowledge(knowledgeId);

async function knowledgeAttachDownload() {
  try {

    if (!knowledgeId.value) {
      console.error("knowledgeAttachDownload: knowledgeId가 없습니다");
      return;
    }

    const response = await knowledgeApi.knowledgeAttachDownload(knowledgeId.value);
    const blob = response.data;
    kfAttach.value = URL.createObjectURL(blob);
    // console.log('knowlege첨부파일확인용: ', kfAttach.value);
  } catch (error) {
    console.log(error);
  }
}

watch(() => route.query.knowledgeId, (newKnowledgeId, oldKnowledgeId) => {

  if (newKnowledgeId && newKnowledgeId !== 'undefined') {
    getKnowledge(newKnowledgeId);
    getKnowledgeCommentList(newKnowledgeId);
  }


},
  {
    immediate: true  // 컴포넌트 마운트 시 즉시 실행
  }
)


/*
  여기 부터 댓글 게시판 관련 function ▼
*/

//댓글 게시판 글쓰기
async function createComment() {

  try {

    knowledgeComment.value.knowledgeId = knowledgeId.value;
    knowledgeComment.value.userId = store.state.userId;

    const data = structuredClone(knowledgeComment.value);
    // console.log(data);

    const response = await knowledgeCommentApi.knowledgeCommentCreate(data);
    console.log("response의 값", response.data);

    if (response.data !== null) {
      knowledgeComment.value.knowledgeCommentContent = "";
      modalMessage.value='댓글 등록에 성공했습니다.';
      showDefault.value=true;
     
    }
    await getKnowledgeCommentList(knowledgeId.value);

  } catch (error) {
    console.log(error);
    modalMessage.value='댓글 등록에 실패했습니다.';
    showErrorModal.value=true;
  }

}

//댓글 목록
async function getKnowledgeCommentList() {
  try {
    console.log("댓글 목록 가져오기 도전: ", knowledgeId.value);
    const response = await knowledgeCommentApi.knowledgeCommentList(knowledgeId.value);
    //전체 응답
    // console.log("응답 전체:", response.data);
    if (response.data.result === 'success') {
      // 백엔드가 commentList로 보냄
      knowledgeCommentList.value = response.data.commentList;

      // console.log("댓글 조회 성공");
      // console.log("댓글 개수:", knowledgeCommentList.value.length);
      // console.log("댓글 데이터:", knowledgeCommentList.value);
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

/*
  내가 쓴 댓글 수정하기
  상태 객체도 댓글 만드는거랑 수정용 상태객체로 나눠야함
  같은 화면에서 함수 이동하기
  수정 버튼 눌렀을때 수정 시작 updateStart-> 수정된 내용을 보낼 함수updateKnowledgeComment

//수정용 상태 객체
const isEditMode = ref(false);
// 수정 모드 관리용 ref (각각 분리)
const editingKnowledgeCommentId = ref(null);
const editingKnowledgeCommentContent = ref('');


  삭제 버튼 눌렀을때 삭제 확인용 모달-> 확인 누르면 삭제함수 백엔드로 보낸다.
*/
function updateStart(comment) {
  // console.log("수정모드 -댓글 시작", comment);

  isEditMode.value = true;
  editingKnowledgeCommentId.value = comment.knowledgeCommentId;
  editingKnowledgeCommentContent.value = comment.knowledgeCommentContent;

  // console.log("수정할 댓글 ID:", editingKnowledgeCommentId.value);
  // console.log("수정할 내용:", editingKnowledgeCommentContent.value);
 

}
//수정 모드에서 수정 저장 버튼 눌렀을때 호출되는 함수
function saveKnowledgeComment(){
  // console.log("저장 버튼 클릭됨");

  if (!editingKnowledgeCommentContent.value.trim()) {
      modalMessage.value = '댓글 내용을 입력해주세요.';
      showErrorModal.value = true;
      return;
    }
    //확인 모달 표시
  commentUpdate.value = true;

}

//수정 확인 모달
function handleUpdateCommentConfirm(){
  commentUpdate.value=false;
  updateKnowledgeComment();
}



//수정 취소
function cancelUpdateKnowledgeComment() {
  isEditMode.value = false;
  editingKnowledgeCommentId.value = null;
  editingKnowledgeCommentContent.value = '';
}

async function updateKnowledgeComment() {

  try {
    // console.log("댓글 수정하러 가자");
    const data = {
      knowledgeCommentId: editingKnowledgeCommentId.value,
      knowledgeId: knowledgeId.value,
      userId: store.state.userId,
      knowledgeCommentContent: editingKnowledgeCommentContent.value
    }

    // console.log('전송할 데이터', data);


    const response = await knowledgeCommentApi.knowledgeCommentUpdate(data);
    // console.log("백엔드의 수정응답", response.data);

    if (response.data !== null) {
      
      //수정 모드 종료
      cancelUpdateKnowledgeComment();
      await getKnowledgeCommentList(knowledgeId.value);
      commentUpdateCompleted.value=true;

       setTimeout(() => {
        commentUpdateCompleted.value = false;
      }, 3000);

    }


  } catch (error) {
    console.log(error);
    
  }

}

async function deleteKnowledgeComment(knowledgeCommentId) {
  // console.log("deleteKnowledgeComment1. 실행");
  //삭제하기 
  //삭제 버튼 눌렀을때 삭제 확인용 모달-> 확인 누르면 삭제함수 백엔드로 보낸다.
  
  deletingCommentId.value=knowledgeCommentId;
  deleteCommentModal.value=true;

}


async function handleDeleteCommentConfirm(){
  console.log("2. 핸들러 실행")
  deleteCommentModal.value=false;
   try {
    // 실제 삭제 API 호출
    // console.log("3.실제 api 호출");
    const response = await knowledgeCommentApi.knowledgeCommentDelete(deletingCommentId.value);
    // console.log("4..실제 api 호출결과: ",response);
    let result = response.data;
    if (typeof response.data === 'string') {
      result = JSON.parse(response.data);
    }

    // console.log("파싱된 결과:", result);

    if (result.result === 'success') {
      // 댓글 목록 새로고침
      await getKnowledgeCommentList(knowledgeId.value);

      // 삭제 완료 모달 표시
      setTimeout(() => {
        console.log("삭제 완료 모달");
        showDeleteCommentCompleted.value = true;
      }, 300);
    }
  } catch (error) {
    // console.error("댓글 삭제 에러:", error);
    // 에러 모달 표시
    modalMessage.value = '댓글 삭제에 실패했습니다.';
    showErrorModal.value = true;
  }
}



//여기에서 router.push( ) update로 가는 쿼리문/ knowledgeId가 넘어갈거다.
function moveKnowledgeList() {
  router.push("KnowledgeList");
}

function updateKnowledge() {
  router.push(`/project/${props.projectId}/KnowledgeUpdate?knowledgeId=${knowledgeId.value}`);
}

async function deleteKnowledge() {
  console.log("1.삭제 확인용");
  deleteModal.value=true;

}

async function handleDeleteConfirm() {
  // console.log("2.삭제 완료 확인용 handleDeleteConfirm");
  deleteModal.value=false;

  try {
      // console.log("3.지식창고 api 호출", knowledgeId.value);
    const response = await knowledgeApi.knowledgeDelete(knowledgeId.value);
    if (response.data.result === "success") {
      // console.log("5. 진짜 completed 확인용");
      showDeleteCompleted.value = true;

       setTimeout(() => {
        router.back();
      }, 3000);

    }

  } catch (error) {
    console.log(error);
    modalMessage.value='지식창고 삭제에 실패했습니다.';
    showErrorModal.value=true;
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


.member-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.knowledge-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
  margin-bottom: 8px;
}

.knowledge-tag {
  padding: 4px 10px;
  background: #f0f0f0;
  border-radius: 12px;
  font-size: 0.75rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}
</style>