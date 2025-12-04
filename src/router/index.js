import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import DashboardView from '@/views/DashboardView.vue';
import MapView from '@/views/MapView.vue';
import AsistenciaView from '@/views/AsistenciaView.vue';

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
      redirect: '/'
    },
    {
      path: '/asistencia/miguel_lara',
      name: 'asistencia-miguel-lara',
      component: AsistenciaView
    }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;
