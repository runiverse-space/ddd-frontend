import axios from "axios";
import "./axiosConfig";

function getProjectList(){
  return axios.get("/api/project/list");
}


export default{
  getProjectList
}