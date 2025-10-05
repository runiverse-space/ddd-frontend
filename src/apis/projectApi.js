import axios from "axios";
import "./axiosConfig";

function getProjectList(){
  return axios.get("/api/project/list");
}

function getProjectDetail(projectId){
  return axios.get("/api/project/detail",{params:{projectId}});
}

function getProjectSchedulesList(projectId){
  return axios.get("/api/project/schedules",{params:{projectId}})
}

function getProjectMembersList(projectId){
  return axios.get("/api/project/userprojectroles",{params:{projectId}})
}

//생성하기
function createProject(data){
  return axios.post("/api/project/create",data);
}



export default{
  getProjectList,
  getProjectDetail,
  getProjectSchedulesList,
  getProjectMembersList,
  createProject

}