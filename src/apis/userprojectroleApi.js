// src/apis/userprojectroleApi.js
import axios from "axios";
import "./axiosConfig";

function getMemberList(projectId) {
  return axios.get("/api/userprojectrole/memberlist", {
    params: { projectId },
  });
}

function addMember(projectId, userId, uprRole = "MEMBER") {
  return axios.post("/api/userprojectrole/insertmembers", {
    projectId,
    userId,
    uprRole,
  });
}

function removeMember(projectId, userId) {
  return axios.delete("/api/userprojectrole/delete", {
    params: { projectId, userId },
  });
}

function changeAdmin(projectId, userId) {
  return axios.post("/api/userprojectrole/changeadmin", { projectId, userId });
}

function countMembers(projectId) {
  return axios.get("/api/userprojectrole/count", { params: { projectId } });
}

function getAdmin(projectId) {
  return axios.get("/api/userprojectrole/admin", { params: { projectId } });
}

export default {
  getMemberList,
  addMember,
  removeMember,
  changeAdmin,
  countMembers,
  getAdmin,
};
