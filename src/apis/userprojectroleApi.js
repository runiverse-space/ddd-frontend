import axios from "axios";
import "./axiosConfig";

function getMemberList(projectId){
  return axios.get("/api/userprojectrole/memberlist",{params:{projectId}});
}

export default{
 getMemberList
}