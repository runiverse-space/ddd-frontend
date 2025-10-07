import axios from "axios";
import "./axiosConfig";

const tagApi = {
  // 새 태그 생성
  createTag(tag) {
    return axios.post("/api/tags/create", tag);
  },

  // 태그 타입으로 목록 조회
  getTagsByType(tagType) {
    return axios.get(`/api/tags/${tagType}`);
  },

  // 유저 태그 업데이트 (추가/삭제 통합)
  updateUserTags(request) {
    return axios.post("/api/userTag/update", request);
  },

  // 유저 태그 목록 조회
  getUserTags(userId) {
    return axios.get(`/api/userTag/${userId}`);
  },

  // 프로젝트 태그 업데이트 (추가/삭제 통합)
  updateProjectTags(request) {
    return axios.post("/api/projectTag/update", request);
  },

  // 프로젝트 태그 목록 조회
  getProjectTags(projectId) {
    return axios.get(`/api/projectTag/${projectId}`);
  },

  // 지식창고 태그 업데이트 (추가/삭제 통합)
  updateKnowledgeTags(request) {
    return axios.post("/api/knowledgeTag/update", request);
  },

  // 지식창고 태그 목록 조회
  getKnowledgeTags(knowledgeId) {
    return axios.get(`/api/knowledgeTag/${knowledgeId}`);
  },

  // 태그 검색
  searchTags(keyword) {
    return axios.get(`/api/tags/search`, { params: { keyword } });
  },
};

export default tagApi;
