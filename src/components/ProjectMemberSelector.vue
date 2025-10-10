<template>
  <div ref="dropdownRef" class="member-selector">
    <!-- 선택 박스 -->
    <div class="member-select-box" :class="{ open: isDropdownOpen }" @click="toggleDropdown">
      <div class="selected-members">
        <div v-for="member in selectedMembers" :key="member.userId" class="member-pill">
          <img :src="member.profileUrl || defaultImg" class="member-img" />
          <span class="member-name">{{ member.userName }}</span>
          <XMarkIcon class="remove-icon" @click.stop="removeMember(member.userId)" />
        </div>
      </div>
      <ChevronDownIcon class="chevron-icon" :class="{ open: isDropdownOpen }" />
    </div>

    <!-- 드롭다운 목록 -->
    <div v-show="isDropdownOpen" class="member-dropdown">
      <div v-if="availableMembers.length" class="member-list">
        <div v-for="user in availableMembers" :key="user.userId" class="member-option" @click="toggleMember(user)">
          <img :src="user.profileUrl || defaultImg" class="member-img" />
          <div class="info">
            <p class="name">{{ user.userName }}</p>
            <p class="email">{{ user.userEmail }}</p>
          </div>
        </div>
      </div>
      <p v-else class="empty-text">추가 가능한 멤버가 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";
import defaultImgSrc from "@/assets/default-profile.png";

const props = defineProps({
  modelValue: { type: Array, default: () => [] }, // 선택된 멤버
  projectMembers: { type: Array, default: () => [] }, // 프로젝트 전체 멤버
});
const emits = defineEmits(["update:modelValue"]);

const selectedMembers = ref([]);
const availableMembers = ref([]);
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);
const defaultImg = defaultImgSrc;

/* ✅ 외부 클릭 시 닫기 */
function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isDropdownOpen.value = false;
  }
}

onMounted(() => {
  availableMembers.value = [...props.projectMembers];
  window.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => window.removeEventListener("click", handleClickOutside));

/* ✅ props 감시 */
watch(
  () => props.modelValue,
  (val) => (selectedMembers.value = [...val]),
  { immediate: true }
);
watch(
  () => props.projectMembers,
  (val) => (availableMembers.value = [...val]),
  { immediate: true }
);

/* ✅ 드롭다운 토글 */
function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

/* ✅ 멤버 선택 */
function toggleMember(user) {
  if (selectedMembers.value.some((m) => m.userId === user.userId)) return;
  selectedMembers.value.push(user);
  emits("update:modelValue", selectedMembers.value);
}

/* ✅ 멤버 제거 */
function removeMember(userId) {
  selectedMembers.value = selectedMembers.value.filter((m) => m.userId !== userId);
  emits("update:modelValue", selectedMembers.value);
}
</script>

<style scoped>
.member-selector {
  position: relative;
  width: 100%;
}

/* 선택 박스 */
.member-select-box {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  cursor: pointer;
  min-height: 46px;
  transition: all 0.2s ease;
}
.member-select-box.open {
  border-bottom: none;
  border-radius: 8px 8px 0 0;
}

/* 선택된 멤버 */
.selected-members {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  flex: 1;
}
.member-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f9f9f9;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 3px 6px;
}
.member-img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}
.member-name {
  font-size: 0.75rem;
  color: #333;
  margin-top: 2px;
}
.remove-icon {
  width: 14px;
  height: 14px;
  cursor: pointer;
  stroke: #666;
  transition: 0.2s;
}
.remove-icon:hover {
  stroke: #000;
}

/* 드롭다운 */
.member-dropdown {
  border-radius: 0 0 8px 8px;
  overflow: hidden; /* ✅ 모서리 잘림 방지 */
  border: 1px solid #ccc;
  border-top: 1px solid #ddd;
}

.member-list {
  max-height: 200px;
  overflow-y: auto; /* ✅ 스크롤은 이쪽으로 이동 */
  scrollbar-gutter: stable; /* ✅ 오른쪽 모서리 확보 */
}
.member-option {
  display: flex;
  align-items: center; /* ✅ 이미지와 텍스트 세로 중앙 정렬 */
  gap: 10px;
  padding: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.member-option:hover {
  background: #f3f3f3;
}
.info {
  display: flex;
  flex-direction: column;
  justify-content: center; /* ✅ 이름·이메일 블록을 이미지의 수직 중앙으로 맞춤 */
  line-height: 1.3;
  margin-top: 15px;
}
.name {
  font-weight: 600;
  color: #222;
  font-size: 0.85rem;
  margin: 0; /* ✅ 위쪽 여백 제거 */
}
.email {
  color: #777;
  font-size: 0.7rem;
}
.empty-text {
  text-align: center;
  color: #aaa;
  font-size: 0.85rem;
  margin-top: 18px;
}
.chevron-icon {
  width: 20px;
  height: 20px;
  color: #666;
  transition: transform 0.25s ease;
}
.chevron-icon.open {
  transform: rotate(180deg);
}
</style>
