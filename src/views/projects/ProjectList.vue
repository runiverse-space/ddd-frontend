<template>
    <div>
        <h1>프로젝트 목록</h1>
        <table class="project-table">
            <tbody>
                <tr v-for="id in [1, 2, 3]" :key="id">
                    <td>
                        <router-link :to="{ name: 'ProjectHome', params: { projectId: id } }">
                            프로젝트 {{ id }}
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
// 라우터에서 넘겨준 projectId 받기
const props = defineProps(['projectId']) 
</script>