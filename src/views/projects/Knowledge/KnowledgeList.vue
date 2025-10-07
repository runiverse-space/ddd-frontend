<!--컴포넌트의 UI-->
<template>
  <div>

    <h3 v-if="projectInfo">{{ projectInfo.projectTitle }} - 지식 창고</h3>
    <p v-else>지식 창고</p>



    <div v-if="knowledgeList.length > 0" class="masonry-grid">
      <div style="text-align: right;">
        <RouterLink class="btn btn-dark btn-lg" to="KnowledgeWrite">글쓰기</RouterLink>
      </div>
      <div class="masonry-item" v-for="item in knowledgeList" :key="item.knowledgeId">

        <div class="card h-100 shadow-sm hover-lift">

          <div v-if="item.images" class="card-img-wrapper">
            <img :src="item.images" class="card-img-top" alt="지식 이미지" loading="lazy">
          </div>

          <div class="card-body">

            <span class="badge bg-secondary mb-2">
              {{ projectInfo.projectTitle || 'DDD 프로젝트' }}
            </span>

            <h5 class="card-title fw-bold">
              <RouterLink :to="`KnowledgeDetail?knowledgeId=${item.knowledgeId}`" class="text-decoration-none text-dark stretched-link">
                {{ item.knowledgeTitle }}
              </RouterLink>
            </h5>

            <!-- <p>글번호: {{ item.knowledgeId }}</p>
            <p>글쓴이: {{ item.userId }}</p>-->

            <p class="card-text text-muted text-truncate-3">
              {{ item.knowledgeContent }}
            </p>

            <!-- URL 링크 (있을 경우) -->
            <a v-if="item.knowledgeUrl" :href="item.knowledgeUrl">
              {{ item.knowledgeUrl }}
            </a>

          </div>

          <div class="card-footer bg-transparent border-top-0">
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">
                <i class="bi bi-person-circle"></i> {{ item.userId }}
              </small>
              <small class="text-muted">
                #{{ item.knowledgeId }}
              </small>
            </div>
          </div>

        </div>
      </div>

    </div>

    <div v-else>
      <div class="card" style="width: 900px; height: 100px;">
        <div class="card-body">
          <p>지식 창고가 비었습니다.</p>
          <p>당신의 프로젝트에 첫번째 지식을 추가해주세요.</p>
        </div>
      </div>

      <!-- card 바로 아래에 붙어서 함께 움직임 -->
      <div style="text-align: right; margin-top: 20px; width: 900px;">
        <RouterLink class="btn btn-dark btn-lg" to="KnowledgeWrite">글쓰기</RouterLink>
      </div>
      
    </div>






    <!-- 빈 상태 모달 (alert 대체) 
    <div class="modal fade" id="emptyStateModal" tabindex="-1" aria-labelledby="emptyStateModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">-->

    <!-- 모달 헤더 
          <div class="modal-header border-0">
            <h5 class="modal-title fw-bold" id="emptyStateModalLabel">
              <i class="bi bi-inbox text-primary"></i> 지식 창고
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
            </button>
          </div>-->

    <!-- 모달 본문 
          <div class="modal-body text-center py-5">
            <i class="bi bi-inbox fs-1 text-muted d-block mb-4" style="font-size: 5rem;"></i>
            <h5 class="mb-3">지식 창고가 비었습니다</h5>
            <p class="text-muted mb-4">첫 번째 지식을 추가하고 팀과 공유해보세요!</p>

            <button class="btn btn-dark btn-lg" @click="createKnowledgeFromModal" data-bs-dismiss="modal">
              <i class="bi bi-plus-circle"></i> 첫 지식 추가하기
            </button>
          </div>

        </div>
      </div>
    </div>-->



  </div>
</template>

<!--컴포넌트의 초기화 또는 이벤트 처리-->
<script setup>
import knowledgeApi from '@/apis/knowledgeApi';
import { nextTick, onMounted, ref, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

// @ts-nocheck
import * as bootstrap from 'bootstrap';
import projectApi from '@/apis/projectApi';


const router = useRouter();
const props = defineProps(['projectId']);
const knowledgeList = ref([]);
const projectInfo = ref(null);

//knowledge가 소속된 프로젝트 타이틀 받기
async function getProjectDetail() {
  try {
    const response = await projectApi.getProjectDetail(props.projectId);
    console.log(response);
    projectInfo.value = response.data.data;
    console.log('프로젝트 정보', projectInfo.value);

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

    for (const item of knowledgeList.value) {
      if (item.kfAttachoname != null) {
        item.images = await loadAttachDownload(item.knowledgeId);
      } else {
        item.images = null;
      }
    }
    //** Masonry 레이아웃 초기화 (DOM 업데이트 후)
    await nextTick();
    initMasonry();



  } catch (error) {
    console.log("지식 창고 조회 실패");
  }

}



async function loadAttachDownload(knowledgeId) {
  try {
    const response = await knowledgeApi.knowledgeAttachDownload(knowledgeId);
    const blob = response.data;
    const images = URL.createObjectURL(blob);
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

//** 모달에서 글쓰기 버튼 클릭
function createKnowledgeFromModal() {
  createKnowledge();
}

//** Bootstrap Masonry 초기화
function initMasonry() {
  const masonryGrid = document.querySelector('[data-masonry]');
  if (masonryGrid && window.bootstrap && window.bootstrap.Masonry) {
    new window.bootstrap.Masonry(masonryGrid, {
      percentPosition: true
    });
  }
}

//** 빈 상태일 때 자동으로 모달 표시
function showEmptyStateModal() {
  const modalElement = document.getElementById('emptyStateModal');
  if (modalElement) {
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}

watch(knowledgeList, (newList) => {
  if (newList.length === 0) {

    nextTick(() => {
      showEmptyStateModal();
    });
  }
}, { immediate: false });



onMounted(async () => {
  console.log("지식창고 컴포넌트 마운트");
  await getProjectDetail();
  await getKnowledgeList();

  //** 초기 로드 후 빈 상태면 모달 표시
  if (knowledgeList.value.length === 0) {
    showEmptyStateModal();
  }
})

</script>
<!--컴포넌트의 스타일 정의-->
<style scoped>
.masonry-grid {
  column-count: 3;

  column-gap: 10px;

  padding: 0;
}

.masonry-item {
  break-inside: avoid;

  margin-bottom: 0.5rem;
  display: inline-block;

  width: 100%;
}


@media (max-width: 1400px) {
  .masonry-grid {
    column-count: 3;

  }
}

@media (max-width: 992px) {
  .masonry-grid {
    column-count: 2;

  }
}

@media (max-width: 576px) {
  .masonry-grid {
    column-count: 1;

  }
}

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}


.card-img-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f0f0f0;
}

.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.hover-lift:hover .card-img-top {
  transform: scale(1.05);
}


.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  max-height: 4.5em;
}


.card-title {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.card-title a:hover {
  color: #0d6efd !important;
}


.badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35em 0.65em;
}


.card-footer {
  padding: 0.75rem 1rem;
}

.card-footer small {
  font-size: 0.85rem;
}


.modal-content {
  border-radius: 16px;
  border: none;
}

.modal-body .bi-inbox {
  opacity: 0.3;
}
</style>