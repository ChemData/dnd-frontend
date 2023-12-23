import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import DayPage from '@/views/DayPage.vue';
import CampingPage from '@/views/CampingPage.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/day', component: DayPage },
  { path: '/camping', component: CampingPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
