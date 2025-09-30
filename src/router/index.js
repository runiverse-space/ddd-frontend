import { createRouter, createWebHistory } from "vue-router";

/* 
레이아웃 컴포넌트:
- DefaultLayout: 상단 공통 헤더 + 본문(<RouterView/>) 구조
- ProjectLayout: 좌측 사이드바 + 우측 본문(<RouterView/>) 구조 (프로젝트 상세)
*/
import DefaultLayout from "@/layout/DefaultLayout.vue";
import ProjectLayout from "@/layout/ProjectLayout.vue";

// 상단 메뉴(Home/Explore/Community)에 해당하는 실제 페이지 컴포넌트
import Home from "@/views/Home.vue";
import Explore from "@/views/Explore.vue";
import Community from "@/views/Community.vue";

// 프로젝트 하위 섹션 라우트를 별도 모듈로 분리
import scheduleRoutes from "./scheduleRoutes";
import retrospecRoutes from "./retrospecRoutes";
import knowledgeRoutes from "./knowledgeRoutes";

// 프로젝트 목록/홈 컴포넌트
import ProjectList from "@/views/projects/ProjectList.vue";
import ProjectHome from "@/views/projects/ProjectHome.vue";

import Signup from "@/views/users/Signup";

/*
부모 라우트: 
1) "부모 라우트"의 component 내부에는 반드시 <RouterView />가 있어야 자식(children)이 렌더링 된다
  - DefaultLayout 내부의 <RouterView/> → Home/Explore/Community/Project 렌더링
  - ProjectLayout 내부의 <RouterView/> → ProjectHome/일정/회고/지식창고 렌더링

2) children(자식 라우트)은 부모의 <RouterView> 안에 표시된다 (부모의 <RouterView>에 렌더링될 컴포넌트들이다)
  - children으로 묶으면 공통 레이아웃(헤더/사이드바)을 중복 작성하지 않아도 된다

3) path
  - 부모가 "/"이고 자식이 "explore"면 실제 URL은 "/explore"가 된다
  - 부모가 "project/:projectId"이고 자식이 "schedule"이면 실제 URL은 "/project/123/schedule" 형태가 된다

4) 동적 파라미터(:projectId)를 props로 받기
  - 라우트 정의에서 props: true를 지정하면 $route.params.projectId 값을 해당 컴포넌트의 props로 자동 전달한다
  - 즉, <ProjectLayout projectId="123" /> 처럼 주입되므로 컴포넌트에서는 defineProps(['projectId']) 로 간단히 사용할 수 있다
*/

const routes = [
  {
    // 사이트 최상위 경로
    path: "/",
    // DefaultLayout.vue 안에는 <AppHeader/> 와 <RouterView>가 있다
    component: DefaultLayout,
    // children에 정의된 하위 페이지들이 DefaultLayout의 <RouterView>에 렌더링된다
    children: [
      // 빈 문자열("")은 부모 경로("/")의 기본 자식 경로를 의미한다. 즉, "/" -> Home이 표시된다
      { path: "", name: "Home", component: Home },
      // "explore" 접속 시 탐색 페이지를 렌더링한다
      { path: "explore", name: "Explore", component: Explore },
      // "community" 접속 시 커뮤니티 페이지를 렌더링 한다
      { path: "community", name: "Community", component: Community },
      // "project" 접속 시 프로젝트 목록 페이지를 렌더링 한다
      { path: "project", name: "ProjectList", component: ProjectList },
      {
        // path: "project/:projectId" URL 경로에 :projectId라는 동적 파라미터가 들어간다 (예: /project/1, /project/2)
        path: "project/:projectId",
        // 레이아웃은 ProjectLayout (좌측 사이드바 + 우측 본문)
        component: ProjectLayout,
        // props: true는 URL 파라미터(:projectId)를 자동으로 컴포넌트의 props로 전달한다
        // ProjectLayout.vue 에서 const props = defineProps(['projectId']) 로 사용
        props: true,
        // 이 children 목록은 ProjectLayout의 <RouterView/>에 렌더링된다
        children: [
          {
            // "/project/:projectId"로 들어왔을 때 기본으로 표시될 화면
            path: "",
            name: "ProjectHome",
            component: ProjectHome,
            // ProjectHome.vue 에서도 const props = defineProps(['projectId'])
            props: true,
          },
          // 일정/회고/지식창고 등 프로젝트 하위 섹션 라우트를 모듈에서 불러온다(export)
          ...scheduleRoutes,
          ...retrospecRoutes,
          ...knowledgeRoutes,
        ],
      },
      {path: "/signup", component: Signup}
    ],
    
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
