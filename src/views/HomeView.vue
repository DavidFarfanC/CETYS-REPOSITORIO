<template>
  <section class="flex flex-col gap-12">
    <div class="grid items-center gap-12 md:grid-cols-[1.1fr,0.9fr]">
      <div class="space-y-8">
        <p class="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-gray-500 shadow-sm backdrop-blur-sm dark:bg-gray-900/40 dark:text-gray-300">
          By Kamila García - Alicia Gonzalez 
        </p>
        <h1 class="text-4xl font-semibold leading-[1.15] text-cetys-black sm:text-5xl lg:text-6xl dark:text-white">
          Teacher Tracker CETYS
        </h1>
        <p class="max-w-xl text-lg text-gray-600 dark:text-gray-300">
          Descubre en tiempo real dónde se encuentran tus profesores. Animaciones suaves y datos sincronizados para ayudarte
          a optimizar tu día en el campus.
        </p>
        <div class="flex flex-wrap items-center gap-4">
          <RouterLink
            to="/dashboard"
            class="inline-flex min-w-[200px] items-center justify-center gap-3 rounded-full bg-cetys-yellow px-8 py-3 text-base font-medium text-cetys-black shadow-lg shadow-yellow-500/40 transition hover:scale-105 hover:shadow-2xl"
          >
            Ver ubicación de profesores
            <span aria-hidden="true" class="text-xl">→</span>
          </RouterLink>
          <RouterLink
            to="/mapa"
            class="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-6 py-3 text-base font-medium text-gray-700 transition hover:border-cetys-yellow/60 hover:text-cetys-black dark:border-white/20 dark:bg-gray-800/60 dark:text-white"
          >
            Recorrido por el campus
          </RouterLink>
        </div>
      </div>
      <div class="relative">
        <div class="floating-card absolute -inset-8 -z-10 rounded-[36px] border border-white/20 bg-white/60 shadow-2xl shadow-black/10 backdrop-blur-xl dark:border-white/5 dark:bg-gray-800/40" />
        <div class="rounded-3xl border border-white/20 bg-white/80 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl dark:border-white/5 dark:bg-gray-800/60">
          <h2 class="text-lg font-semibold text-cetys-black dark:text-white">Profesores destacados ahora</h2>
          <div v-if="!spotlight.length" class="mt-6 rounded-2xl border border-black/5 bg-gray-50/80 p-6 text-sm text-gray-500 dark:border-white/10 dark:bg-gray-900/60 dark:text-gray-300">
            Cargando profesores…
          </div>
          <ul v-else class="mt-6 space-y-4">
            <li
              v-for="prof in spotlight"
              :key="prof.id"
              class="flex items-center justify-between rounded-2xl border border-black/5 bg-gray-50/60 p-4 shadow-sm transition hover:-translate-y-1 hover:border-cetys-yellow/70 hover:bg-white/80 dark:border-white/10 dark:bg-gray-900/60"
            >
              <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-300">{{ prof.departamento }}</p>
                <p class="text-lg font-semibold text-cetys-black dark:text-white">{{ prof.nombre }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500">{{ prof.estado }}</p>
                <p class="text-sm font-medium text-cetys-black dark:text-white">{{ prof.ubicacion }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { computed, onMounted } from 'vue';
import { gsap } from 'gsap';
import { useSchedule } from '@/composables/useSchedule';

const { professors } = useSchedule();

const spotlight = computed(() =>
  professors.value
    .filter((prof) => prof.actual || prof.estado)
    .slice(0, 3)
    .map((prof) => ({
      id: prof.id,
      nombre: prof.nombre,
      departamento: prof.departamento,
      estado: prof.estado,
      ubicacion: prof.actual?.ubicacion || prof.ubicacionActual || 'Sin ubicación'
    }))
);

onMounted(() => {
  gsap.from('.floating-card', {
    y: 40,
    opacity: 0,
    duration: 1.4,
    ease: 'power3.out'
  });

  gsap.from('h1', {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    delay: 0.1
  });
});
</script>
