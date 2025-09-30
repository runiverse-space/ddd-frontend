import axios from "axios";
import "./axiosConfig";

function getTags(tagTypes) {
  return axios.get(`/api/tags/${tagTypes}`);
}

const usersApi = {
  getTags
};

export default usersApi;