<template>
  <div class="section-header">
    <div class="icon-title">
      <ClockIcon class="icon" />
      <span class="small-title">타임라인</span>
    </div>

    <div v-if="milestones.length">
      <div v-for="m in milestones" :key="m.projectMilestoneId" class="milestone-item">
        <p class="milestone-title">{{ m.pmTitle }}</p>
        <p class="milestone-date">{{ formatDate(m.pmStartDate) }} ~ {{ formatDate(m.pmEndDate) }}</p>
      </div>
    </div>

    <p v-else class="empty-text">등록된 타임라인이 없습니다.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ClockIcon } from "@heroicons/vue/24/outline";
import projectMilestoneApi from "@/apis/projectMilestoneApi";

const props = defineProps({
  projectId: { type: Number, required: true },
});

const milestones = ref([]);

/* ✅ 마일스톤 불러오기 */
async function loadMilestones() {
  try {
    const res = await projectMilestoneApi.getProjectMilestones(props.projectId);
    if (res.data.result === "success") {
      milestones.value = res.data.data || [];
    } else {
      console.warn("❌ 타임라인 로드 실패:", res.data.message);
    }
  } catch (err) {
    console.error("❌ 타임라인 불러오기 오류:", err);
  }
}

/* ✅ 날짜 포맷 */
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

onMounted(loadMilestones);
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

.milestone-item {
  margin-bottom: 10px;
  background: #fff;
  border-radius: 8px;
  padding: 10px 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.milestone-title {
  font-weight: 600;
  color: #111;
  font-size: 0.95rem;
}

.milestone-date {
  font-size: 0.8rem;
  color: #777;
}

.empty-text {
  color: #aaa;
  font-size: 0.9rem;
  margin-top: 10px;
}
</style>
