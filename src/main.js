import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import store from './store'

// 페이지를 처음 열 때 로그인 정보 불러옴
store.dispatch("loadAuth");

createApp(App).use(store).use(router).mount('#app')
