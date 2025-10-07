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
};

export default tagApi;
