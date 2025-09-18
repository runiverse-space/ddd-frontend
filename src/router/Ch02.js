

const routes = [
  {
    path: '/Ch02ComponentRouting/Exam01SingleFileComponent',
    name: 'Exam01SingleFileComponent',

    component: () => import(/* webpackChunkName: "Ch02ComponentRouting" */ "@/views/Ch02ComponentRouting/Exam01SingleFileComponent.vue")
  },



];

export default routes;