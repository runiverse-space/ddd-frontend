const routes = [
  {
    path: "retrospec",
    name: "RetrospecHome",
    component: () => import("@/views/projects/Retrospec/Retrospec.vue"),
    props: true,
  },
];

export default routes;
