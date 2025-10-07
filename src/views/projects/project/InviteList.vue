<template>
    <div class="invite-list">
        <BellIcon class="icon-clock" />
        <h5>초대 목록</h5>
    </div>
</template>

<script setup>
import { BellIcon } from "@heroicons/vue/24/outline"

</script>

<style scoped>
.invite-list-projects {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0 8px;
}

.invite-list {
    display: flex;
    align-items: center;
    gap: 6px;
}

.invite-list h5 {
    margin: 0;
    font-weight: bold;
}

.icon-clock {
    width: 20px;
    height: 20px;
    stroke: black;
    stroke-width: 2;
}
</style>