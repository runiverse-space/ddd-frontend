<template>
    <div class="project-tab">
        <!-- 🔹 태그 필터 -->
        <div class="filter-tags">
            <button v-for="tag in tagList" :key="tag" :class="{ active: selectedTag === tag }" class="tag-btn"
                @click="filterByTag(tag)">
                {{ tag }}
            </button>
        </div>

        <!-- 🔹 프로젝트 카드 목록 -->
        <div v-if="filteredProjects.length" class="card-grid">
            <div v-for="project in filteredProjects" :key="project.projectId" class="project-card">
                <h4 class="project-title">{{ project.projectTitle }}</h4>
                <p class="desc">{{ project.projectContent }}</p>

                <div class="tags">
                    <span v-for="tag in project.tags" :key="tag" class="tag" @click="filterByTag(tag)">
                        {{ tag }}
                    </span>
                </div>

                <div class="member-row">
                    <p class="member-count">참여인원 {{ project.memberCount }} / 6</p>
                    <button class="join-btn">참여하기</button>
                </div>
            </div>
        </div>

        <p v-else class="empty-text">해당 태그의 프로젝트가 없습니다.</p>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import projectApi from "@/apis/projectApi";
import userProjectRoleApi from "@/apis/userprojectroleApi";
import tagApi from "@/apis/tagApi";

const projectList = ref([]);
const selectedTag = ref("전체"); // ✅ 기본값: 전체
const tagList = ref([]); // ✅ 태그 목록

onMounted(async () => {
    // 1️⃣ 전체 PROJECT 태그 목록 가져오기
    const tagRes = await tagApi.getTagsByType("PROJECT");
    const tagsFromApi = tagRes.data.map((tag) => tag.tagName);

    // ✅ “전체” 버튼 추가
    tagList.value = ["전체", ...tagsFromApi];

    // 2️⃣ 프로젝트 목록 가져오기
    const res = await projectApi.getProjectList();
    const projects = res.data;

    // 3️⃣ 각 프로젝트별 멤버 수 & 태그 병합
    for (const project of projects) {
        const memberRes = await userProjectRoleApi.getMemberList(project.projectId);
        project.memberCount = memberRes.data.length || 0;

        const projectTagRes = await tagApi.getProjectTags(project.projectId);
        if (projectTagRes.data && projectTagRes.data.tags) {
            project.tags = projectTagRes.data.tags.map((t) => t.tagName);
        } else if (Array.isArray(projectTagRes.data)) {
            project.tags = projectTagRes.data.map((t) => t.tagName);
        } else {
            project.tags = [];
        }
    }

    projectList.value = projects;
});

// ✅ 필터링 로직
const filteredProjects = computed(() => {
    if (!selectedTag.value || selectedTag.value === "전체") {
        return projectList.value; // 전체 보기
    }
    return projectList.value.filter((p) => p.tags.includes(selectedTag.value));
});

// ✅ 태그 선택 시 필터 변경
const filterByTag = (tag) => {
    selectedTag.value = tag;
};
</script>

<style scoped>
.project-tab {
    margin-top: 20px;
}

.filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 16px 0 32px;
}

.tag-btn {
    padding: 6px 14px;
    border-radius: 20px;
    border: none;
    background: #f2f2f2;
    cursor: pointer;
    transition: 0.2s;
}

.tag-btn.active {
    background: #000;
    color: #fff;
}

.tag-btn:hover {
    background: #e5e5e5;
}

.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
}

.project-card {
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.project-title {
    font-weight: 700;
    font-size: 1.05rem;
    margin-bottom: 8px;
}

.desc {
    color: #666;
    font-size: 0.9rem;
    margin: 6px 0;
    min-height: 40px;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
}

.tag {
    background: #f1f1f1;
    border-radius: 10px;
    padding: 2px 10px;
    font-size: 0.8rem;
    cursor: pointer;
}

.member-row {
    display: flex;
    justify-content: space-between;
    /* 왼쪽/오른쪽 배치 */
    align-items: center;
    margin-top: 10px;
}

.member-count {
    color: #777;
    font-size: 0.85rem;
    margin-bottom: 10px;
}

.join-btn {
    background: #fff;
    border: 1px solid #aaa;
    border-radius: 10px;
    padding: 6px 12px;
    cursor: pointer;
    transition: 0.2s;
}

.join-btn:hover {
    border-color: #000;
}

.empty-text {
    text-align: center;
    color: #aaa;
    font-size: 0.95rem;
}
</style>
