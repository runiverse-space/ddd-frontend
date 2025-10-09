<template>
    <div ref="dropdownRef" class="member-selector">
        <!-- ✅ 선택 + 검색 통합 박스 -->
        <div class="member-select-box" :class="{ open: isDropdownOpen }" @click="openDropdown">
            <div class="selected-members">
                <!-- 선택된 멤버 -->
                <template v-if="selectedMembers.length > 0">
                    <div v-for="member in selectedMembers" :key="member.userId" class="member-pill">
                        <img :src="member.profileUrl" alt="profile" class="member-img" />
                        <span class="member-name">{{ member.userName }}</span>
                        <XMarkIcon class="remove-icon" @click.stop="removeMember(member.userId)" />
                    </div>
                </template>

                <!-- 검색 입력 -->
                <input v-model="searchTerm" @input="onSearch" placeholder="이름 또는 이메일로 검색" class="search-input"
                    @focus="openDropdown" :class="{ hiddenPlaceholder: selectedMembers.length > 0 }" />
            </div>
            <ChevronDownIcon class="chevron-icon" :class="{ open: isDropdownOpen }" />
        </div>

        <!-- ✅ 드롭다운 -->
        <div v-if="isDropdownOpen" class="member-dropdown">
            <hr class="divider" />
            <!-- <p class="dropdown-info">검색 결과를 선택해주세요.</p> -->

            <div v-if="availableMembers.length > 0" class="member-list">
                <div v-for="user in availableMembers" :key="user.userId" class="member-option"
                    @click="toggleMember(user)">
                    <img :src="user.profileUrl" alt="profile" class="member-img" />
                    <div class="info">
                        <p class="name">{{ user.userName }}</p>
                        <p class="email">{{ user.userEmail }}</p>
                    </div>
                </div>
            </div>

            <p v-else class="empty-text">검색 결과가 없습니다.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import usersApi from "@/apis/usersApi";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";
import defaultImgSrc from "@/assets/default-profile.png";

const props = defineProps({
    modelValue: {
        type: Array,
        default: () => [],
    },
});
const emits = defineEmits(["update:modelValue"]);

const selectedMembers = ref([]);
const availableMembers = ref([]);
const searchTerm = ref("");
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);
const defaultImg = defaultImgSrc;

/* ✅ 외부 클릭 시 닫기 */
function handleClickOutside(e) {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
        isDropdownOpen.value = false;
    }
}
onMounted(() => window.addEventListener("click", handleClickOutside));
onBeforeUnmount(() => window.removeEventListener("click", handleClickOutside));

/* ✅ 부모의 v-model 반영 */
watch(
    () => props.modelValue,
    (newVal) => {
        if (Array.isArray(newVal)) selectedMembers.value = [...newVal];
    },
    { immediate: true }
);

/* ✅ 드롭다운 열기 */
function openDropdown() {
    isDropdownOpen.value = true;
}

/* ✅ ExploreUser.vue 방식으로 수정된 검색 */
async function onSearch() {
    const keyword = searchTerm.value.trim();

    // 검색어가 비어있으면 리스트 초기화
    if (keyword === "") {
        availableMembers.value = [];
        return;
    }

    try {
        const res = await usersApi.usersSearch(keyword);
        if (res.data.result === "success") {
            const users = res.data.data || [];

            // 검색 결과 없을 경우 빈 배열 유지
            if (users.length === 0) {
                availableMembers.value = [];
                return;
            }

            // 프로필 이미지 로드
            for (const user of users) {
                try {
                    const imgRes = await usersApi.ufAttachDownload(user.userId);
                    const blobUrl = URL.createObjectURL(imgRes.data);
                    user.profileUrl = blobUrl;
                } catch {
                    user.profileUrl = defaultImg;
                }
            }

            availableMembers.value = users;
        }
    } catch (err) {
        console.error("유저 검색 실패:", err);
        availableMembers.value = [];
    }
}

/* ✅ 멤버 선택 */
function toggleMember(user) {
    if (!selectedMembers.value.some((m) => m.userId === user.userId)) {
        selectedMembers.value.push(user);
        emits("update:modelValue", selectedMembers.value);
    }
    searchTerm.value = "";
    availableMembers.value = [];
    isDropdownOpen.value = true;
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

/* ✅ 상단 선택/검색 박스 */
.member-select-box {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px 12px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    cursor: text;
    min-height: 46px;
    transition: all 0.2s ease;
}

.member-select-box.open {
    border-bottom: none;
    border-radius: 8px 8px 0 0;
}

/* ✅ 선택된 멤버들 */
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
    padding: 5px 10px;
}

.member-img {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    object-fit: cover;
}

.member-name {
    font-size: 0.85rem;
    color: #333;
}

/* X 아이콘 */
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

/* ✅ 검색 input */
.search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 0.9rem;
    color: #333;
    min-width: 160px;
    padding: 4px 0;
}

.search-input::placeholder {
    color: #999;
}

.hiddenPlaceholder::placeholder {
    color: transparent !important;
}

/* ✅ 드롭다운 */
.member-dropdown {
    border: 1px solid #ccc;
    border-top: none;
    border-radius: 0 0 8px 8px;
    padding: 10px 12px 14px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: all 0.2s ease;
}

.divider {
    border: none;
    border-top: 1px solid #ddd;
    margin: 6px 0 10px;
}

.dropdown-info {
    color: #888;
    font-size: 0.85rem;
    margin-bottom: 10px;
}

/* ✅ 리스트 */
.member-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 200px;
    overflow-y: auto;
}

.member-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s ease;
}

.member-option:hover {
    background: #f3f3f3;
}

.member-option .info {
    display: flex;
    flex-direction: column;
}

.member-option .name {
    font-weight: 600;
    color: #222;
    margin: 0;
    font-size: 0.85rem;
}

.member-option .email {
    color: #777;
    font-size: 0.75rem;
    margin: 0;
}

.empty-text {
    text-align: center;
    color: #aaa;
    font-size: 0.85rem;
    margin-top: 10px;
}

/* ✅ 화살표 */
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
