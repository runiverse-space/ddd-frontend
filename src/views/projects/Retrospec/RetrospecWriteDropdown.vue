<template>
    <div class="write-dropdown">
        <!-- 상단 버튼 -->
        <button class="dropdown-header" @click="handleHeaderClick">
            <div class="header-text">
                <h3 class="title">오늘의 회고 작성하기</h3>
                <p class="subtitle">작성할 회고 템플릿을 선택해주세요.</p>
            </div>
            <ChevronDownIcon class="icon" :class="{ open: isOpen }" @click.stop="toggleDropdown" />
        </button>

        <!-- 드롭다운 메뉴 -->
        <transition name="fade">
            <div v-if="isOpen" class="dropdown-menu">
                <div v-for="template in templates" :key="template.type" class="dropdown-item"
                    @click="selectTemplate(template.type)">
                    <span class="template-name">{{ template.name }}</span>
                    <span class="template-desc">{{ template.desc }}</span>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const isOpen = ref(false);

const templates = [
    { type: "KTP", name: "KTP 회고", desc: "Keep-Try-Problem" },
    { type: "TIL", name: "TIL 회고", desc: "Today I Learned" },
    { type: "CSS", name: "CSS 회고", desc: "Continue-Start-Stop" },
];

function toggleDropdown() {
    isOpen.value = !isOpen.value;
}

function handleHeaderClick() {
    // 메인 버튼 클릭 시 바로 작성 페이지 이동
    router.push({
        name: "RetrospecWrite",
        params: { projectId: route.params.projectId },
    });
}

function selectTemplate(type) {
    isOpen.value = false;
    router.push({
        name: "RetrospecWrite",
        params: { projectId: route.params.projectId },
        query: { template: type },
    });
}
</script>

<style scoped>
.write-dropdown {
    position: relative;
    display: inline-block;
    width: 280px;
    font-family: "Pretendard", sans-serif;
}

/* ✅ 상단 박스 버튼 */
.dropdown-header {
    width: 100%;
    background: #fff;
    border: 1.3px solid #d3d3d3;
    border-radius: 8px;
    /* 라운드 축소 */
    padding: 10px 14px;
    /* 여백 조정 */
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: border-color 0.2s ease;
}

.dropdown-header:hover {
    border-color: #111;
}

/* ✅ 텍스트 구조 */
.header-text {
    text-align: left;
}

.title {
    font-weight: 700;
    font-size: 0.95rem;
    color: #111;
    margin: 0;
}

.subtitle {
    font-size: 0.75rem;
    color: #9b9b9b;
    margin-top: 2px;
}

/* ✅ 화살표 */
.icon {
    width: 18px;
    height: 18px;
    color: #111;
    transition: transform 0.25s ease;
}

.icon.open {
    transform: rotate(180deg);
}

/* ✅ 드롭다운 메뉴 */
.dropdown-menu {
    position: absolute;
    top: calc(100% - 2px);
    left: 0;
    width: 100%;
    background: #fff;
    border: 1.3px solid #d3d3d3;
    border-top: none;
    border-radius: 0 0 8px 8px;
    /* 위아래 라운드 동일하게 축소 */
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
    z-index: 999;
    overflow: visible;
    /* ✅ 메뉴가 잘리지 않도록 수정 */
}

/* ✅ 항목 스타일 */
.dropdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    font-size: 0.9rem;
    font-weight: 700;
    background: #fff;
    transition: background 0.15s ease;
}

.dropdown-item:hover {
    background: #f5f5f5;
}

.template-name {
    color: #111;
}

.template-desc {
    font-size: 0.8rem;
    color: #999;
    font-weight: 400;
}

/* ✅ 열고 닫을 때 fade 효과 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
