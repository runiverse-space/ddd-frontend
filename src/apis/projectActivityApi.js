import axios from "axios";
import "./axiosConfig";

function sendScheduleAssignmentNotification(scheduleId, projectId, senderId, userIds) {
  return axios.post("/api/project-activity/schedule-assignment", userIds, { params: { scheduleId, projectId, senderId } });
}

// 프로젝트 참여 요청
function sendProjectParticipationRequestNotification(request) {
  return axios.post("/api/project-activity/participate", request)
}

// 프로젝트 참여 허가 시 해당 알림 상태 변경
function approveProjectParticipation(notice) {
  return axios.put("/api/project-activity/approve-participation", notice)
}

// 프로젝트 참여 불허 시 해당 알림 상태 변경
function rejectProjectParticipation(notice) {
  return axios.put("/api/project-activity/reject-participation", notice)
}

// 프로젝트 참여 요청에 대한 답변
function respondProjectParticipation(request) {
  return axios.post("/api/project-activity/respond-participation", request)
}

// 프로젝트 초대 알림 발송
function sendInvitation(request) {
  return axios.post("/api/project-activity/invite", request)
}

// 프로젝트 초대 수락
function acceptProjectInvitation(notice) {
  return axios.put("/api/project-activity/accept-invitation", notice);
}

// 프로젝트 초대 거절
function declineProjectInvitation(notice) {
  return axios.put("/api/project-activity/decline-invitation", notice);
}

// 답변 알림 읽음 처리
function readResponse(notice) {
  return axios.put("/api/project-activity/read-response", notice)
}

// 내가 받은 알림 조회
function getAlarms(receiverId) {
  return axios.get("/api/project-activity/list", { params: { receiverId } });
}


export default {
  sendScheduleAssignmentNotification,
  sendProjectParticipationRequestNotification,
  approveProjectParticipation,
  rejectProjectParticipation,
  respondProjectParticipation,
  sendInvitation,
  acceptProjectInvitation,
  declineProjectInvitation,
  readResponse,
  getAlarms
}