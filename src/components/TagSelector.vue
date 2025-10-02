<!-- src/components/common/TagSelector.vue -->
<template>
  <div>
    <label class="form-label">{{ props.label }}</label>
    <div class="d-flex flex-wrap gap-2">
      <button v-for="tag in availableTags" :key="tag" type="button" class="btn btn-sm" :class="selectedTagList.includes(tag) ? 'btn-primary' : 'btn-outline-primary'" @click="toggleTag(tag)">
        {{ tag.tagName }}
      </button>
    </div>

    <!-- <div class="mt-2">
      <small class="text-muted">
        선택된 태그: <span v-if="selectedTagList.length">{{ selectedTagList.join(', ') }}</span>
        <span v-else>없음</span>
      </small>
    </div> -->
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import tagApi from "@/apis/tagApi";

let availableTags = ref(null);
let selectedTagList = ref([]);
console.log(selectedTagList);
const props = defineProps(["label"]);

// const tags = await tagApi.getTags("USER");
// console.log(tags.data);

async function getUserTags() {
  const response = await tagApi.getTags("USER");
  const userTags = response.data;
  availableTags.value = userTags;
}

getUserTags();

// Emits 정의
// const emit = defineEmits(["handleTagEvent"]);

// 내부 상태
// const selectedTagList = ref([...props.modelValue]);

// 태그 토글 함수
function toggleTag (tag) {
  // console.log(structuredClone(selectedTagList));
  if (selectedTagList.value.includes(tag)) {
    selectedTagList.value = selectedTagList.value.filter((t) => t !== tag);
  } else {
    selectedTagList.value.push(tag);
  }
  // emit("handleTagEvent", tag)
}

// 부모와 양방향 데이터 동기화
watch(selectedTagList, (newTagList, oldTagList) => {
    // emit("update:modelValue", newVal);
    console.log(structuredClone(newTagList));
  }, {deep: true}
);

// watch(
//   () => props.modelValue,
//   (newVal) => {
//     selectedTags.value = [...newVal];
//   }
// );
</script>