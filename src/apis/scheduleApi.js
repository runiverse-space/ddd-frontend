import axios from "axios";
import "./axiosConfig";

function getSchedule(scheduleId) {
  return axios.get("/api/schedule/detail");
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

export default{
  getSchedule,
  getProjectScheduleList,
  getScheduleMemberList,
  scheduleCreate
}