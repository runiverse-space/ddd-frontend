const routes = [
  {
    path: "retrospec",
    name: "RetrospecHome",
    component: () => import("@/views/projects/Retrospec/Retrospec.vue"),
    props: true,
  },
  {
    path: "retrospec/write",
    name: "RetrospecWrite",
    component: () => import("@/views/projects/Retrospec/RetrospecWrite.vue"),
    props: true,
  },
  {
    path: "retrospec/detail/:retroId",
    name: "RetrospecDetail",
    component: () => import("@/views/projects/Retrospec/RetrospecDetail.vue"),
    props: true,
  },
];

export default routes;
