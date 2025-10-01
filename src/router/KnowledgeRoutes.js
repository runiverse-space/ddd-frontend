const routes = [
  {
    path: "knowledge",
    name: "KnowledgeHome",
    component: () => import("@/views/projects/Knowledge/Knowledge.vue"),
    props: true,
  },
  {
    path: "KnowledgeWrite",
    name: "KnowledgeWrite",
    component: () => import("@/views/projects/Knowledge/KnowledgeWrite.vue"),
    props: true,
  },
];

export default routes;
