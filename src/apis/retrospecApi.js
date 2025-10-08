import axios from "axios";
import "./axiosConfig";

// 회고 생성
function retrospecCreate(requestData) {
  return axios.post("/api/retrospec", requestData);
}

// 프로젝트별 회고 목록 조회
function getRetrospecList(projectId) {
  return axios.get(`/api/retrospec/project/${projectId}`);
}

// ✅ 회고 상세 조회 (디테일)
function getRetrospecDetail(retroId) {
  return axios.get(`/api/retrospec/${retroId}`);
}

// 회고 수정
function retrospecUpdate(retroId, requestData) {
  return axios.put(`/api/retrospec/${retroId}`, requestData);
}

// 회고 삭제
function retrospecDelete(retroId, projectId, userId) {
  return axios.delete(`/api/retrospec/${retroId}`, {
    params: { projectId, userId },
  });
}

export default {
  retrospecCreate,
  getRetrospecList,
  getRetrospecDetail,
  retrospecUpdate,
  retrospecDelete,
};
