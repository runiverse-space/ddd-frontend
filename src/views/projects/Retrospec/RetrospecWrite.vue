<template>
    <div class="retrospec-write">
        <h2>회고 작성하기</h2>

        <!-- 제목 입력 -->
        <input v-model="title" type="text" placeholder="제목을 입력하세요" class="title-input" />

        <!-- Toast UI Editor -->
        <div ref="editorRoot"></div>

        <!-- 템플릿 타입 선택 -->
        <select v-model="templateType" class="select-box">
            <option value="KTP">KTP (Keep-Try-Problem)</option>
            <option value="TIL">TIL (Today I Learned)</option>
            <option value="CSS">CSS (Continue-Start-Stop)</option>
        </select>

        <!-- 버튼 -->
        <div class="actions">
            <button @click="submitRetrospec">저장하기</button>
            <button @click="goBack">취소</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import retrospecApi from "@/apis/retrospecApi";

const route = useRoute();
const router = useRouter();

const title = ref("");
const templateType = ref("KTP"); // 기본값
const editorRoot = ref(null);
let editorInstance = null;

onMounted(() => {
    editorInstance = new Editor({
        el: editorRoot.value,
        height: "400px",
        initialEditType: "markdown",
        previewStyle: "vertical",
        placeholder: "회고 내용을 작성하세요...",
    });
});

async function submitRetrospec() {
    const content = editorInstance.getMarkdown();

    if (!title.value || !content) {
        alert("제목과 내용을 입력해주세요!");
        return;
    }

    try {
        await retrospecApi.retrospecCreate({
            projectId: route.params.projectId,
            userId: 23, // TODO: 로그인된 사용자 ID(store.memberData.userId 등)로 교체
            retrospecTitle: title.value,
            retrospecContent: content,
            retrospecTemplateType: templateType.value,
            retrospecCategory: "task",                 // 필요 시 변경
            retrospecStartAt: new Date().toISOString(),
            retrospecEndAt: new Date().toISOString()
        });

        alert("회고가 저장되었습니다.");
        router.push({ name: "RetrospecHome", params: { projectId: route.params.projectId } });
    } catch (err) {
        console.error("회고 저장 실패:", err);
        alert("저장 실패!");
    }
}

function goBack() {
    router.push({ name: "RetrospecHome", params: { projectId: route.params.projectId } });
}
</script>

<style scoped>
.retrospec-write {
    padding: 20px;
}

.title-input {
    width: 100%;
    padding: 8px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.select-box {
    margin: 10px 0;
    padding: 6px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.actions {
    margin-top: 15px;
    display: flex;
    gap: 10px;
}

.actions button {
    padding: 8px 15px;
    background: #000;
    color: #fff;
    border: none;
    cursor: pointer;
}

.actions button:nth-child(2) {
    background: #aaa;
}
</style>
