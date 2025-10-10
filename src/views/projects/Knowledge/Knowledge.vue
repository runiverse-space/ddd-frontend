<template>
  <div class="knowledge-page">
    <!-- 🔹 태그 필터 -->
    <div class="filter-tags">
      <button v-for="tag in tagList" :key="tag" :class="{ active: selectedTag === tag }" class="tag-btn" @click="filterByTag(tag)">
        {{ tag }}
      </button>
    </div>

    <!-- 🔹 Masonry 카드 리스트 -->
    <div v-if="filteredKnowledgeList.length > 0" class="masonry-grid">
      <div v-for="item in filteredKnowledgeList" :key="item.knowledgeId" class="masonry-item">
        <div class="card-box hover-lift">
          <!-- 이미지 -->
          <div v-if="item.images" class="image-wrapper">
            <img :src="item.images" alt="지식 이미지" class="image" />
          </div>

          <!-- 텍스트 -->
          <div class="text-box">
            <h5 class="title">
              <RouterLink :to="`KnowledgeDetail?knowledgeId=${item.knowledgeId}`" class="text-dark text-decoration-none">
                {{ item.knowledgeTitle }}
              </RouterLink>
            </h5>

            <p v-if="item.knowledgeContent" class="content">
              {{ item.knowledgeContent }}
            </p>

            <!-- URL -->
            <p v-if="item.knowledgeUrl" class="url">
              <a :href="item.knowledgeUrl" target="_blank">
                {{ item.knowledgeUrl }}
              </a>
            </p>

            <!-- ✅ 태그 리스트 -->
            <div v-if="item.tags && item.tags.length" class="tags">
              <span v-for="tag in item.tags" :key="tag.tagId" class="tag" :style="tagStyle(tag)" @click="filterByTag(tag.tagName)">
                {{ tag.tagName }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 글쓰기 버튼 -->
      <button class="write-btn" @click="createKnowledge">✏️ 글쓰기</button>
    </div>

    <!-- 🔹 빈 상태 -->
    <div v-else class="empty-wrap">
      <div class="empty-content">
        <div class="empty-text">
          <p class="empty-title">
            {{ selectedTag === "전체" || !selectedTag ? "지식 창고가 비었습니다." : `"${selectedTag}" 태그의 지식이 없습니다.` }}
          </p>
          <p class="empty-subtitle">당신의 프로젝트에 첫 번째 지식을 추가해주세요.</p>
        </div>

        <RouterLink class="btn btn-dark btn-lg write-btn-inline" to="KnowledgeWrite"> 지식 추가하기 </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import knowledgeApi from "@/apis/knowledgeApi";
import projectApi from "@/apis/projectApi";
import tagApi from "@/apis/tagApi";
import { getTagColors } from "@/utils/tagColor"; // ✅ 색상 유틸
import { onMounted, ref, computed, nextTick } from "vue";
import { useRouter, RouterLink } from "vue-router";

const props = defineProps(["projectId"]);
const router = useRouter();

const knowledgeList = ref([]);
const projectInfo = ref(null);
const selectedTag = ref("전체");
const tagList = ref([]);

/* ✅ 태그 색상 유틸 */
function tagStyle(tag) {
  const { bg, color, border } = getTagColors(tag.tagType || "KNOWLEDGE");
  return {
    backgroundColor: bg,
    color,
    border: `1px solid ${border}`,
    borderRadius: "5px",
    padding: "6px 12px",
    fontWeight: "500",
    fontSize: "0.65rem",
  };
}

/* ✅ 태그 필터링 */
const filteredKnowledgeList = computed(() => {
  if (!selectedTag.value || selectedTag.value === "전체") return knowledgeList.value;
  return knowledgeList.value.filter((item) => item.tags?.some((t) => t.tagName === selectedTag.value));
});
function filterByTag(tag) {
  selectedTag.value = tag;
}

/* ✅ 글쓰기 이동 */
function createKnowledge() {
  router.push(`/project/${props.projectId}/KnowledgeWrite`);
}

/* ✅ 프로젝트 정보 */
async function getProjectDetail() {
  try {
    const res = await projectApi.getProjectDetail(props.projectId);
    projectInfo.value = res.data.data;
  } catch (err) {
    console.log("프로젝트 정보 조회 실패:", err);
  }
}

/* ✅ 지식 리스트 */
async function getKnowledgeList() {
  try {
    const res = await knowledgeApi.knowledgeList(props.projectId);
    knowledgeList.value = res.data;

    // 각 지식 카드의 이미지 및 태그 병합
    for (const item of knowledgeList.value) {
      // 이미지
      item.images = item.kfAttachoname ? await loadAttachDownload(item.knowledgeId) : null;

      // 태그
      const tagRes = await tagApi.getKnowledgeTags(item.knowledgeId);
      if (tagRes.data && tagRes.data.tags) {
        item.tags = tagRes.data.tags.map((t) => ({
          tagId: t.tagId,
          tagName: t.tagName,
          tagType: t.tagType || "KNOWLEDGE",
        }));
      } else if (Array.isArray(tagRes.data)) {
        item.tags = tagRes.data.map((t) => ({
          tagId: t.tagId,
          tagName: t.tagName,
          tagType: t.tagType || "KNOWLEDGE",
        }));
      } else {
        item.tags = [];
      }
    }
    await nextTick();
  } catch (err) {
    console.log("지식 조회 실패:", err);
  }
}

async function loadAttachDownload(knowledgeId) {
  try {
    const res = await knowledgeApi.knowledgeAttachDownload(knowledgeId);
    return URL.createObjectURL(res.data);
  } catch {
    return null;
  }
}

/* ✅ 전체 지식 태그 목록 */
async function getKnowledgeTags() {
  try {
    const res = await tagApi.getTagsByType("KNOWLEDGE");
    const tags = res.data.map((t) => t.tagName);
    tagList.value = ["전체", ...tags];
  } catch (err) {
    console.log("태그 목록 조회 실패:", err);
  }
}

onMounted(async () => {
  await getProjectDetail();
  await getKnowledgeTags();
  await getKnowledgeList();
});
</script>

<style scoped>
.knowledge-page {
  padding: 0px 10px;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
}

/* 🔹 태그 필터 */
.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 16px 0 32px;
}
.tag-btn {
  padding: 7px 15px;
  border-radius: 999px;
  border: 1px solid #333;
  background: transparent;
  color: #000;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.8rem;
  transition: all 0.25s ease;
}
.tag-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}
.tag-btn.active {
  background: #000;
  color: #fff;
}

/* 🔹 Masonry */
.masonry-grid {
  column-count: 4;
  column-gap: 1.5rem;
}

@media (max-width: 1200px) {
  .masonry-grid { column-count: 3; }
}
@media (max-width: 900px) {
  .masonry-grid { column-count: 2; }
}
@media (max-width: 600px) {
  .masonry-grid { column-count: 1; }
}
.masonry-item {
  break-inside: avoid;
  margin-bottom: 1.5rem;
}

/* 🔹 카드 */
.card-box {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
}
.card-box:hover {
  transform: translateY(-3px);
}

/* 이미지 */
.image-wrapper {
  width: 100%;
  background: #f5f5f5;
}
.image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

/* ✅ 텍스트 영역 세로 정렬 */
.text-box {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 14px 16px 16px;
}

/* 제목 */
.title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #111;
  margin: 0;
  line-height: 1.4;

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 본문 */
.content {
  font-size: 0.8rem;
  color: #555555;
  line-height: 1.2;
  margin: 0;
  word-break: keep-all;
}

/* URL */
.url {
  margin: 5px 0 0 0;
  font-size: 0.75rem;
  color: #0066cc;
  word-break: break-all;
}
.url a {
  text-decoration: none;
  color: #a8a8a8;
}
.url a:hover {
  text-decoration: underline;
}

/* 태그 */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  cursor: pointer;
  margin-top: 5px;
}
.tag {
  border-radius: 5px;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
}

/* 버튼 */
.write-btn {
   position: fixed;
  bottom: 24px;
  right: 24px;
  background: rgba(255, 255, 255, 10.9);              /* ✅ 흰색 배경 */
  color: #000;                 
  border: 0px solid #f8f8f8;
  min-width: 100px;      
  padding: 12px 20px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: all 0.25s ease;
  z-index: 1000;
}
.write-btn:hover {
  background: #000;
  color: #fff;
}

/* ✅ 빈 상태 레이아웃 */
.empty-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

/* ✅ 한 줄 배치 (좌: 텍스트 / 우: 버튼) */
.empty-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;

  border-radius: 10px;
  border: 1px dashed #ccc;
  padding: 20px 28px;
  width: 100%;
  max-width: 900px;
}

/* 왼쪽 텍스트 */
.empty-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* 큰 글씨 */
.empty-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #222;
  margin: 0;
}

/* 작은 글씨 */
.empty-subtitle {
  font-size: 0.85rem;
  color: #bbbbbb;
  margin: 0;
}

/* 오른쪽 버튼 */
.write-btn-inline {
  font-size: 0.9rem;
  font-weight: 500;
  padding:9px 16px;
  border-radius: 999px;
}
</style>
