import axios from "axios";
import "./axiosConfig";

function getKnowledgeList(projectId){
  return axios.get("/api/knowledge/list",{params:{projectId}})
}

function createKnowledge(formData){
  return axios.post("/api/knowledge/create", formData);
}




export default{
  getKnowledgeList,
  createKnowledge
}