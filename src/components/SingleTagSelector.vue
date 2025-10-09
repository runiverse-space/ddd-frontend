<template>
    <div ref="dropdownRef" class="tag-selector">
        <!-- 선택 박스 -->
        <div class="tag-select-box" :class="{ open: isDropdownOpen }" @click="toggleDropdown">
            <div class="selected-tags">
                <template v-if="selectedTags.length > 0">
                    <span v-for="tag in selectedTags" :key="tag.tagId" class="tag-pill" :style="tagPillStyle(tag)">
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
                    :class="{ selected: selectedTags.some((t) => t.tagId === tag.tagId) }" :style="tagOptionStyle(tag)"
                    @click="toggleTag(tag)">
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
import { getTagColors } from "@/utils/tagColor"; // ✅ 전역 색상 유틸 사용

const props = defineProps({
    tagType: {
        type: String,
        required: true, // USER / PROJECT / KNOWLEDGE
    },
    modelValue: {
        type: Array,
        default: () => [],
    },
});

const emits = defineEmits(["update:modelValue"]);

const availableTags = ref([]);
const selectedTags = ref([]);
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

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

/* ✅ Dual과 동일한 시각적 규칙으로 통합 */
function tagPillStyle(tag) {
    const { bg, color, border } = getTagColors(props.tagType);
    return {
        backgroundColor: bg,
        color,
        border: `2px solid ${border}`,
        borderRadius: "5px",
        padding: "6px 12px",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontWeight: "500",
        fontSize: "0.9rem",
    };
}

function tagOptionStyle(tag) {
    const { bg, color, border } = getTagColors(props.tagType);
    const isSelected = selectedTags.value.some((t) => t.tagId === tag.tagId);
    return {
        backgroundColor: bg,
        color,
        border: isSelected ? `2px solid ${border}` : "none",
        borderRadius: "5px",
        padding: "8px 14px",
        fontWeight: "500",
        fontSize: "0.9rem",
        cursor: "pointer",
    };
}
</script>

<style scoped>
.tag-select-box {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px 12px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
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
    gap: 8px;
    flex: 1;
}

/* X 버튼 (Dual과 동일 스타일) */
.remove-icon {
    width: 16px;
    height: 16px;
    cursor: pointer;
    stroke: #555;
    stroke-width: 2;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.remove-icon:hover {
    stroke: #222;
}

/* 드롭다운 */
.tag-dropdown {
    border: 1px solid #ccc;
    border-top: none;
    border-radius: 0 0 8px 8px;
    padding: 10px 12px 14px;
    background-color: #fff;
    transition: all 0.2s ease;
}

.tag-divider {
    border: none;
    border-top: 1px solid #ddd;
    margin: 6px 0 10px;
}

.tag-limit {
    color: #888;
    font-size: 0.85rem;
    margin-bottom: 10px;
}

.tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
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

.placeholder {
    color: #555;
    font-size: 0.95rem;
    font-weight: 400;
    background: transparent;
    border: none;
    box-shadow: none;
}
</style>
