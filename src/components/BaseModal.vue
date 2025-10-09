<template>
    <Teleport to="body">
        <div v-if="show" class="modal-overlay" @click.self="close">
            <div class="base-modal">
                <!-- 닫기 버튼 -->
                <button class="close-btn" @click="close">
                    <XMarkIcon class="icon" />
                </button>

                <h3 class="modal-title">{{ title }}</h3>

                <!-- ✅ message 대신 slot -->
                <div class="modal-body">
                    <slot>
                        <p>내용이 없습니다.</p>
                    </slot>
                </div>

                <div class="modal-footer">
                    <slot name="footer">
                        <button class="btn btn-dark btn-sm" @click="close">확인</button>
                    </slot>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { XMarkIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
    show: Boolean,
    title: { type: String, default: "모달 제목" },
});
const emits = defineEmits(["close"]);

function close() {
    emits("close");
}
</script>

<style>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20000;
}

.base-modal {
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 28px 28px 24px 28px;
    width: 500px;
    max-width: 90%;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.15);
    animation: fadeIn 0.25s ease;
    z-index: 20001;
    position: relative;
}

.close-btn {
    position: absolute;
    top: 14px;
    right: 16px;
    background: none;
    border: none;
    cursor: pointer;
    color: #777;
    padding: 4px;
    transition: color 0.2s ease;
}

.close-btn:hover {
    color: #222;
}

.modal-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 12px 0;
}

.modal-body {
    margin-bottom: 20px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
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
