import axios from "axios";
import "./axiosConfig";

function getMemberList(projectId){
  return axios.get("/api/userprojectrole/memberlist",{params:{projectId}});
}

function getProjectAdmin(projectId){
  return axios.get("/api/userprojectrole/admin",{params:{projectId}});
}


export default{
 getMemberList,
 getProjectAdmin
}