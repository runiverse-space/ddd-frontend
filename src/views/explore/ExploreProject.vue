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
                    <span v-for="tag in project.tags" :key="tag.tagId" class="tag" :style="tagStyle(tag)"
                        @click="filterByTag(tag.tagName)">
                        {{ tag.tagName }}
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
import { getTagColors } from "@/utils/tagColor"; // ✅ 전역 색상 유틸 추가

const projectList = ref([]);
const selectedTag = ref("전체");
const tagList = ref([]);

/* ✅ 태그 스타일 계산 */
function tagStyle(tag) {
    const { bg, color, border } = getTagColors(tag.tagType || "PROJECT"); // 모든 태그는 PROJECT 타입
    return {
        backgroundColor: bg,
        color,
        border: `1px solid ${border}`,
    };
}

onMounted(async () => {
    try {
        // 1️⃣ 전체 PROJECT 태그 목록 가져오기
        const tagRes = await tagApi.getTagsByType("PROJECT");
        const tagsFromApi = tagRes.data.map((tag) => tag.tagName);
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
                project.tags = projectTagRes.data.tags.map((t) => ({
                    tagId: t.tagId,
                    tagName: t.tagName,
                    tagType: t.tagType || "PROJECT", // ✅ 색상 유틸에 필요
                }));
            } else if (Array.isArray(projectTagRes.data)) {
                project.tags = projectTagRes.data.map((t) => ({
                    tagId: t.tagId,
                    tagName: t.tagName,
                    tagType: t.tagType || "PROJECT",
                }));
            } else {
                project.tags = [];
            }
        }

        projectList.value = projects;
    } catch (err) {
        console.error("프로젝트 데이터 불러오기 실패:", err);
    }
});

// ✅ 필터링 로직
const filteredProjects = computed(() => {
    if (!selectedTag.value || selectedTag.value === "전체") {
        return projectList.value;
    }
    return projectList.value.filter((p) =>
        p.tags.some((t) => t.tagName === selectedTag.value)
    );
});

// ✅ 태그 선택 시 필터 변경
function filterByTag(tag) {
    selectedTag.value = tag;
}
</script>

<style scoped>
.project-tab {
    margin-top: 20px;
}

/* 🔹 태그 필터 */
.filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 16px 0 32px;
}

/* 버튼 스타일 */
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

.tag-btn:hover {
    background: rgba(0, 0, 0, 0.05);
}

.tag-btn.active {
    background: #000;
    color: #fff;
}

.filter-tags button {
    font-size: 0.9rem;
}

/* 🔹 카드 그리드 */
.card-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    justify-items: center;
}

.project-card {
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    width: 330px;
    box-sizing: border-box;
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
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

/* 🔹 태그 리스트 */
.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 10px;
}

/* ✅ 태그 스타일 — JS에서 색상 적용 */
.tag {
    border-radius: 6px;
    padding: 6px 14px;
    font-size: 0.7rem;
    font-weight: 500;
    display: inline-block;
    white-space: nowrap;
    line-height: 1.3;
    transition: all 0.2s ease;
}

/* 참여인원 + 버튼 */
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

/* 참여 버튼 */
.join-btn {
    background: #fff;
    border: 1px solid #aaa;
    color: #555;
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: 0.2s;
}

.join-btn:hover {
    border-color: #000;
    background: #f9f9f9;
}

.empty-text {
    text-align: center;
    color: #aaa;
    font-size: 0.95rem;
}
</style>
