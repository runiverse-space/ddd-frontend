import { createRouter, createWebHistory } from "vue-router";

import DefaultLayout from "@/layout/DefaultLayout.vue";
import ProjectLayout from "@/layout/ProjectLayout.vue";

import Home from "@/views/Home.vue";
import Explore from "@/views/explore/Explore.vue";
import Community from "@/views/Community.vue";

import ScheduleRoutes from "./ScheduleRoutes";
import KnowledgeRoutes from "./KnowledgeRoutes";
import RetrospecRoutes from "./RetrospecRoutes";

import ProjectList from "@/views/projects/ProjectList.vue";
import ProjectHome from "@/views/projects/ProjectHome.vue";

import Signup from "@/views/users/Signup.vue";
import Login from "@/views/users/Login.vue";
import ProjectManagementLayout from "@/layout/ProjectManagementLayout.vue";
import ProjectCreate from "@/views/projects/project/ProjectCreate.vue";
import Update from "@/views/users/Update.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: "", name: "Home", component: Home, meta: { noPadding: true } },
      { path: "signup", name: "Signup", component: Signup },
      { path: "login", name: "Login", component: Login },
      { path: "update", name: "Update", component: Update },
      { path: "explore", name: "Explore", component: Explore },
      { path: "community", name: "Community", component: Community },
      // 로그인 필요
      {
        path: "project",
        component: ProjectManagementLayout,
        meta: { requiresAuth: true },
        children: [
          {
            path: "",
            name: "ProjectList",
            component: ProjectList,
          },

          {
            path: "create",
            name: "ProjectCreate",
            component: ProjectCreate,
          },
        ],
      },
      {
        path: "project/:projectId",
        component: ProjectLayout,
        // props: true는 URL 파라미터(:projectId)를 자동으로 컴포넌트의 props로 전달한다
        // ProjectLayout.vue 에서 const props = defineProps(['projectId']) 로 사용
        props: true,
        meta: { requiresAuth: true },
        // 이 children 목록은 ProjectLayout의 <router-view/>에 렌더링된다
        children: [
          {
            // "/project/:projectId"로 들어왔을 때 기본으로 표시될 화면
            path: "",
            name: "ProjectHome",
            component: ProjectHome,
            // ProjectHome.vue 에서도 const props = defineProps(['projectId'])
            props: true,
          },
          ...ScheduleRoutes,
          ...RetrospecRoutes,
          ...KnowledgeRoutes,
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// 전역 접근 제한
router.beforeEach((to, from, next) => {
  const jwt = localStorage.getItem("jwt"); // store.state.jwt와 동일
  if (to.meta.requiresAuth && !jwt) {
    alert("로그인이 필요합니다.");
    return next({ name: "Login" });
  }
  next();
});

export default router;
