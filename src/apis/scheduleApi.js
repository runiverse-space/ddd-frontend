import axios from "axios";
import "./axiosConfig";

function getSchedule(scheduleId) {
  return axios.get("/api/schedule/detail", {params: {scheduleId}});
}

function getProjectScheduleList(projectId){
  return axios.get("/api/project/schedules", {params:{projectId}});
}

function getScheduleMemberList(scheduleId) {
  return axios.get("/api/schedule/users", {params: {scheduleId}});
}

function scheduleCreate(schedule) {
  return axios.post("/api/schedule/create", schedule);
}

function scheduleUpdate(schedule) {
  return axios.put("/api/schedule/update", schedule);
}

function scheduleDelete(scheduleId) {
  return axios.delete("/api/schedule/delete", {params: {scheduleId}});
}

export default{
  getSchedule,
  getProjectScheduleList,
  getScheduleMemberList,
  scheduleCreate,
  scheduleUpdate,
  scheduleDelete
}