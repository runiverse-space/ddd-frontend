<template>
    <Teleport to="body">
        <div v-if="show" class="modal-overlay" @click.self="close">
            <div class="base-modal" :style="{
                '--modal-width': typeof width === 'number' ? width + 'px' : width,
                '--modal-height': typeof height === 'number' ? height + 'px' : height,
            }">
                <!-- 헤더 -->
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

                <!-- 하단 버튼 -->
                <div class="modal-footer">
                    <button class="confirm-btn" :class="type" @click="handleButtonClick">
                        {{ buttonText }}
                    </button>
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
    FaceSmileIcon
} from "@heroicons/vue/24/outline";

const props = defineProps({
    show: Boolean,
    type: { type: String, default: "default" },
    title: String,
    width: { type: [Number, String], default: 480 },
    height: { type: [Number, String], default: 160 },
    buttonText: { type: String, default: "확인" },
    buttonAction: { type: String, default: "close" },
});

const emits = defineEmits(["close", "confirm"]);

const iconComponent = computed(() =>
    props.type === "info"
        ? InformationCircleIcon
        : props.type === "error"
            ? XCircleIcon
            : FaceSmileIcon
);

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

function handleButtonClick() {
    props.buttonAction === "close" ? emits("close") : emits("confirm");
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

/* ✅ 불필요한 고정값 제거, overflow 해제 */
.base-modal {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    overflow: visible;
    animation: fadeIn 0.25s ease;

    width: var(--modal-width, 440px);
    height: var(--modal-height, auto);
}

/* HEADER */
.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 14px;
    min-height: 42px;
}

.modal-header.info {
    background: #3f8047;
    color: #fff;
}

.modal-header.error {
    background: #a62b2b;
    color: #fff;
}

.modal-header.default {
    background: transparent;
    border-bottom: 1px solid #eee;
    color: #111;
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

/* CLOSE 버튼 */
.close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
}

.modal-header.default .close-btn {
    color: #111;
}

.modal-header.info .close-btn,
.modal-header.error .close-btn {
    color: #fff;
}

.icon {
    width: 18px;
    height: 18px;
}

/* BODY */
.modal-body {
    padding: 20px;
    overflow: visible;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
    font-size: 13px;
}

/* FOOTER */
.modal-footer {
    display: flex;
    justify-content: center;
    padding: 0px 0 22px;
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

.confirm-btn.info {
    background: #3f8047;
}

.confirm-btn.error {
    background: #a62b2b;
}

.confirm-btn.default {
    background: #252525;
}

.confirm-btn:hover {
    opacity: 0.9;
}

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
