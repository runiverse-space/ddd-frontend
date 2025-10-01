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
];

export default routes;
