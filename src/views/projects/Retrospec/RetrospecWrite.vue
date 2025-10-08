<template>
    <div class="retrospec-write">
        <h2 class="page-title">회고 작성하기</h2>

        <!-- 제목 입력 -->
        <input v-model="title" type="text" placeholder="제목을 입력하세요" class="title-input" />

        <!-- 날짜 선택 -->
        <div class="date-row">
            <div class="date-group">
                <label>시작일</label>
                <input type="date" v-model="startDate" />
            </div>
            <div class="date-group">
                <label>종료일</label>
                <input type="date" v-model="endDate" :min="startDate" />
            </div>
        </div>

        <!-- 템플릿 선택 -->
        <select v-model="templateType" class="select-box">
            <option disabled value="">템플릿을 선택해주세요</option>
            <option value="KTP">KTP (Keep-Try-Problem)</option>
            <option value="TIL">TIL (Today I Learned)</option>
            <option value="CSS">CSS (Continue-Start-Stop)</option>
        </select>

        <!-- Toast UI Editor -->
        <div ref="editorRoot" class="editor-container"></div>

        <!-- 버튼 -->
        <div class="actions">
            <button class="save-btn" @click="submitRetrospec">등록하기</button>
            <button class="cancel-btn" @click="goBack">취소</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import retrospecApi from "@/apis/retrospecApi";
import { RETROSPEC_TEMPLATES } from "./RetrospecTemplates.js"; // ✅ 이렇게 import
import { useStore } from "vuex";

const store = useStore();
const route = useRoute();
const router = useRouter();

const title = ref("");
const templateType = ref("");
const startDate = ref("");
const endDate = ref("");
const editorRoot = ref(null);
let editorInstance = null;

/* ✅ Toast Editor 초기화 */
onMounted(() => {
    editorInstance = new Editor({
        el: editorRoot.value,
        height: "400px",
        initialEditType: "markdown",
        previewStyle: "vertical",
        placeholder: "회고 내용을 작성하세요...",
    });
});

/* ✅ 템플릿 선택 시 에디터 반영 */
watch(templateType, (newType) => {
    if (newType && editorInstance) {
        editorInstance.setMarkdown(RETROSPEC_TEMPLATES[newType]); // ✅ 바로 사용
    }
});

/* ✅ 회고 저장 */
async function submitRetrospec() {
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
        /*
        await retrospecApi.retrospecCreate({
            projectId: route.params.projectId,
            userId: store.getters.getUserId,
            userName: store.getters.getUserName,
            retrospecTitle: title.value,
            retrospecContent: content,
            retrospecTemplateType: templateType.value,
            retrospecCategory: "task",
            retrospecStartAt: startAt,
            retrospecEndAt: endAt,
        }); */
        const requestData = {
            projectId: route.params.projectId,
            userId: store.getters.getUserId,
            retrospecTitle: title.value,
            retrospecContent: content,
            retrospecTemplateType: templateType.value,
            retrospecCategory: "task",
            retrospecStartAt: startAt,
            retrospecEndAt: endAt,
        };

        console.log("데이터 요청", requestData);

        await retrospecApi.retrospecCreate(requestData);


        alert("회고가 저장되었습니다.");
        goBack();
    } catch (err) {
        console.error("회고 저장 실패:", err);
        alert("저장 실패!");
    }
}

/* ✅ 뒤로가기 */
function goBack() {
    router.push({ name: "RetrospecHome", params: { projectId: route.params.projectId } });
}
</script>

<style scoped>
.retrospec-write {
    padding: 20px;
    max-width: 760px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.page-title {
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 10px;
}

/* 제목 입력 */
.title-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
}

/* 날짜 선택 */
.date-row {
    display: flex;
    gap: 20px;
    align-items: flex-end;
}

.date-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.date-group label {
    font-size: 0.9rem;
    color: #444;
    font-weight: 500;
}

.date-group input {
    padding: 6px 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.9rem;
}

/* 템플릿 선택 */
.select-box {
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9rem;
}

/* 에디터 */
.editor-container {
    margin-top: 10px;
}

/* 버튼 영역 */
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
    font-weight: 600;
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
