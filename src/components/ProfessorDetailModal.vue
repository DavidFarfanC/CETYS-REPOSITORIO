<template>
  <Transition name="modal-fade">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-10"
      role="dialog"
      aria-modal="true"
    >
      <div class="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-white/90 shadow-2xl backdrop-blur-xl dark:bg-gray-900/80">
        <button
          type="button"
          class="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/70 text-gray-600 transition hover:scale-105 hover:text-black dark:border-white/10 dark:bg-gray-800/60 dark:text-gray-200"
          @click="$emit('close')"
          aria-label="Cerrar detalles"
        >
          ✕
        </button>
        <div class="grid gap-8 p-8 sm:grid-cols-[1fr,1.2fr] sm:p-12">
          <div class="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
            <img
              v-if="profesor?.avatar"
              :src="profesor.avatar"
              :alt="profesor.nombre"
              class="h-28 w-28 rounded-3xl object-cover shadow-xl shadow-black/20"
            />
            <div v-else class="flex h-28 w-28 items-center justify-center rounded-3xl bg-cetys-yellow/80 text-3xl font-semibold text-cetys-black shadow-xl">
              {{ initials }}
            </div>
            <div>
              <p class="text-sm uppercase tracking-[0.35em] text-gray-400">{{ profesor?.departamento }}</p>
              <h2 class="mt-2 text-3xl font-semibold text-cetys-black dark:text-white">{{ profesor?.nombre }}</h2>
            </div>
            <div class="rounded-2xl bg-cetys-yellow/20 px-4 py-3 text-sm text-cetys-black dark:bg-cetys-yellow/10">
              <p class="font-medium uppercase tracking-[0.3em] text-cetys-black/70">Estado</p>
              <p class="text-base font-semibold">{{ profesor?.estado }}</p>
              <p v-if="profesor?.actual" class="text-sm text-cetys-black/80">Hasta las {{ profesor.actual.fin }} · {{ profesor.actual.ubicacion }}</p>
              <p v-else class="text-sm text-cetys-black/80">Ubicación actual: {{ profesor?.ubicacionActual || 'No especificada' }}</p>
            </div>
            <RouterLink
              to="/mapa"
              class="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/70 px-6 py-3 text-sm font-medium text-gray-700 transition hover:border-cetys-yellow/70 hover:text-cetys-black dark:border-white/10 dark:bg-gray-800/50 dark:text-gray-100"
            >
              Ver en mapa
            </RouterLink>
          </div>
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-cetys-black dark:text-white">Horario semanal</h3>
            <ul class="space-y-4">
              <li
                v-for="(bloques, dia) in groupedSchedule"
                :key="dia"
                class="rounded-2xl border border-black/5 bg-white/70 p-4 transition hover:border-cetys-yellow/70 hover:shadow-lg dark:border-white/10 dark:bg-gray-800/40"
              >
                <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">{{ dia }}</p>
                <ul class="mt-3 space-y-2">
                  <li v-for="bloque in bloques" :key="bloque.inicio + bloque.ubicacion" class="flex flex-wrap items-center justify-between gap-2 text-sm">
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
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  profesor: {
    type: Object,
    default: null
  }
});

defineEmits(['close']);

const initials = computed(() =>
  props.profesor?.nombre
    ?.split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2) ?? ''
);

const groupedSchedule = computed(() => {
  if (!props.profesor?.horarios) {
    return {};
  }
  return props.profesor.horarios.reduce((acc, bloque) => {
    const key = bloque.dia;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(bloque);
    return acc;
  }, {});
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.4s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
