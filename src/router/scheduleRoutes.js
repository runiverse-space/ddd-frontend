const routes = [
  {
    path: "schedule",
    name: "ScheduleHome",
    component: () => import("@/views/projects/Schedule/Schedule.vue"),
    props: true,
  },
];

export default routes;
