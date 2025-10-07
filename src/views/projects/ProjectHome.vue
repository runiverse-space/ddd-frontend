<template>
    <div class="project-home">
        <!-- 좌측 -->
        <div class="left-panel">
            <!-- 프로젝트명 -->
            <div class="section-header">
                <div class="icon-title">
                    <FolderIcon class="icon" />
                    <span class="small-title">프로젝트명</span>
                </div>
                <h1 class="project-name">{{ projectDetail?.projectTitle || "프로젝트명" }}</h1>
                <p class="project-desc">
                    {{ projectDetail?.projectContent || "프로젝트 설명을 불러오는 중입니다." }}
                </p>
            </div>

            <!-- 타임라인 -->
            <HomeMilestone :milestones="milestones" />

            <!-- 멤버 -->
            <HomeMember :members="members" />
        </div>

        <!-- ✅ 세로 분리선 -->
        <div class="divider"></div>

        <!-- 우측 : 일정 -->
        <div class="right-panel">
            <HomeSchedule :recentSchedules="recentSchedules" :todayLabel="todayLabel" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { FolderIcon } from "@heroicons/vue/24/outline";
import projectApi from "@/apis/projectApi";
import userprojectroleApi from "@/apis/userprojectroleApi";
import usersApi from "@/apis/usersApi";
import tagApi from "@/apis/tagApi";
import defaultProfile from "@/assets/default-profile.png";
import { useStore } from "vuex";

// ✅ 분리된 컴포넌트
import HomeMilestone from "./project/HomeMilestone.vue";
import HomeSchedule from "./project/HomeSchedule.vue";
import HomeMember from "./project/HomeMember.vue";

const props = defineProps({
    projectId: { type: Number, required: true },
});

const store = useStore();
const projectDetail = ref({});
const members = ref([]);
const recentSchedules = ref([]);
const milestones = ref([]);

// ✅ 프로젝트 상세
async function loadProject() {
    try {
        const res = await projectApi.getProjectDetail(props.projectId);
        projectDetail.value = res.data.data || res.data;
    } catch (error) {
        console.error("❌ 프로젝트 상세 불러오기 실패:", error);
    }
}

// ✅ 멤버
async function loadMembers() {
    try {
        const res = await userprojectroleApi.getMemberList(props.projectId);
        const data = res.data.data || res.data;

        members.value = await Promise.all(
            data.map(async (m) => {
                const userRes = await usersApi.usersDetailById(m.userId);
                const userData = userRes.data.data || userRes.data;

                let profileUrl = defaultProfile;
                try {
                    const imgRes = await usersApi.ufAttachDownload(m.userId);
                    const blob = new Blob([imgRes.data], {
                        type: imgRes.headers["content-type"],
                    });
                    profileUrl = URL.createObjectURL(blob);
                } catch (error) {
                    console.log(error);
                }

                const tagRes = await tagApi.getUserTags(m.userId);
                const tags = tagRes.data.tags?.map((t) => t.tagName) || [];

                return {
                    userId: userData.userId,
                    userName: userData.userName,
                    userEmail: userData.userEmail,
                    userIntro: userData.userIntro,
                    profileUrl,
                    tags,
                };
            })
        );
    } catch (e) {
        console.error("❌ 멤버 조회 실패:", e);
    }
}

// ✅ 최근 일정 3개
async function loadSchedules() {
    try {
        const res = await projectApi.getProjectSchedulesList(props.projectId);
        const list = res.data.data || res.data;
        recentSchedules.value = Array.isArray(list)
            ? list.slice(0, 3).map((s, i) => ({
                title: s.scheduleTitle || "일정 제목",
                time: `${s.scheduleStart || "09:00"} - ${s.scheduleEnd || "09:00"}`,
                statusText: i === 1 ? "진행 중" : "시작되지 않음",
                statusClass: i === 1 ? "active" : "inactive",
                members: [defaultProfile, defaultProfile],
            }))
            : [];
    } catch (error) {
        console.error("❌ 일정 조회 실패:", error);
    }
}

// ✅ 타임라인 (임시)
milestones.value = [
    { label: "Jan 20", name: "프로젝트 시작" },
    { label: "Feb 14", name: "해야할 것-01" },
    { label: "Mar 8", name: "해야할 것-02" },
    { label: "Apr 30", name: "해야할 것-03" },
    { label: "Sep 16", name: "프로젝트 종료" },
];

// ✅ 날짜 표시
const todayLabel = computed(() => {
    const now = new Date();
    const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
    const month = now.toLocaleString("en-US", { month: "short" });
    return `${weekday}, ${now.getDate()} ${month}`;
});

onMounted(() => {
    loadProject();
    loadMembers();
    loadSchedules();
});
</script>

<style scoped>
.project-home {
    display: grid;
    grid-template-columns: 7.5fr 0.5px 2.5fr;
    gap: 0;
    padding: 10px 10px;
    background-color: #fff;
    min-height: 100vh;
    align-items: stretch;
    /* ✅ 왼쪽 높이에 맞춰 오른쪽 늘림 */
}

/* ✅ 왼쪽 패널 */
.left-panel {
    display: flex;
    flex-direction: column;
    gap: 40px;
    padding-right: 10px;
    max-width: 100%;
    min-height: 720px;
    /* ✅ 최소 높이 지정 (멤버 없을 때도 일정이 아래쪽으로 유지) */
}

/* ✅ 오른쪽 패널 */
.right-panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 0 10px 0 30px;
}

/* ✅ 분리선 */
.divider {
    background-color: #d5d5d5;
    width: 1px;
    height: 100%;
}

.project-name {
    font-size: 1.8rem;
    font-weight: 700;
    margin-top: 6px;
    color: #111;
}

.project-desc {
    color: #555;
    font-size: 0.95rem;
    line-height: 1.5;
    margin-top: 4px;
}
</style>

<style>
/* 공통 아이콘 타이틀 스타일 - 모든 하위 컴포넌트에서 공유 가능 */
.icon-title {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #999;
    font-size: 0.9rem;
    margin-bottom: 10px;
}

.icon {
    width: 18px;
    height: 18px;
    stroke-width: 2;
}
</style>