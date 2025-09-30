import axios from "axios";
import "./axiosConfig";

function getKnowledgeList(projectId){
  return axios.get("/api/knowledge/list",{params:{projectId:projectId}})
}




export default{
  getKnowledgeList
}