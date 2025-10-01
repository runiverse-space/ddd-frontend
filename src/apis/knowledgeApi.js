import axios from "axios";
import "./axiosConfig";

function knowledgeList(projectId){
  return axios.get("/api/knowledge/list",{params:{projectId}})
}

function knowledgeCreate(formData){
  return axios.post("/api/knowledge/create", formData);
}

function knowledgeUpdate(formData){
  return axios.put("/api/knowledge/update", formData);
}

function knowledgeAttachDownload(knowledgeId){
  return axios.get("/api/knowledge/attachdownload", {params:{knowledgeId}});
}

function knowledgeDetail(knowledgeId){
  return axios.get("/api/knowledge/detail", {params:{knowledgeId}});
}

function knowledgeDelete(knowledgeId){
   return axios.delete("/api/knowledge/delete", {params:{knowledgeId}});
}





export default{
  knowledgeList,
  knowledgeCreate,
  knowledgeUpdate,
  knowledgeAttachDownload,
  knowledgeDetail,
  knowledgeDelete
}