import axios from "axios";
import "./axiosConfig";

function usersCreate(signupData) {
  return axios.post("/api/users/create", signupData);
}

function usersLogin(loginData) {
  return axios.post("/api/users/login", loginData);
}

function usersDetailById(userId) {
  return axios.get("/api/users/detail/id", {
    params: { userId },
  });
}

function usersDetailByLoginId(userLoginId) {
  return axios.get("/api/users/detail/loginId", {
    params: { userLoginId },
  });
}

function usersDetailByEmail(userEmail) {
  return axios.get("/api/users/detail/email", {
    params: { userEmail },
  });
}

function ufAttachDownload(userId) {
  return axios.get("/api/users/attach-download", {
    params: { userId },
    responseType: "blob", // 이미지 바이너리 받기
  });
}

function usersUpdate(formData) {
  return axios.put("/api/users/update", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

function usersDelete(userId) {
  return axios.delete("/api/users/delete", {
    params: { userId },
  });
}

function usersSearch(keyword) {
  return axios.get("/api/users/search", {
    params: { keyword },
  });
}

export default {
  usersCreate,
  usersLogin,
  usersDetailById,
  usersDetailByLoginId,
  usersDetailByEmail,
  ufAttachDownload,
  usersUpdate,
  usersDelete,
  usersSearch,
};
