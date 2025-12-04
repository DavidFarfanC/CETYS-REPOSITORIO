<template>
  <div v-if="profesor" class="grid gap-10 rounded-3xl border border-black/5 bg-[#2C3138] p-8 text-white shadow-2xl sm:grid-cols-[0.9fr,1.1fr]">
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
        <p class="text-xs uppercase tracking-[0.35em] text-white">{{ profesor.departamento }}</p>
        <h1 class="mt-3 text-4xl font-semibold text-white">{{ profesor.nombre }}</h1>
      </div>
      <div :class="profesor.estadoKey === 'en_clase' ? 'bg-[#F2C94C] text-black' : 'bg-[#3A3F47] text-white'" class="rounded-2xl p-4 text-sm">
        <p class="font-medium uppercase tracking-[0.3em]">{{ profesor.estado }}</p>
        <p v-if="profesor.actual" class="text-sm">
          {{ profesor.actual.actividad }} · hasta {{ profesor.actual.fin }} en {{ profesor.actual.ubicacion }}
        </p>
        <p v-else class="text-sm">Ubicación actual: {{ profesor.ubicacionActual || 'No especificada' }}</p>
      </div>
    </div>
    <div class="space-y-6">
      <h2 class="text-lg font-semibold text-white">Horario de la semana</h2>
      <ul class="space-y-4">
        <li v-for="(bloques, dia) in groupedSchedule" :key="dia" class="rounded-3xl border border-black/5 bg-[#3A3F47] p-5 text-white">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-white">{{ dia }}</p>
          <ul class="mt-3 space-y-3 text-sm">
            <li
              v-for="bloque in bloques"
              :key="bloque.inicio + bloque.ubicacion"
              class="flex flex-wrap items-center justify-between gap-2 rounded-2xl px-4 py-3"
              :class="bloque === profesor.activeSlot ? 'bg-[#F2C94C] text-black font-semibold' : 'bg-[#2C3138] text-white'"
            >
              <div>
                <p class="font-medium">{{ bloque.actividad }}</p>
                <p class="text-xs uppercase tracking-widest">{{ bloque.ubicacion }}</p>
              </div>
              <span class="rounded-full bg-black/10 px-3 py-1 text-xs font-semibold" :class="bloque === profesor.activeSlot ? 'text-black' : 'text-white'">
                {{ bloque.inicio }} – {{ bloque.fin }}
              </span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
  <div v-else class="rounded-3xl border border-black/5 bg-[#2C3138] p-8 text-center text-white shadow-xl">
    <p class="text-lg font-semibold">No encontramos a este profesor.</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  profesor: {
    type: Object,
    default: null
  }
});

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
