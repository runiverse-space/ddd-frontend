import { createStore } from 'vuex';
import axiosConfig from "@/apis/axiosConfig";
import usersApi from '@/apis/usersApi';

const store = createStore({
  state: {
    userId: "",
    userLoginId: "",
    jwt: ""
  },
  getters: {
    getUserId(state, getters, rootState, rootGetters) {
      return state.userId;
    },
    getUserLoginId(state, getters, rootState, rootGetters) {
      return state.userLoginId;
    },
    getJwt(state, getters, rootState, rootGetters) {
      return state.jwt;
    }
  },
  mutations: {
    setUserId(state, payload) {
      state.userId = payload;
    },
    setUserLoginId(state, payload) {
      state.userLoginId = payload;
    },
    setJwt(state, payload) {
      state.jwt = payload;
    }
  },
  actions: {
    saveAuth(context, payload) {
      context.commit("setUserId", Number(payload.userId));
      context.commit("setUserLoginId", payload.userLoginId);
      context.commit("setJwt", payload.jwt);

      localStorage.setItem("userId", payload.userId);
      localStorage.setItem("userLoginId", payload.userLoginId);
      localStorage.setItem("jwt", payload.jwt);

      // 헤더에 Authorization 정보 추가
      axiosConfig.addAuthHeader(payload.jwt);
    },

    removeAuth(context, payload) {
      context.commit("setUserId", "");
      context.commit("setUserLoginId", "");
      context.commit("setJwt", "");

      localStorage.removeItem("userId");
      localStorage.removeItem("userLoginId");
      localStorage.removeItem("jwt");

      // 헤더에 Authorization 정보 제거
      axiosConfig.removeAuthHeader();
    },

    loadAuth(context, payload) {
      // 로컬 스토리지의 값 얻기
      const userId = localStorage.getItem("userId") || "";
      const userLoginId = localStorage.getItem("userLoginId") || "";
      const jwt = localStorage.getItem("jwt") || "";
      
      // 전역 상태값으로 저장
      if (userId !== "") {
        context.commit("setUserId", Number(userId));
      }
      context.commit("setUserLoginId", userLoginId);
      context.commit("setJwt", jwt);

      // Axios의 공통헤더로 Authorization을 주기
      if (jwt !== "") {
        axiosConfig.addAuthHeader(jwt);
      }
    }
  },


  modules: {

  }
})

export default store;