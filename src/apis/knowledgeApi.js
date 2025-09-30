import axios from "axios";

function getKnowledgeList(projectId){
  return axios.get("/api/knowledge/list",{params:{projectId:projectId}})
}




export default{
  getKnowledgeList
}