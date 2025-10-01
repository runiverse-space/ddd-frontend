<template>
    <h1>{{ props.projectId }}번 째 프로젝트</h1>
    <div>

        <div class="bg-warning">
            <div v-if="project">
                <div>프로젝트명{{ project.projectTitle }}</div>
                <div>프로젝트 내용{{ project.projectContent }}</div>
                <div>생성자: {{ project.userId }}</div>
                <div>프로젝트 멤버:
                    <span v-if="memberList.length > 0">
                        <span v-for="(member, index) in memberList" :key="member.userId">
                            사용자{{ member.userId }}({{ member.uprRole }})
                            <span v-if="index < memberList.length - 1">,</span>
                        </span>
                    </span>
                    <span v-else>멤버 없음</span>

                </div>
            </div>

            <div v-else>
                <p>프로젝트 정보를 불러오는 중...</p>
            </div>

        </div>

        <div class="bg-info mt-2 p-3">
            <h3>일정 목록</h3>

            <div v-for="schedule in scheduleList" :key="schedule.scheduleId">
                <div>일정 제목{{ schedule.scheduleTitle }}</div>
                <div>일정 내용 해당 프로젝트의 일정 내용 projectId를 누르고 들어옴{{ schedule.scheduleContent }}</div>
                <div>일정 멤버 스케쥴 id로 불러온다.{{ schedule.users }}</div>
                <div>일정 시간 start{{ formatDate(schedule.scheduleStartDate) }} </div>
                <div>일정 시간 end{{ formatDate(schedule.scheduleEndDate) }} </div>

                <!-- 일정 참여자가 있다면 -->
                <div v-if="schedule.users && schedule.users.length > 0">
                    <strong>참여자:</strong>
                    <span v-for="(user, index) in schedule.users" :key="user.userId">
                        {{ user.userId }}
                        <span v-if="index < schedule.users.length - 1">, </span>
                    </span>
                </div>

            </div>
        </div>

    </div>
</template>

<script setup>
import projectApi from '@/apis/projectApi';
import { onMounted, ref } from 'vue';

// 라우터에서 넘겨준 projectId 받기
const props = defineProps(['projectId'])
const project = ref(null);
const memberList = ref([]);
const scheduleList = ref([]);

async function loadProjects() {
    try {
        console.log(`프로젝트 ${props.projectId} 상세 조회 시작`);
        const response = await projectApi.getProjectDetail(props.projectId);
        if (response.data.result === 'success') {
            project.value = response.data.data;
            console.log("프로젝트 목록: ", project.value);
        } else {
            console.log("프로젝트를 불러올수가 없습니다");
        }
    } catch (error) {
        console.log('프로젝트 목록 조회 실패');
    }
}

async function loadProjectMembers() {
    console.log("모든 프로젝트의 멤버 목록 조회 시작")

    try {
        console.log(`프로젝트 ${props.projectId}의 멤버 목록 조회 시작`);
        const memberResponse = await projectApi.getProjectMembersList(props.projectId);
        console.log("멤버 목록:", memberResponse.data);
        if (memberResponse.data.result === 'success') {
            memberList.value = memberResponse.data.data || [];
            console.log("멤버 목록:", memberList.value);
        } else {
            console.error('멤버 조회 실패:', memberResponse.data.message);
            memberList.value = [];
        }
    } catch (error) {
        console.error('멤버 목록 조회 실패:', error);
    }


}

async function loadSchedule() {


    try {
        console.log("스케쥴 조회 시작")
        const response = await projectApi.getProjectSchedulesList(props.projectId);
        scheduleList.value = response.data;
        if (response.data.result === 'success') {
            scheduleList.value = response.data.data || [];
            console.log("스케줄 목록:", scheduleList.value);
        } else {
            console.error('스케줄 조회 실패:', response.data.message);
            scheduleList.value = [];
        }
    } catch (error) {
        console.log('스케쥴 목록 조회 실패');
    }

    console.log("스케쥴 로드완료");
}

function formatDate(dataString) {
    if (!dataString) return '';
    const date = new Date(dataString);
    return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}



onMounted(async () => {
    console.log("ProjectHome 마운트");
    console.log("받은 projectId:", props.projectId);

    if (!props.projectId) {
        console.error("❌ projectId가 없습니다!");

        return;
    }

    // 병렬로 데이터 로드 (더 빠름!)
    await Promise.all([
        loadProjects(),
        loadProjectMembers(),
        loadSchedule()
    ]);

    console.log("모든 데이터 로드 완료");
})


</script>