import axios from "axios";
import "./axiosConfig";

function createProjectMilestone(projectMilestone){
  return axios.post("/api/projectmilestone/create", projectMilestone);
}

function getProjectMilestones(projectId){
  return axios.get("/api/projectmilestone/list", { params: { projectId } });
}

export default{
  createProjectMilestone,
  getProjectMilestones
}