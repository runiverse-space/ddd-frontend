<template>
    <div class="section-header">
        <div class="icon-title">
            <UserPlusIcon class="icon" />
            <span class="small-title">멤버</span>
        </div>

        <div class="member-grid">
            <!-- ✅ 기존 멤버 카드 -->
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
                    <span v-for="tag in member.tags" :key="tag.tagId" class="tag" :style="tagStyle(tag)">
                        {{ tag.tagName }}
                    </span>
                </div>

                <!-- 한마디 -->
                <p class="oneline">
                    {{ member.userIntro || "한마디를 작성해주세요." }}
                </p>
            </div>

            <!-- ✅ 새 멤버 초대 카드 -->
            <div class="member-card add-member" @click="openInviteModal">
                <span>+ 새 멤버 초대</span>
            </div>
        </div>

        <BaseModal :show="showInviteModal" title="새 멤버 초대" @close="showInviteModal = false">
            <!-- ✅ 모달 내부에 컴포넌트 삽입 -->
            <MemberSelector v-model="projectMembers" />

            <!-- ✅ 푸터를 별도 슬롯으로 재정의 가능 -->
            <template #footer>
                <button class="btn btn-dark btn-sm" @click="inviteMembers">
                    초대하기
                </button>
                <button class="btn btn-secondary btn-sm" @click="showInviteModal = false">
                    닫기
                </button>
            </template>
        </BaseModal>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { UserPlusIcon } from "@heroicons/vue/24/outline";
import BaseModal from "@/components/BaseModal.vue";
import MemberSelector from "@/components/MemberSelector.vue";
import userprojectroleApi from "@/apis/userprojectroleApi";
import usersApi from "@/apis/usersApi";
import tagApi from "@/apis/tagApi";
import defaultProfile from "@/assets/default-profile.png";
import { getTagColors } from "@/utils/tagColor";

const props = defineProps({
    projectId: Number,
});

const members = ref([]);
const showInviteModal = ref(false); // ✅ 모달 상태
const projectMembers = ref([]); // ✅ 멤버 선택 결과

function openInviteModal() {
    projectMembers.value = [];
    showInviteModal.value = true;
}

onMounted(() => {
    loadMembers();
});

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
                userData.tags =
                    tagRes.data.tags?.map((t) => ({
                        tagId: t.tagId ?? t.tag_id,
                        tagName: t.tagName ?? t.tag_name,
                        tagType: t.tagType ?? t.tag_type ?? "USER",
                    })) || [];

                return {
                    ...userData,
                    profileUrl,
                };
            })
        );
    } catch (e) {
        console.error("멤버 조회 실패:", e);
    }
}

async function inviteMembers() {
    for (const user of projectMembers.value) {
        await userprojectroleApi.addMember(props.projectId, user.userId);
    }
    alert("새 멤버가 성공적으로 추가되었습니다!");
    showInviteModal.value = false;
    loadMembers(); // 리스트 새로고침
}
/*
async function removeMember(member) {
    if (confirm(`${member.userName} 님을 제거하시겠습니까?`)) {
        await userprojectroleApi.removeMember(props.projectId, member.userId);
        loadMembers();
    }
}
*/

function tagStyle(tag) {
    const { bg, color, border } = getTagColors(tag.tagType);
    return {
        backgroundColor: bg,
        color,
        border: `1px solid ${border}`,
        borderRadius: "3px",
        padding: "6px 12px",
        fontWeight: "500",
        fontSize: "0.65rem",
    };
}
</script>

<style scoped>
.member-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 15px;
    row-gap: 35px;
    margin-top: 20px;
}

.member-card {
    width: 270px;
    min-height: 160px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    padding: 15px;
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
    gap: 15px;
    min-height: 52px;
}

.profile-img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
}

.user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.name {
    font-weight: 700;
    color: #111;
    font-size: 1rem;
    margin: 0;
}

.email {
    font-size: 0.7rem;
    color: #777;
    margin: 3px 0 0 0;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
}

.tag {
    display: inline-block;
    white-space: nowrap;
    transition: all 0.2s ease;
}

.oneline {
    margin-top: 15px;
    color: #555;
    font-size: 0.9rem;
    line-height: 1.4;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.add-member {
    justify-content: center;
    align-items: center;
    display: flex;
    color: #999;
    font-weight: 500;
    cursor: pointer;
    border: 2px dashed #ddd;
    background: #fafafa;
    transition: all 0.2s ease;
}

.add-member:hover {
    border-color: #aaa;
    color: #333;
}
</style>
