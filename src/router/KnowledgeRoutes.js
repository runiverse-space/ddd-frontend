const routes = [
  {
    path: "knowledge",
    name: "KnowledgeHome",
    component: () => import("@/views/projects/Knowledge/Knowledge.vue"),
    props: true,
  },
];

export default routes;
