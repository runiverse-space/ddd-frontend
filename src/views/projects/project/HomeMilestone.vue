<template>
    <div class="section-header">
        <div class="icon-title">
            <ClockIcon class="icon" />
            <span class="small-title">타임라인</span>
        </div>
        이제 이 부분을 해야합니다.
    </div>
</template>

<script setup>
import { ClockIcon } from "@heroicons/vue/24/outline";
defineProps({
    milestones: Array,
});
</script>

<style scoped>
.icon-title {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #999;
    font-size: 0.9rem;
}

.icon {
    width: 18px;
    height: 18px;
}
</style>
