const routes = [
  {
    path: "schedule",
    name: "ScheduleHome",
    component: () => import("@/views/projects/Schedule/ScheduleList.vue"),
    props: true
  },

  {
    path: "schedule/new",
    name: "ScheduleWrite",
    component: () => import("@/views/projects/Schedule/ScheduleWrite.vue"),
    props: true,
  },
];

export default routes;
