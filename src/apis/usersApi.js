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

function usersSearchByEmail(userEmail){
  return axios.get("/api/users/search/email",{params:{userEmail}});
}



function ufAttachDownload(userId) {
  return axios.get("/api/users/attach-download", {params: {userId}, responseType: "blob"});
}

function usersUpdate(users) {
  return axios.put("/api/users/update", users);
}

const usersApi = {
  usersCreate,
  usersLogin,
  usersDetail,
  ufAttachDownload,
  usersUpdate,
  usersSearchByEmail
};

export default usersApi;