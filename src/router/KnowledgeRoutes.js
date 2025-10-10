const routes = [
  {
    path: "Knowledge",
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

  {
    path: "KnowledgeUpdate",
    name: "KnowledgeUpdate",
    component: () => import("@/views/projects/Knowledge/KnowledgeUpdate.vue"),
    props: true,
  },
    {
    path: "KnowledgeDetail",
    name: "KnowledgeDetail",
    component: () => import("@/views/projects/Knowledge/KnowledgeDetail.vue"),
    props: true,
  },
];

export default routes;
