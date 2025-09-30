<!-- src/components/common/TagSelector.vue -->
<template>
  <div>
    <label class="form-label">{{ props.label }}</label>
    <div class="d-flex flex-wrap gap-2">
      <button v-for="tag in availableTags" :key="tag" type="button" class="btn btn-sm" :class="selectedTags.includes(tag) ? 'btn-primary' : 'btn-outline-primary'" @click="toggleTag(tag)">
        {{ tag.tagName }}
      </button>
    </div>

    <!-- <div class="mt-2">
      <small class="text-muted">
        선택된 태그: <span v-if="selectedTags.length">{{ selectedTags.join(', ') }}</span>
        <span v-else>없음</span>
      </small>
    </div> -->
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import tagApi from "@/apis/tagApi";

let availableTags = ref(null);
let selectedTags = ref([]);
console.log(selectedTags);
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
// const selectedTags = ref([...props.modelValue]);

// 태그 토글 함수
function toggleTag (tag) {
  // console.log(structuredClone(selectedTags));
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((t) => t !== tag);
  } else {
    selectedTags.value.push(tag);
  }
  // emit("handleTagEvent", tag)
}

// 부모와 양방향 데이터 동기화
watch(selectedTags, (newLength, oldLength) => {
    // emit("update:modelValue", newVal);
    console.log(structuredClone(newLength));
  }, {deep: true}
);

// watch(
//   () => props.modelValue,
//   (newVal) => {
//     selectedTags.value = [...newVal];
//   }
// );
</script>
