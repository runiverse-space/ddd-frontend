<!--컴포넌트의 UI-->
<template>
  <div>
    <div class="filter-section">
      <div class="filter-tags">
        <button v-for="tag in tagList" :key="tag" :class="{ active: selectedTag === tag }" class="tag-btn" @click="filterByTag(tag)">
          {{ tag }}
        </button>
      </div>
    </div>
    
    <div v-if="filteredKnowledgeList.length > 0" class="content-with-sidebar">

      <!-- 왼쪽: masonry (칼럼 기반) -->


      <div class="masonry-grid">
        <!-- 카드 목록 -->
        <div class="masonry-item" v-for="item in filteredKnowledgeList" :key="item.knowledgeId">

          <div class="card h-100 shadow-sm hover-lift">

            <div v-if="item.images" class="card-img-wrapper">
              <img :src="item.images" class="card-img-top" alt="지식 이미지" loading="lazy">
            </div>

            <div class="card-body">

              <h5 class="card-title fw-bold">
                <RouterLink :to="`KnowledgeDetail?knowledgeId=${item.knowledgeId}`" class="text-decoration-none text-dark stretched-link">
                  {{ item.knowledgeTitle }}
                </RouterLink>
              </h5>



              <p class="card-text text-muted text-truncate-3">
                {{ item.knowledgeContent }}
              </p>

              <!-- 태그 표시 -->
              <div v-if="item.tags && item.tags.length > 0" class="knowledge-tags">
                <span v-for="tag in item.tags" :key="tag" class="knowledge-tag" @click.stop="filterByTag(tag)">
                  {{ tag }}
                </span>
              </div>
              <!-- URL 링크 (있을 경우) -->
              <a v-if="item.knowledgeUrl" :href="item.knowledgeUrl">
                {{ item.knowledgeUrl }}
              </a>
            </div>

          </div>
        </div>
      </div>

      <!--글쓰기 버튼 -->
      <button class="write-btn">
        <RouterLink  to="KnowledgeWrite">글쓰기</RouterLink>
      </button>

    </div>
    <!-- 빈 상태 -->
    <div v-else>
      <div class="card" style="width: 900px; height: 100px;">
        <div class="card-body">
          <p v-if="selectedTag === '전체' || selectedTag === null">
            지식 창고가 비었습니다.
          </p>
          <p v-else>
            "{{ selectedTag }}" 태그의 지식이 없습니다.
          </p>
          <p>당신의 프로젝트에 첫번째 지식을 추가해주세요.</p>
        </div>
      </div>

      <div style="text-align: right; margin-top: 20px; width: 900px;">
        <RouterLink class="btn btn-dark btn-lg" to="KnowledgeWrite">글쓰기</RouterLink>
      </div>
    </div>
  </div>
</template>

<!--컴포넌트의 초기화 또는 이벤트 처리-->
<script setup>
import knowledgeApi from '@/apis/knowledgeApi';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';


import projectApi from '@/apis/projectApi';
import tagApi from '@/apis/tagApi';


const props = defineProps(['projectId']);
const knowledgeList = ref([]);
const projectInfo = ref(null);

//태그 관련 상태 추가
const selectedTag = ref('전체');
const tagList = ref([]);

//필터링된 지식 목록(computed 속성);
const filteredKnowledgeList = computed(() => {
  if (!selectedTag.value || selectedTag.value === '전체') {
    return knowledgeList.value;
  }
  return knowledgeList.value.filter((item) =>
    item.tags && item.tags.includes(selectedTag.value)
  );
});

//** 태그 클릭 시 필터 변경
const filterByTag = (tag) => {
  selectedTag.value = tag;
};

//knowledge가 소속된 프로젝트 정보 가져오기
async function getProjectDetail() {
  try {
    const response = await projectApi.getProjectDetail(props.projectId);
    // console.log(response);
    projectInfo.value = response.data.data;
    // console.log('프로젝트 정보', projectInfo.value);

  } catch (error) {
    console.log(error);
  }
}

async function getKnowledgeList() {
  try {
    // console.log("지식창고 받은 projectId", props.projectId);

    const response = await knowledgeApi.knowledgeList(props.projectId);
    //console.log("전체 응답 구조 확인용 로그 추가",response);

    knowledgeList.value = response.data;
    // console.log("지식 목록 조회 성공: ", knowledgeList.value);

    for (const item of knowledgeList.value) {
      if (item.kfAttachoname != null) {
        item.images = await loadAttachDownload(item.knowledgeId);
      } else {
        item.images = null;
      }

      try {
        const tagResponse = await tagApi.getKnowledgeTags(item.knowledgeId);
        if (tagResponse.data && tagResponse.data.tags) {
          item.tags = tagResponse.data.tags.map((t) => t.tagName);
        } else if (Array.isArray(tagResponse.data)) {
          item.tags = tagResponse.data.map((t) => t.tagName);
        } else {
          item.tags = [];
        }
      } catch (error) {
        console.log(`지식 ${item.knowledgeId}의 태그 로드 실패:`, error);
        item.tags = [];
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
    // console.log(`지식 ${knowledgeId}의 이미지 로드 완료:`, images);
    return images;
  } catch (error) {
    console.log(error);
    return null;
  }
}

//태그 목록 가져오기
async function getKnowledgeTags() {
  try {
    const response = await tagApi.getTagsByType('KNOWLEDGE');
    const tagsFromApi = response.data.map((tag) => tag.tagName);
    tagList.value = ['전체', ...tagsFromApi];
   // console.log('지식 태그 목록:', tagList.value);
  } catch (error) {
    console.log('태그 조회 실패:', error);
  }
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

watch(filteredKnowledgeList, (newList) => {
  if (newList.length === 0) {

    nextTick(() => {
      //showEmptyStateModal();
    });
  }
}, { immediate: false });



onMounted(async () => {
  //console.log("지식창고 컴포넌트 마운트");
  await getProjectDetail();
  await getKnowledgeTags();
  await getKnowledgeList();

  //** 초기 로드 후 빈 상태면 모달 표시
  if (filteredKnowledgeList.value.length === 0) {
    //showEmptyStateModal();
  }
})

</script>
<!--컴포넌트의 스타일 정의-->
<style scoped>
/* 🔹 태그 필터 영역 스타일 */
.filter-section {
  margin: 24px 0;
  padding: 16px 0;
  border-bottom: 1px solid #e0e0e0;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

/* 태그 버튼 기본 스타일 */
.tag-btn {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #333;
  background: transparent;
  color: #333;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.25s ease;
}

/* 태그 버튼 hover */
.tag-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

/* 선택된 태그 버튼 */
.tag-btn.active {
  background: #000;
  color: #fff;
  border-color: #000;
}

/* 🔹 카드 내부 태그 표시 영역 */
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

.knowledge-tag:hover {
  background: #e0e0e0;
  color: #333;
}






.content-with-sidebar {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}


/* 글쓰기 버튼 전용 사이드 칼럼 */
.side-column {
  flex: 0 0 220px;
  /* 고정 폭 */
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

/* 글쓰기 버튼 공통 스타일 */
.write-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #e0e0e0;       /* 회색 배경 */
  color: #000000;            /* 검정 글씨 */
  padding: 12px 20px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;
  z-index: 1000;  
}

.write-btn:hover {
   background: #000000;
  color: #ffffff;
}

.write-btn a {
  text-decoration: none;   /* 밑줄 제거 */
  color: inherit;          /* 버튼 색상 상속 */
  display: inline-block;
}


/* 글이 없을 때 카드와 버튼을 정렬하는 wrapper */
.empty-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-end;
  max-width: 900px;
}

.empty-card {
  width: 100%;
  height: 100px;
}

/* 반응형: 화면이 작아지면 사이드 버튼이 아래로 이동 */
@media (max-width: 992px) {
  .content-with-sidebar {
    flex-direction: column-reverse;
  }

  .side-column {
    flex-basis: auto;
    width: 100%;
  }
}





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