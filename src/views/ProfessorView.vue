<template>
  <section v-if="profesor" class="flex flex-col gap-10">
    <RouterLink
      to="/dashboard"
      class="inline-flex w-fit items-center gap-2 rounded-full border border-black/5 bg-white/70 px-5 py-2 text-sm font-medium text-gray-600 transition hover:border-cetys-yellow/60 hover:text-cetys-black dark:border-white/10 dark:bg-gray-900/60 dark:text-gray-200"
    >
      ← Volver al dashboard
    </RouterLink>

    <div class="grid gap-10 rounded-3xl border border-black/5 bg-white/80 p-10 shadow-2xl backdrop-blur-xl md:grid-cols-[0.9fr,1.1fr] dark:border-white/10 dark:bg-gray-900/60">
      <div class="space-y-6">
        <img
          v-if="profesor.avatar"
          :src="profesor.avatar"
          :alt="profesor.nombre"
          class="h-40 w-40 rounded-3xl object-cover shadow-2xl shadow-black/20"
        />
        <div v-else class="flex h-40 w-40 items-center justify-center rounded-3xl bg-cetys-yellow text-5xl font-semibold text-cetys-black shadow-2xl">
          {{ initials }}
        </div>
        <div>
          <p class="text-xs uppercase tracking-[0.35em] text-gray-400">{{ profesor.departamento }}</p>
          <h1 class="mt-3 text-4xl font-semibold text-cetys-black dark:text-white">{{ profesor.nombre }}</h1>
        </div>
        <div class="rounded-2xl bg-cetys-yellow/20 p-4 text-sm text-cetys-black dark:bg-cetys-yellow/10">
          <p class="font-medium uppercase tracking-[0.3em] text-cetys-black/70">Estado</p>
          <p class="mt-1 text-lg font-semibold">{{ profesor.estado }}</p>
          <p v-if="profesor.actual" class="text-sm text-cetys-black/70">
            {{ profesor.actual.actividad }} · hasta {{ profesor.actual.fin }} en {{ profesor.actual.ubicacion }}
          </p>
          <p v-else class="text-sm text-cetys-black/70">Fuera de horario programado en este momento.</p>
        </div>
      </div>
      <div class="space-y-6">
        <h2 class="text-lg font-semibold text-cetys-black dark:text-white">Horario de la semana</h2>
        <ul class="space-y-4">
          <li
            v-for="(bloques, dia) in groupedSchedule"
            :key="dia"
            class="rounded-3xl border border-black/5 bg-white/70 p-5 transition hover:border-cetys-yellow/70 hover:shadow-lg dark:border-white/10 dark:bg-gray-800/40"
          >
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">{{ dia }}</p>
            <ul class="mt-3 space-y-3 text-sm">
              <li v-for="bloque in bloques" :key="bloque.inicio + bloque.ubicacion" class="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p class="font-medium text-cetys-black dark:text-white">{{ bloque.actividad }}</p>
                  <p class="text-xs uppercase tracking-widest text-gray-400">{{ bloque.ubicacion }}</p>
                </div>
                <span class="rounded-full bg-cetys-yellow/30 px-3 py-1 text-xs font-semibold text-cetys-black dark:bg-cetys-yellow/20">
                  {{ bloque.inicio }} – {{ bloque.fin }}
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </section>
  <section v-else class="rounded-3xl border border-black/5 bg-white/80 p-12 text-center shadow-xl dark:border-white/10 dark:bg-gray-900/60">
    <p class="text-lg font-semibold text-cetys-black dark:text-white">No encontramos a este profesor.</p>
    <RouterLink to="/dashboard" class="mt-4 inline-flex items-center gap-2 rounded-full bg-cetys-yellow px-6 py-3 text-sm font-semibold text-cetys-black">
      Regresar al dashboard
    </RouterLink>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useSchedule } from '@/composables/useSchedule';

const route = useRoute();
const { professors } = useSchedule();

const profesor = computed(() => professors.value.find((prof) => prof.id === route.params.id));

const initials = computed(() =>
  profesor.value?.nombre
    ?.split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2) ?? ''
);

const groupedSchedule = computed(() => {
  if (!profesor.value?.horarios) {
    return {};
  }
  return profesor.value.horarios.reduce((acc, bloque) => {
    const key = bloque.dia;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(bloque);
    return acc;
  }, {});
});
</script>
