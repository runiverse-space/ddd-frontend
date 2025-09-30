<template>
    <div>
        <h1>프로젝트 목록</h1>
        <table class="project-table">
            <tbody>
                <tr v-for="id in [1, 2, 3]" :key="id">
                    <td>
                        <RouterLink :to="{ name: 'ProjectHome', params: { projectId: id } }">
                            프로젝트 {{ id }}
                        </RouterLink>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.project-table {
    width: 100%;
    text-align: center;
}
</style>