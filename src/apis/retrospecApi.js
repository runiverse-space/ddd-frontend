import axios from "axios";
import "./axiosConfig";

function getRetrospecList(projectId) {
  return axios.get(`/api/retrospec/project/${projectId}`);
}

function retrospecCreate(data) {
  return axios.post(`/api/retrospec`, data);
}

export default { getRetrospecList, retrospecCreate };
