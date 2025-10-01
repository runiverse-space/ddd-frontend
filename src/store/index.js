import { createStore } from 'vuex';
import axiosConfig from "@/apis/axiosConfig";
import usersApi from '@/apis/usersApi';

const store = createStore({
  state: {
    user: "",
    jwt: ""
  },
  getters: {
    getUser(state, getters, rootState, rootGetters) {
      return state.user;
    },
    getJwt(state, getters, rootState, rootGetters) {
      return state.jwt;
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setJwt(state, payload) {
      state.jwt = payload;
    }
  },
  actions: {
    saveAuth(context, payload) {
      context.commit("setUser", payload.userId);
      context.commit("setJwt", payload.jwt);

      localStorage.setItem("user", payload.userId);
      localStorage.setItem("jwt", payload.jwt);

      // 헤더에 Authorization 정보 추가
      axiosConfig.addAuthHeader(payload.jwt);
    },

    removeAuth(context, payload) {
      context.commit("setUser", "");
      context.commit("setJwt", "");

      localStorage.removeItem("user");
      localStorage.removeItem("jwt");

      // 헤더에 Authorization 정보 제거
      axiosConfig.removeAuthHeader();
    },

    loadAuth(context, payload) {
      // 로컬 스토리지의 값 얻기
      const user = localStorage.getItem("user") || "";
      const jwt = localStorage.getItem("jwt") || "";
      
      // 전역 상태값으로 저장
      context.commit("setUser", user);
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