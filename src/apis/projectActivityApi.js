import axios from "axios";
import "./axiosConfig";

function sendScheduleAssignmentNotification(scheduleId, projectId, senderId, userIds) {
  return axios.post("/api/project-activity/schedule-assignment", userIds, { params: { scheduleId, projectId, senderId } });
}

function sendProjectParticipationRequestNotification(projectId, senderId) {
  console.log(projectId, senderId);
  return axios.post("/api/project-activity/participate", null, { params: { projectId, senderId } })
}

function getAlarms(receiverId) {
  return axios.get("/api/project-activity/list", { params: { receiverId } });
}


export default {
  sendScheduleAssignmentNotification,
  sendProjectParticipationRequestNotification,
  getAlarms
}