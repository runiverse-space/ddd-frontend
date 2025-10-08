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

/* 기본 상태: 흰색 배경, 검은 테두리 */
.tag-btn {
    padding: 7px 15px;
    border-radius: 999px;
    border: 1px solid #333;
    background: transparent;
    color: #000;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.7rem !important;
    transition: all 0.25s ease;
}

/* hover 시 살짝 어두워짐 */
.tag-btn:hover {
    background: rgba(0, 0, 0, 0.05);
}

/* 선택된 상태 */
.tag-btn.active {
    background: #000;
    color: #fff;
}

/* 태그 버튼 전체적으로 살짝 작게 */
.filter-tags button {
    font-size: 0.9rem;
}

.card-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    /* ✅ 한 줄에 3개 */
    gap: 24px;
    /* ✅ 카드 사이 간격 */
    justify-items: center;
    /* ✅ 가운데 정렬 */
}

.project-card {
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    width: 330px;
    /* ✅ 가로 크기 고정 */
    box-sizing: border-box;
    /* ✅ padding 포함 */
}

.project-title {
    font-weight: 700;
    font-size: 1.05rem;
    margin-bottom: 10px;
}

.desc {
    color: #666;
    font-size: 0.8rem;
    margin: 5px 0 15px;
    /* ✅ 아래 여백 줄이기 */
    /* min-height: 40px; ✅ 삭제 또는 주석처리 */
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 0;
    margin-bottom: 10px;
}

.tag {
    background: #000;
    color: #fff;
    border-radius: 6px;
    padding: 6px 14px;
    /* ✅ pill 형태 유지 */
    font-size: 0.7rem;
    font-weight: 500;
    display: inline-block;
    white-space: nowrap;

    /* ✅ 세로 중앙 정렬 대체 방식 */
    line-height: 1.3;
    /* 텍스트 높이 균형 */
    vertical-align: middle;
    /* 인접 요소 기준 맞춤 */
}



/* 참여인원 + 버튼 라인 */
.member-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
}

.member-count {
    color: #777;
    font-size: 0.7rem;
    margin-bottom: 0;
}

/* 참여하기 버튼 */
.join-btn {
    background: #fff;
    border: 1px solid #aaa;
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: 0.2s;

    display: inline-block;
    vertical-align: middle;
    /* ✅ 인라인 정렬 시 주변 기준선 맞춤 */
    line-height: 1.3;
    /* ✅ 버튼 내부 텍스트 세로 중앙 보정 */
}

.join-btn:hover {
    border-color: #000;
    background: #f9f9f9;
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
