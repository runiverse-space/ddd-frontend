<template>
    <div class="retrospec-detail">
        <!-- 제목 -->
        <h2 class="title">{{ retrospec.retrospecTitle }}</h2>

        <!-- 작성자 -->
        <div class="meta">
            <div class="meta-left">
                <img v-if="retrospec.profileUrl" :src="retrospec.profileUrl" alt="profile" class="profile-img" />
                <span class="by">by</span>
                <span class="author-name">{{ retrospec.userName }}</span>
                <span class="dot">·</span>
                <span class="reg-label">등록일</span>
                <span class="date">{{ formatDate(retrospec.retrospecStartAt) }}</span>
            </div>
        </div>

        <!-- 내용 -->
        <div id="viewer" class="viewer"></div>

        <!-- 하단 네비게이션 -->
        <div class="nav-bar">
            <!-- 이전글 -->
            <div class="nav-item prev" @click="goPrev" :class="{ disabled: !prevRetro }">
                <ArrowLeftCircleIcon class="nav-arrow" />
                <div class="nav-text">
                    <small>이전 글</small>
                    <p>{{ prevRetro ? prevRetro.retrospecTitle : "이전 글이 없습니다" }}</p>
                </div>
            </div>

            <!-- 목록으로 -->
            <button class="nav-list" @click="goList">목록으로</button>

            <!-- 다음글 -->
            <div class="nav-item next" @click="goNext" :class="{ disabled: !nextRetro }">
                <div class="nav-text right">
                    <small>다음 글</small>
                    <p>{{ nextRetro ? nextRetro.retrospecTitle : "다음 글이 없습니다" }}</p>
                </div>
                <ArrowRightCircleIcon class="nav-arrow" />
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import retrospecApi from "@/apis/retrospecApi";
import usersApi from "@/apis/usersApi";
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "@heroicons/vue/24/solid";

const route = useRoute();
const router = useRouter();

const retrospec = ref({});
const retrospecList = ref([]); // 프로젝트 내 회고 목록(날짜 DESC 정렬로 응답)
const prevRetro = ref(null);
const nextRetro = ref(null);

/* 날짜 포맷 */
function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

/* 네비게이션 계산 (목록 정렬: 최신 → 오래된) */
function setNavigation() {
    const currentId = Number(route.params.retroId);
    const list = retrospecList.value; // 이미 DESC 정렬되어 있다고 가정
    const idx = list.findIndex((it) => Number(it.retroId) === currentId);

    // 최신순이므로, 이전글 = idx+1(더 오래된), 다음글 = idx-1(더 최신)
    prevRetro.value = idx < list.length - 1 ? list[idx + 1] : null;
    nextRetro.value = idx > 0 ? list[idx - 1] : null;
}

/* 라우팅 이동 */
function goPrev() {
    if (!prevRetro.value) return;
    router.push({
        name: "RetrospecDetail",
        params: { projectId: route.params.projectId, retroId: prevRetro.value.retroId },
    });
}
function goNext() {
    if (!nextRetro.value) return;
    router.push({
        name: "RetrospecDetail",
        params: { projectId: route.params.projectId, retroId: nextRetro.value.retroId },
    });
}
function goList() {
    router.push({
        name: "RetrospecHome",
        params: { projectId: route.params.projectId },
        query: { tab: "list" }, // ✅ 항상 리스트 탭으로 이동
    });
}

/* 상세 로드 + Viewer 렌더링 */
async function loadRetrospecDetail(retroId) {
    const { data } = await retrospecApi.getRetrospecDetail(retroId);
    retrospec.value = data;

    try {
        const img = await usersApi.ufAttachDownload(data.userId);
        retrospec.value.profileUrl = URL.createObjectURL(img.data);
    } catch {
        retrospec.value.profileUrl = "/images/default-profile.png";
    }

    const userRes = await usersApi.usersDetailById(data.userId);
    retrospec.value.userName = userRes.data?.data?.userName || "알 수 없는 사용자";

    // 기존 뷰어가 있다면 비우고 다시 생성
    const viewerEl = document.getElementById("viewer");
    if (viewerEl) viewerEl.innerHTML = "";
    new Viewer({
        el: viewerEl,
        initialValue: retrospec.value.retrospecContent || "",
    });
}

/* 최초 로드 */
onMounted(async () => {
    const { projectId, retroId } = route.params;

    // 프로젝트 회고 목록(백엔드에서 날짜 DESC 정렬로 내려온다고 가정)
    const listRes = await retrospecApi.getRetrospecList(projectId);
    // API 응답 포맷 차이에 대비
    retrospecList.value = listRes.data?.data || listRes.data || [];

    await loadRetrospecDetail(retroId);
    setNavigation();
});

/* 동일 컴포넌트 내에서 retroId만 바뀌는 경우 대응 */
watch(
    () => route.params.retroId,
    async (newId) => {
        if (!newId) return;
        await loadRetrospecDetail(newId);
        setNavigation();
    }
);
</script>

<style scoped>
.retrospec-detail {
    max-width: 80%;
    margin: 0 auto;
    padding: 10px 10px;
    background: #fff;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* 제목 */
.title {
    font-size: 1.8rem;
    font-weight: 700;
}

/* 작성자 정보 전체 */
.meta {
    display: flex;
    align-items: center;
}

/* 왼쪽 묶음 */
.meta-left {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    color: #555;
}

/* 프로필 */
.profile-img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
}

/* by */
.by {
    color: #777;
    font-size: 0.8rem;
    margin-left: 4px;
}

/* 작성자명 */
.author-name {
    color: #111;
    font-weight: 700;
    font-size: 0.9rem;
}

/* 구분점 (·) */
.dot {
    color: #333;
    margin: 0 2px;
    font-size: 1rem;
}

/* 등록일 */
.reg-label {
    color: #333;
    font-size: 0.8rem;
}

.date {
    color: #999;
    font-size: 0.8rem;
}

/* 내용 */
.viewer {
    font-size: 1.5rem;
    line-height: 1;
    color: #222;
    min-height: unset;
    height: auto;
    border-top: 1px solid #ababab;
    padding-top: 20px;
    margin-top: 10px;
}


/* ✅ 하단 네비게이션 */
.nav-bar {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 60px;
    padding: 0 60px;
    /* 좌우 여백 */
}

/* 좌우 공통 구조 */
.nav-item {
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    transition: opacity 0.2s ease, transform 0.15s ease;
}

.nav-item:hover {
    transform: translateY(-1px);
}

.nav-item.disabled {
    opacity: 0.4;
    pointer-events: none;
}

/* 좌우 구분 */
.nav-item.prev {
    justify-self: start;
}

.nav-item.next {
    justify-self: end;
}

/* 아이콘 (화살표 원형) */
.nav-arrow {
    width: 40px;
    height: 40px;
    margin-top: -20px;
    color: #111;
}

/* 텍스트 그룹 */
.nav-text {
    display: flex;
    flex-direction: column;
    gap: 0px;
}

.nav-text small {
    font-size: 12px;
    color: #888;
    font-weight: 500;
}

.nav-text p {
    font-size: 0.95rem;
    font-weight: 800;
    color: #111;
    max-width: 150px;
    /* ✅ 길이 제한 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /* ✅ ... 처리 */
}

.nav-text.right {
    text-align: right;
}

/* ✅ 중앙 "목록으로" 버튼 (흰 배경 + 검정 테두리) */
.nav-list {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    color: #000;
    border: 1px #ccc;
    border-radius: 8px;
    padding: 10px 22px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 1;
    /* 겹침 방지 */
}

.nav-list:hover {
    border-color: #000;
}
</style>
