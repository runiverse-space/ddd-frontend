<template>
    <div class="section-header">
        <div class="icon-title">
            <UserPlusIcon class="icon" />
            <span class="small-title">멤버</span>
        </div>

        <div class="member-grid">
            <!-- 멤버 카드 -->
            <div v-for="member in members" :key="member.userId" class="member-card">
                <div class="card-top">
                    <img :src="member.profileUrl" class="profile-img" alt="profile" />

                    <div class="user-info">
                        <h4 class="name">{{ member.userName }}</h4>
                        <p class="email">{{ member.userEmail }}</p>
                    </div>
                </div>

                <!-- 태그 -->
                <div class="tags">
                    <span v-for="tag in member.tags" :key="tag" class="tag">
                        {{ tag }}
                    </span>
                </div>

                <!-- 한마디 -->
                <p class="oneline">{{ member.userIntro || "한마디를 작성해주세요." }}</p>
            </div>

            <!-- 새 멤버 초대 -->
            <div class="member-card add-member">
                <span>+ 새 멤버 초대</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { UserPlusIcon } from "@heroicons/vue/24/outline";
defineProps({
    members: Array,
});
</script>

<style scoped>
.member-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 15px;
    /* 카드 가로 간격 */
    row-gap: 35px;
    /* 카드 위·아래 간격 */
    margin-top: 20px;
    /* 타이틀과의 거리 */
}

/* ✅ 카드 전체 */
.member-card {
    width: 270px;
    min-height: 160px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    padding: 15px 15px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    transition: all 0.2s ease;
}

.member-card:hover {
    box-shadow: 0 5px 14px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.card-top {
    display: flex;
    align-items: center;
    /* ✅ 수직 중앙 정렬 */
    gap: 15px;
    min-height: 52px;
    /* 상단 블록 최소 높이 확보 */
}

/* 프로필 이미지 */
.profile-img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    display: block;
    /* ✅ 이미지 하단 기본 여백 제거 */
}

/* 이름 + 이메일 */
.user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 48px;
    /* 이미지 높이와 동일하게 맞춤 */
    margin-top: 0;
    /* 혹시 남아있는 마진 제거 */
}

.name {
    font-weight: 700;
    color: #111;
    font-size: 1rem;
    line-height: 1.1;
    /* 줄간격 살짝 줄여 안정감 */
    margin: 0;
}

.email {
    font-size: 0.7rem;
    color: #777;
    margin: 3px 0 0 0;
    /* 이름과의 간격만 살짝 */
    line-height: 1.1;
}

/* ✅ 태그 영역 */
.tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 10px;
}

.tag {
    background: #000;
    color: #fff;
    border-radius: 5px;
    padding: 6px 12px;
    font-size: 0.65rem;
    font-weight: 500;
    display: inline-block;
    white-space: nowrap;
}

/* ✅ 한마디 영역 */
.oneline {
    margin-top: 15px;
    margin-bottom: 0;
    color: #555;
    font-size: 0.9rem;
    line-height: 1.4;
    display: block;
    /* ✅ 추가 */
    overflow: hidden;
    /* ✅ 추가 */
    white-space: nowrap;
    /* 한 줄만 표시 */
    text-overflow: ellipsis;
    /* 넘치면 … 처리 */
}

/* ✅ 추가 버튼 카드 */
.add-member {
    justify-content: center;
    align-items: center;
    display: flex;
    color: #999;
    font-weight: 500;
    cursor: pointer;
    border: 2px solid #eee;
}
</style>
