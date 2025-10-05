import axios from "axios";
import "./axiosConfig";

function createProjectMilestone(projectMilestone){
  return axios.post("/api/projectmilestone/create", projectMilestone);
}

export default{
  createProjectMilestone
}