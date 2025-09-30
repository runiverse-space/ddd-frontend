import axios from "axios";
import "./axiosConfig";

function getProjectList(){
  return axios.get("/api/project/list");
}

function getProjectDetail(projectId){
  return axios.get("/api/project/detail",{params:{projectId}});
}

function getProjectSchedules(projectId){
  return axios.get("/api/project/schedules",{params:{projectId}})
}

function getProjectMembers(projectId){
  return axios.get("/api/project/userprojectroles",{params:{projectId}})
}


export default{
  getProjectList,
  getProjectDetail,
  getProjectSchedules,
  getProjectMembers

}