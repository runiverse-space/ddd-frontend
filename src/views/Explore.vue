<template>
  <div class="user-search">
    <input v-model="keyword" placeholder="이름 또는 이메일 검색" @input="searchUsers" />
    <ul v-if="users.length > 0">
      <li v-for="user in users" :key="user.userId">
        <img v-if="user.ufAttachdata" :src="`data:${user.ufAttachtype};base64,${user.ufAttachdata}`"
          class="profile-img" />
        {{ user.userName }} ({{ user.userEmail }})
      </li>
    </ul>
  </div>
</template>

<script setup>
import usersApi from "@/apis/usersApi";
import { ref } from "vue";

const keyword = ref("");
const users = ref([]);

const searchUsers = async () => {
  if (keyword.value.trim() === "") {
    users.value = [];
    return;
  }
  const res = await usersApi.usersSearch(keyword.value);
  users.value = res.data.data;
};
</script>
