<template>
    <div class="user-search">
        <MagnifyingGlassIcon class="search-icon" />
        <input v-model="keyword" placeholder="유저 검색" @input="onInput" @compositionstart="isComposing = true"
            @compositionend="onCompositionEnd" />

        <ul v-if="users.length > 0" class="search-result">
            <li v-for="user in users" :key="user.userId">
                <img v-if="user.ufAttachdata" :src="`data:${user.ufAttachtype};base64,${user.ufAttachdata}`"
                    class="profile-img" />
                {{ user.userName }} ({{ user.userEmail }})
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from "vue";
import usersApi from "@/apis/usersApi";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";

const emit = defineEmits(["update:results"]);

const keyword = ref("");
const users = ref([]);
const isComposing = ref(false);

// ✅ 한글 조합 중엔 검색 막기
const onInput = async () => {
    if (isComposing.value) return;
    await searchUsers();
};

const onCompositionEnd = async () => {
    isComposing.value = false;
    await searchUsers();
};

const searchUsers = async () => {
    const query = keyword.value.trim();
    if (query === "") {
        users.value = [];
        emit("update:results", []); // 부모에도 알림
        return;
    }

    const res = await usersApi.usersSearch(query);
    users.value = res.data.data || [];
    emit("update:results", users.value); // 부모에게 검색 결과 전달
};
</script>

<style scoped>
.user-search {
    display: flex;
    align-items: center;
    background: #fafafa;
    border-radius: 30px;
    border: 1px solid #eee;
    padding: 6px 12px;
    width: 220px;
    position: relative;
}

.search-icon {
    width: 18px;
    height: 18px;
    color: #aaa;
    margin-right: 8px;
}

.user-search input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.9rem;
    flex: 1;
}

/* 검색 결과 드롭다운 */
.search-result {
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    z-index: 10;
    list-style: none;
    padding: 6px 0;
    margin: 0;
}

.search-result li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.15s;
}

.search-result li:hover {
    background: #f5f5f5;
}

.profile-img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
}
</style>
