import axios from "axios";
import "./axiosConfig";

function usersCreate(users) {
  return axios.post("/api/users/create", users);
}

function usersLogin(loginForm) {
  return axios.post("/api/users/login", loginForm);
}

function usersDetail(userId) {
  return axios.get("/api/users/detail/id", {
    params: {userId},
  });
}

function ufAttachDownload(userId) {
  return axios.get("/api/users/attach-download", {params: {userId}, responseType: "blob"});
}

const usersApi = {
  usersCreate,
  usersLogin,
  usersDetail,
  ufAttachDownload
};

export default usersApi;