import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import DashboardView from '@/views/DashboardView.vue';
import MapView from '@/views/MapView.vue';
import ProfessorView from '@/views/ProfessorView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/mapa',
      name: 'map',
      component: MapView
    },
    {
      path: '/profesores/:id',
      name: 'professor',
      component: ProfessorView,
      props: true
    }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;
