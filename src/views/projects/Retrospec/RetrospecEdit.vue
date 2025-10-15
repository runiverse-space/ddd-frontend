<template>
  <div class="retrospec-write">
    <h2 class="page-title">회고 수정하기</h2>

    <!-- 제목 입력 -->
    <input v-model="title" type="text" placeholder="제목을 입력하세요" class="title-input" />

    <!-- 템플릿 + 날짜 한 줄 -->
    <div class="date-row">
      <div class="template-group">
        <label>템플릿</label>
        <select
          v-model="templateType"
          @change="handleTemplateChange"
          class="select-box"
        >
          <option disabled value="">템플릿을 선택해주세요</option>
          <option value="KTP">KTP (Keep-Try-Problem)</option>
          <option value="TIL">TIL (Today I Learned)</option>
          <option value="CSS">CSS (Continue-Start-Stop)</option>
        </select>
      </div>

      <div class="date-group">
        <label>시작일</label>
        <input type="date" v-model="startDate" />
      </div>

      <div class="date-group">
        <label>종료일</label>
        <input type="date" v-model="endDate" :min="startDate" />
      </div>
    </div>

    <!-- Toast UI Editor -->
    <div ref="editorRoot" class="editor-container"></div>

    <!-- 버튼 -->
    <div class="actions">
      <button class="save-btn" @click="showConfirmModal = true">수정하기</button>
      <button class="cancel-btn" @click="goBack">취소</button>
    </div>

    <!-- ✅ 수정 확인 모달 -->
    <BaseModal
      :show="showConfirmModal"
      type="default-dual"
      title="회고 수정"
      @close="showConfirmModal = false"
      @confirm="confirmEdit"
    >
      회고를 수정하시겠습니까?
    </BaseModal>

    <!-- ✅ 템플릿 변경 경고 모달 -->
    <BaseModal
      :show="showTemplateModal"
      type="default-dual"
      title="템플릿 변경"
      height="190"
      @close="cancelTemplateChange"
      @confirm="confirmTemplateChange"
    >
      템플릿을 변경하면 작성 중인 내용이 초기화됩니다.<br />
      계속하시겠습니까?
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import retrospecApi from "@/apis/retrospecApi";
import { RETROSPEC_TEMPLATES } from "./RetrospecTemplates.js";
import { useStore } from "vuex";
import BaseModal from "@/components/BaseModal.vue";

const store = useStore();
const route = useRoute();
const router = useRouter();

const title = ref("");
const templateType = ref("");
const startDate = ref("");
const endDate = ref("");
const editorRoot = ref(null);
let editorInstance = null;

// ✅ 기존 데이터 로드용
const retrospecId = ref(null);

// 모달 상태
const showConfirmModal = ref(false);
const showTemplateModal = ref(false);
const pendingTemplate = ref("");
const previousTemplate = ref("");

/* ✅ Toast Editor 초기화 후 기존 데이터 로드 */
onMounted(async () => {
  // 먼저 Editor 생성
  editorInstance = new Editor({
    el: editorRoot.value,
    height: "400px",
    initialEditType: "markdown",
    previewStyle: "vertical",
  });

  const { projectId, retroId } = route.params;
  retrospecId.value = retroId;

  // ✅ 데이터 로드
  const { data } = await retrospecApi.getRetrospecDetail(retroId);

  // 데이터 상태값 세팅
  title.value = data.retrospecTitle;
  templateType.value = data.retrospecTemplateType;
  previousTemplate.value = data.retrospecTemplateType;
  startDate.value = data.retrospecStartAt?.split("T")[0];
  endDate.value = data.retrospecEndAt?.split("T")[0];

  // ✅ Editor가 완전히 렌더된 후 내용 반영 (nextTick 보장)
  await nextTick();
  editorInstance.setMarkdown(data.retrospecContent || "");
});

/* ✅ 템플릿 변경 감지 */
function handleTemplateChange(e) {
  const newTemplate = e.target.value;

  if (!previousTemplate.value) {
    previousTemplate.value = newTemplate;
    templateType.value = newTemplate;
    editorInstance.setMarkdown(RETROSPEC_TEMPLATES[newTemplate]);
    return;
  }

  if (previousTemplate.value !== newTemplate) {
    pendingTemplate.value = newTemplate;
    showTemplateModal.value = true;
  }
}

/* ✅ 템플릿 변경 확인 */
function confirmTemplateChange() {
  previousTemplate.value = pendingTemplate.value;
  templateType.value = pendingTemplate.value;
  editorInstance.setMarkdown(RETROSPEC_TEMPLATES[pendingTemplate.value]);
  showTemplateModal.value = false;
}

/* ✅ 템플릿 변경 취소 */
function cancelTemplateChange() {
  templateType.value = previousTemplate.value;
  showTemplateModal.value = false;
}

/* ✅ 수정 모달 확인 시 실행 */
function confirmEdit() {
  showConfirmModal.value = false;
  submitEdit();
}

/* ✅ 회고 수정 요청 */
async function submitEdit() {
  const content = editorInstance.getMarkdown();
  if (!title.value || !content) return alert("제목과 내용을 입력해주세요!");
  if (!startDate.value) return alert("시작일을 선택해주세요!");

  if (!endDate.value) endDate.value = startDate.value;
  if (new Date(endDate.value) < new Date(startDate.value))
    return alert("종료일은 시작일보다 이후여야 합니다.");

  const now = new Date();
  const time = now.toTimeString().split(" ")[0];
  const startAt = `${startDate.value}T${time}`;
  const endAt = `${endDate.value}T23:59:59`;

  try {
    const requestData = {
      projectId: route.params.projectId,
      userId: store.getters.getUserId,
      retrospecTitle: title.value,
      retrospecContent: content,
      retrospecTemplateType: templateType.value,
      retrospecStartAt: startAt,
      retrospecEndAt: endAt,
    };

    console.log("수정 요청 데이터", requestData);
    await retrospecApi.retrospecUpdate(retrospecId.value, requestData);
    goBack();
  } catch (err) {
    console.error("회고 수정 실패:", err);
    alert("수정 실패!");
  }
}

/* ✅ 뒤로가기 */
function goBack() {
  router.push({
    name: "RetrospecDetail",
    params: { projectId: route.params.projectId, retroId: retrospecId.value },
  });
}
</script>

<style scoped>
/* ✅ RetrospecWrite.vue 스타일 그대로 복사 */
.retrospec-write {
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.title-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.date-row {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  flex-wrap: wrap;
}

.date-group,
.template-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 180px;
}

.date-group label,
.template-group label {
  font-size: 0.9rem;
  color: #444;
  font-weight: 500;
}

.date-group input,
.select-box {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.9rem;
  width: 100%;
}

.editor-container {
  margin-top: 10px;
}

.actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.save-btn {
  background: #000;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 10px 24px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.save-btn:hover {
  background: #4d3df0;
}

.cancel-btn {
  background: #aaa;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 10px 24px;
  font-size: 0.95rem;
  cursor: pointer;
}
</style>
