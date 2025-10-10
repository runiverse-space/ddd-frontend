<template>
    <div class="project-home">
        <!-- 좌측 -->
        <div class="left-panel">
            <!-- 프로젝트명 -->
            <div class="section-header">
                <div class="icon-title">
                    <FolderIcon class="icon" />
                    <span class="small-title">프로젝트명</span>
                        <span v-if="isProjectAdmin && !isLoadingAdmin ">
                       <RouterLink 
                            :to="{name:'ProjectUpdate', query:{projectId: props.projectId}}"
                            class="router-link"
                            title="프로젝트 수정"
                        >
                            <PencilSquareIcon class="icon"/>
                        </RouterLink>
                        <XCircleIcon @click="deleteProject(projectId)" class="icon"/>
                    </span>
                    
                </div>
                <h1 class="project-name">
                    {{ projectDetail?.projectTitle || "프로젝트명" }}
                </h1>
                <p class="project-desc">
                    {{ projectDetail?.projectContent || "프로젝트 설명을 불러오는 중입니다." }}
                </p>
            </div>

            <!-- 타임라인 -->
            <HomeMilestone :projectDetail="projectDetail" :milestones="milestones"/>

            <!-- 멤버 -->
            <HomeMember :projectId="projectIdNumber" />
        </div>

        <!-- 세로 분리선 -->
        <div class="divider"></div>

        <!-- 우측 : 일정 -->
        <div class="right-panel">
            <div class="sticky-schedule">
                <HomeSchedule :projectId="projectIdNumber" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { FolderIcon, PencilSquareIcon, XCircleIcon } from "@heroicons/vue/24/outline";
import projectApi from "@/apis/projectApi";
import HomeMilestone from "./project/HomeMilestone.vue";
import HomeSchedule from "./project/HomeSchedule.vue";
import HomeMember from "./project/HomeMember.vue";
import projectMilestoneApi from "@/apis/projectMilestoneApi";
import ProjectUpdate from "./project/ProjectUpdate.vue";
import { useRouter } from "vue-router";
import userprojectroleApi from "@/apis/userprojectroleApi";
import { useStore } from "vuex";

const store = useStore();
const router= useRouter();
const projectAdminUserId=ref(null);
const isLoadingAdmin=ref(false);

/* ✅ props로 들어오는 projectId는 문자열 */
const props = defineProps({
    projectId: { type: String, required: true },
});

/* ✅ 숫자형으로 변환 */
const projectIdNumber = computed(() => parseInt(props.projectId, 10));

const projectDetail = ref({});

/* ✅ 프로젝트 상세 조회 */
async function loadProject() {
    try {
        const res = await projectApi.getProjectDetail(projectIdNumber.value);
        projectDetail.value = res.data.data || res.data;
    } catch (error) {
        console.error("프로젝트 상세 불러오기 실패:", error);
    }
}

const milestones = ref([]);

/* ✅ 마일스톤 불러오기 */
async function loadMilestones() {
  try {
    console.log("🔵 타임라인 로드:", projectDetail.value);
    const res = await projectMilestoneApi.getProjectMilestones(projectDetail.value.projectId);
    if (res.data.result === "success") {
      milestones.value = res.data.data || [];
      console.log("로드된 타임라인:", milestones.value)
    } else {
      console.warn("❌ 타임라인 로드 실패:", res.data.message);
    }
  } catch (err) {
    console.error("❌ 타임라인 불러오기 오류:", err);
  }
}

//그룹장만 보이게 만들기 
const isProjectAdmin = computed(() => {
    return projectAdminUserId.value === store.state.userId;
});


async function loadProjectAdmin(){
    isLoadingAdmin.value=true;

    try {
    const response = await userprojectroleApi.getAdmin(projectIdNumber.value);

    projectAdminUserId.value=response.data.userId;
    console.log("✅ Admin 권한 체크:");
    console.log("  - 프로젝트 Admin userId:", projectAdminUserId.value);
    console.log("  - 현재 사용자 userId:", store.state.userId);
    console.log("  - Admin 여부:", isProjectAdmin.value);
    } catch (error) {
     console.log(error);
    }finally {
        isLoadingAdmin.value = false;
    }
}



async function deleteProject(projectId){
    if(!confirm('정말 삭제하시겠습니까?')) return;

    try {
        await projectApi.deleteProject(projectId);
        router.back();
    } catch (error) {
        console.error('삭제 실패:', error);
    }
}





onMounted(async () => {
    await loadProject();
    await loadMilestones();
    await loadProjectAdmin();
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
}

/* 왼쪽 패널 */
.left-panel {
    display: flex;
    flex-direction: column;
    gap: 40px;
    padding-right: 10px;
    max-width: 100%;
    min-height: 720px;
}

/* 오른쪽 패널 */
.right-panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 0 10px 0 30px;
}

/* 스크롤 시 고정되는 일정 영역 */
.sticky-schedule {
    position: sticky;
    top: 40px;
}

/* 분리선 */
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

.router-link {
    text-decoration: none;
    color: inherit;
}
</style>