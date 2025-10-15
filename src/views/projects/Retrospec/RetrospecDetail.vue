<template>
  <div class="retrospec-detail">
    <!-- 제목 -->
    <h2 class="title">{{ retrospec.retrospecTitle }}</h2>

    <!-- 작성자 -->
    <div class="meta">
      <div class="meta-left">
        <img
          v-if="retrospec.profileUrl"
          :src="retrospec.profileUrl"
          alt="profile"
          class="profile-img"
        />
        <span class="by">by</span>
        <span class="author-name">{{ retrospec.userName }}</span>
        <span class="dot">·</span>
        <span class="reg-label">등록일</span>
        <span class="date">{{ formatDate(retrospec.retrospecStartAt) }}</span>
      </div>

      <!-- ✅ 본인일 경우만 수정/삭제 버튼 -->
      <div v-if="isAuthor" class="meta-right">
        <button class="edit-btn" @click="showEditModal = true">수정</button>
        <button class="delete-btn" @click="showDeleteModal = true">삭제</button>
      </div>
    </div>

    <!-- 내용 -->
    <div id="viewer" class="viewer"></div>

    <!-- ✅ 수정 확인 모달 -->
    <BaseModal
      :show="showEditModal"
      type="default-dual"
      title="회고 수정"
      @close="showEditModal = false"
      @confirm="confirmEdit"
    >
      회고를 수정하시겠습니까?
    </BaseModal>

    <!-- ✅ 삭제 확인 모달 -->
    <BaseModal
      :show="showDeleteModal"
      type="default-dual"
      title="회고 삭제"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    >
      회고를 삭제하시겠습니까?
    </BaseModal>

    <!-- ✅ 하단 네비게이션 (기존 UI 그대로 유지) -->
    <div class="nav-bar">
      <!-- 이전글 -->
      <div class="nav-item prev" @click="goPrev" :class="{ disabled: !prevRetro }">
        <ArrowLeftCircleIcon class="nav-arrow" />
        <div class="nav-text">
          <small>이전 글</small>
          <p>{{ prevRetro ? prevRetro.retrospecTitle : "이전 글이 없습니다" }}</p>
        </div>
      </div>

      <!-- 목록으로 -->
      <button class="nav-list" @click="goList">목록으로</button>

      <!-- 다음글 -->
      <div class="nav-item next" @click="goNext" :class="{ disabled: !nextRetro }">
        <div class="nav-text right">
          <small>다음 글</small>
          <p>{{ nextRetro ? nextRetro.retrospecTitle : "다음 글이 없습니다" }}</p>
        </div>
        <ArrowRightCircleIcon class="nav-arrow" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import retrospecApi from "@/apis/retrospecApi";
import usersApi from "@/apis/usersApi";
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import BaseModal from "@/components/BaseModal.vue";
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "@heroicons/vue/24/solid";

const route = useRoute();
const router = useRouter();
const store = useStore();

const retrospec = ref({});
const retrospecList = ref([]);
const prevRetro = ref(null);
const nextRetro = ref(null);

// ✅ 모달 상태
const showEditModal = ref(false);
const showDeleteModal = ref(false);

// ✅ 본인 여부
const isAuthor = computed(() => {
  return Number(store.getters.getUserId) === Number(retrospec.value.userId);
});

/* 날짜 포맷 */
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

/* ✅ 수정 확인 */
function confirmEdit() {
  showEditModal.value = false;
  router.push({
    name: "RetrospecEdit",
    params: { projectId: route.params.projectId, retroId: retrospec.value.retroId },
  });
}

/* ✅ 삭제 확인 */
async function confirmDelete() {
  try {
    await retrospecApi.retrospecDelete(
      retrospec.value.retroId,
      route.params.projectId,
      store.getters.getUserId
    );
    showDeleteModal.value = false;
    goList();
  } catch (err) {
    console.error("삭제 실패:", err);
  }
}

/* 네비게이션 계산 */
function setNavigation() {
  const currentId = Number(route.params.retroId);
  const list = retrospecList.value;
  const idx = list.findIndex((it) => Number(it.retroId) === currentId);
  prevRetro.value = idx < list.length - 1 ? list[idx + 1] : null;
  nextRetro.value = idx > 0 ? list[idx - 1] : null;
}

/* 이동 함수 */
function goPrev() {
  if (!prevRetro.value) return;
  router.push({
    name: "RetrospecDetail",
    params: { projectId: route.params.projectId, retroId: prevRetro.value.retroId },
  });
}
function goNext() {
  if (!nextRetro.value) return;
  router.push({
    name: "RetrospecDetail",
    params: { projectId: route.params.projectId, retroId: nextRetro.value.retroId },
  });
}
function goList() {
  router.push({
    name: "RetrospecHome",
    params: { projectId: route.params.projectId },
    query: { tab: "list" },
  });
}

/* 상세 로드 + Viewer 렌더링 */
async function loadRetrospecDetail(retroId) {
  const { data } = await retrospecApi.getRetrospecDetail(retroId);
  retrospec.value = data;

  try {
    const img = await usersApi.ufAttachDownload(data.userId);
    retrospec.value.profileUrl = URL.createObjectURL(img.data);
  } catch {
    retrospec.value.profileUrl = "/images/default-profile.png";
  }

  const userRes = await usersApi.usersDetailById(data.userId);
  retrospec.value.userName = userRes.data?.data?.userName || "알 수 없는 사용자";

  const viewerEl = document.getElementById("viewer");
  if (viewerEl) viewerEl.innerHTML = "";
  new Viewer({
    el: viewerEl,
    initialValue: retrospec.value.retrospecContent || "",
  });
}

/* 최초 로드 */
onMounted(async () => {
  const { projectId, retroId } = route.params;
  const listRes = await retrospecApi.getRetrospecList(projectId);
  retrospecList.value = listRes.data?.data || listRes.data || [];
  await loadRetrospecDetail(retroId);
  setNavigation();
});

/* 동일 컴포넌트 내에서 retroId만 바뀔 때 */
watch(
  () => route.params.retroId,
  async (newId) => {
    if (!newId) return;
    await loadRetrospecDetail(newId);
    setNavigation();
  }
);
</script>

<style scoped>
/* ✅ 기존 스타일 그대로 유지 */
.retrospec-detail {
  padding: 10px 10px;
  width: 90%;
  box-sizing: border-box;
  background: #fff;
  margin: 0 auto;
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1px;
}

.meta {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 버튼용 */
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #555;
}

/* ✅ 오른쪽 버튼 추가 */
.meta-right {
  display: flex;
  gap: 8px;
}
.edit-btn,
.delete-btn {
  padding: 6px 16px;
  font-size: 0.8rem;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}
.edit-btn {
  background: #111;
  color: #fff;
  border: none;
  font-weight: 500;
}
.edit-btn:hover {
  background: #6759f4;
}
.delete-btn {
  background: #fff;
  border: 1px solid #ccc;
  color: #333;
  font-weight: 500;
}
.delete-btn:hover {
  background: #6759f4;
  color: #fff;
  border: 1px solid #6759f4;
}

/* 나머지 기존 CSS 그대로 복사 */
.profile-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.by {
  color: #777;
  font-size: 0.8rem;
  margin-left: 4px;
}
.author-name {
  color: #111;
  font-weight: 700;
  font-size: 0.9rem;
}
.dot {
  color: #333;
  margin: 0 2px;
  font-size: 1rem;
}
.reg-label {
  color: #333;
  font-size: 0.8rem;
}
.date {
  color: #999;
  font-size: 0.8rem;
}
.viewer {
  font-size: 1.5rem;
  line-height: 1;
  color: #222;
  min-height: unset;
  height: auto;
  border-top: 1px solid #ababab;
  padding-top: 20px;
  margin-top: 20px;
}
.nav-bar {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 60px;
  padding: 0 60px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.15s ease;
}
.nav-item:hover {
  transform: translateY(-1px);
}
.nav-item.disabled {
  opacity: 0.4;
  pointer-events: none;
}
.nav-item.prev {
  justify-self: start;
}
.nav-item.next {
  justify-self: end;
}
.nav-arrow {
  width: 40px;
  height: 40px;
  margin-top: -20px;
  color: #111;
}
.nav-text {
  display: flex;
  flex-direction: column;
  gap: 0px;
}
.nav-text small {
  font-size: 12px;
  color: #888;
  font-weight: 500;
}
.nav-text p {
  font-size: 0.95rem;
  font-weight: 800;
  color: #111;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.nav-text.right {
  text-align: right;
}
.nav-list {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  color: #000;
  border: 1px #ccc;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1;
}
.nav-list:hover {
  border-color: #000;
}
</style>
