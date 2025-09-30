import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";

function addAuthHeader(jwt) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + jwt;
}

function removeAuthHeader() {
  delete axios.defaults.headers.common["Authorization"];
}

export default {
  addAuthHeader,
  removeAuthHeader
};