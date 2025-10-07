<template>
  <div ref="dropdownRef" class="tag-selector">
    <!-- 선택 박스 -->
    <div class="tag-select-box" :class="{ open: isDropdownOpen }" @click="toggleDropdown">
      <div class="selected-tags">
        <template v-if="selectedTags.length > 0">
          <span v-for="tag in selectedTags" :key="tag.tagId" class="tag-pill"
            :style="{ backgroundColor: tagColors[tag.tagName] || '#fff' }">
            {{ tag.tagName }}
            <XMarkIcon class="remove-icon" @click.stop="removeTag(tag.tagId)" />
          </span>
        </template>
        <span v-else class="placeholder">태그를 선택하세요</span>
      </div>
      <ChevronDownIcon class="chevron-icon" :class="{ open: isDropdownOpen }" />
    </div>

    <!-- 드롭다운 -->
    <div v-if="isDropdownOpen" class="tag-dropdown">
      <hr class="tag-divider" />
      <p class="tag-limit">최대 3개까지 선택 가능합니다.</p>

      <div class="tag-list">
        <div v-for="tag in availableTags" :key="tag.tagId" class="tag-option"
          :class="{ selected: selectedTags.some((t) => t.tagId === tag.tagId) }" @click="toggleTag(tag)">
          {{ tag.tagName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import tagApi from "@/apis/tagApi";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  tagType: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const emits = defineEmits(["update:modelValue"]);

const availableTags = ref([]);
// const selectedTags = ref([...props.modelValue]);
const selectedTags = ref([]);
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

const tagColors = {
  Backend: "#CFE2FF",
  Frontend: "#E7E9FF",
  Vue: "#E6DAFF",
  React: "#FFE6F2",
  Java: "#FFF1E6",
  Spring: "#E6FFF0",
};

onMounted(async () => {
  try {
    const res = await tagApi.getTagsByType(props.tagType);
    availableTags.value = res.data;
  } catch (err) {
    console.error("태그 불러오기 실패:", err);
  }

  window.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutside);
});

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isDropdownOpen.value = false;
  }
}

// ✅ 외부 modelValue가 변경되면 내부 selectedTags를 동기화
watch(
  () => props.modelValue,
  (newVal) => {
    if (Array.isArray(newVal)) {
      selectedTags.value = [...newVal];
    }
  },
  { immediate: true }
);

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function toggleTag(tag) {
  const exists = selectedTags.value.some((t) => t.tagId === tag.tagId);
  if (exists) {
    selectedTags.value = selectedTags.value.filter((t) => t.tagId !== tag.tagId);
  } else {
    if (selectedTags.value.length >= 3) {
      alert("태그는 최대 3개까지 선택할 수 있습니다.");
      return;
    }
    selectedTags.value.push(tag);
  }
  emits("update:modelValue", selectedTags.value);
}

function removeTag(tagId) {
  selectedTags.value = selectedTags.value.filter((t) => t.tagId !== tagId);
  emits("update:modelValue", selectedTags.value);
}
</script>

<style scoped>
/* 태그 선택 공통 스타일 */
.tag-select-box {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  position: relative;
  min-height: 46px;
  background-color: #fff;
  transition: all 0.2s ease;
}

.tag-select-box.open {
  border-bottom: none;
  border-radius: 8px 8px 0 0;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.placeholder {
  color: #555;
  font-size: 0.95rem;
  font-weight: 400;
  background: transparent;
  border: none;
  box-shadow: none;
}

.tag-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 20px;
  border: 1px solid #ddd;
  font-size: 0.9rem;
  color: #111;
  background-color: #fff;
}

.remove-icon {
  width: 16px;
  height: 16px;
  cursor: pointer;
  color: #555;
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

/* 드롭다운 */
.tag-dropdown {
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 6px 10px 12px;
  background-color: #fff;
}

.tag-divider {
  border: none;
  border-top: 1.5px solid #999;
  width: 100%;
  margin: 4px 0 6px;
}

.tag-limit {
  color: #888;
  font-size: 0.85rem;
  margin: 0 0 6px 3px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-option {
  padding: 8px 14px;
  border: 1px solid #ccc;
  border-radius: 20px;
  cursor: pointer;
  background-color: #f8f8f8;
  font-size: 0.9rem;
  transition: background 0.2s ease;
}

.tag-option:hover {
  background-color: #eee;
}

.tag-option.selected {
  background-color: #000;
  color: #fff;
  border-color: #000;
}
</style>
