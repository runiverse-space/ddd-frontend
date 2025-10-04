import axios from "axios";
import "./axiosConfig";

function knowledgeCommentList(knowledgeId){
  return axios.get("/api/knowledgecomment/list",{params:{knowledgeId}})
}

function knowledgeCommentCreate(data){
  return axios.post("/api/knowledgecomment/create",data);
}

function knowledgeCommentUpdate(data){
  return axios.put("/api/knowledgecomment/update", data);
}



function knowledgeCommentDetail(knowledgeCommentId){
  return axios.get("/api/knowledgecomment/detail", {params:{knowledgeCommentId}});
}

function knowledgeCommentDelete(knowledgeCommentId){
   return axios.delete("/api/knowledgecomment/delete", {params:{knowledgeCommentId}});
}

// function knowledgeCommentCountByKnowledgeId(knowledgeId){
//   return axios.get("/api/knowledgecomment/count", {params:{knowledgeId}});
// }




export default{
 knowledgeCommentCreate,
 knowledgeCommentUpdate,
 knowledgeCommentDetail,
 knowledgeCommentDelete,
 knowledgeCommentList
//  knowledgeCommentCountByKnowledgeId
}