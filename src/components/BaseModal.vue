<template>
    <Teleport to="body">
        <div v-if="show" class="modal-overlay" @click.self="close">
            <div class="base-modal" :style="{
                width: typeof width === 'number' ? width + 'px' : width,
                height: typeof height === 'number' ? height + 'px' : height,
            }">
                <!-- 상단 헤더 -->
                <div class="modal-header" :class="type">
                    <div class="left-group">
                        <component :is="iconComponent" class="header-icon" />
                        <h3 class="modal-title">{{ titleText }}</h3>
                    </div>
                    <button class="close-btn" @click="close">
                        <XMarkIcon class="icon" />
                    </button>
                </div>

                <!-- 본문 -->
                <div class="modal-body">
                    <slot>{{ defaultMessage }}</slot>
                </div>

                <!-- 확인 버튼 -->
                <div class="modal-footer">
                    <button class="confirm-btn" :class="type" @click="close">확인</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { computed } from "vue";
import {
    XMarkIcon,
    InformationCircleIcon,
    XCircleIcon,
    CheckCircleIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({
    show: Boolean,
    type: { type: String, default: "default" },
    title: { type: String, default: "" },
    width: { type: [Number, String], default: 440 },
    height: { type: [Number, String], default: "auto" },
});

const emits = defineEmits(["close"]);

const iconComponent = computed(() => {
    return props.type === "info"
        ? InformationCircleIcon
        : props.type === "error"
            ? XCircleIcon
            : CheckCircleIcon;
});

const titleText = computed(() =>
    props.title
        ? props.title
        : props.type === "info"
            ? "Info title"
            : props.type === "error"
                ? "Error title"
                : "Default title"
);

const defaultMessage = computed(() =>
    props.type === "info"
        ? "요청이 정상적으로 처리되었습니다."
        : props.type === "error"
            ? "문제가 발생했습니다. 잠시 후 다시 시도해주세요."
            : "확인이 필요한 알림입니다."
);

function close() {
    emits("close");
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20000;
}

/* ✅ width 고정만 유지 */
.base-modal {
    width: var(--modal-width, 440px);
    height: var(--modal-height, auto);
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: fadeIn 0.25s ease;
}

/* HEADER */
.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 40px;
    padding: 0 10px;
    color: #fff;
}

.left-group {
    display: flex;
    align-items: center;
    gap: 6px;
}

.header-icon {
    width: 18px;
    height: 18px;
}

.modal-title {
    font-size: 14px;
    font-weight: 700;
}

/* 타입별 헤더 색상 */
.modal-header.info {
    background: #3f8047;
}

.modal-header.error {
    background: #a62b2b;
}

.modal-header.default {
    background: #252525;
}

/* 닫기 버튼 */
.close-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #fff;
    padding: 4px;
}

.close-btn:hover {
    opacity: 0.8;
}

.icon {
    width: 18px;
    height: 18px;
}

/* BODY */
.modal-body {
    padding: 20px 20px 10px;
    /* ✅ 하단 여백 줄임 */
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 13px;
    font-weight: 500;
    color: #222;
    white-space: normal;
    word-break: break-word;
    line-height: 1.6;
}

/* FOOTER */
.modal-footer {
    display: flex;
    justify-content: center;
    padding: 6px 0 16px;
    /* ✅ 위쪽 여백 ↓ */
}

.confirm-btn {
    padding: 8px 22px;
    border: none;
    border-radius: 6px;
    color: #fff;
    font-weight: 500;
    font-size: 13px;
    cursor: pointer;
    transition: opacity 0.2s ease;
}

.confirm-btn:hover {
    opacity: 0.9;
}

/* 타입별 버튼 색상 */
.confirm-btn.info {
    background: #3f8047;
}

.confirm-btn.error {
    background: #a62b2b;
}

.confirm-btn.default {
    background: #252525;
}

/* 애니메이션 */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
