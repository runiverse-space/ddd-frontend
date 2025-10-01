const routes = [
  {
    path: "KnowledgeList",
    name: "KnowledgeHome",
    component: () => import("@/views/projects/Knowledge/KnowledgeList.vue"),
    props: true,
  },
  
  {
    path: "KnowledgeWrite",
    name: "KnowledgeWrite",
    component: () => import("@/views/projects/Knowledge/KnowledgeWrite.vue"),
    props: true,
  },

  {
    path: "KnowledgUpdate",
    name: "KnowledgeWrite",
    component: () => import("@/views/projects/Knowledge/KnowledgUpdate.vue"),
    props: true,
  },
    {
    path: "KnowledgeDetail",
    name: "KnowledgeWrite",
    component: () => import("@/views/projects/Knowledge/KnowledgeDetail.vue"),
    props: true,
  },
];

export default routes;
