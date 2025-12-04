<template>
  <article
    class="group relative overflow-hidden rounded-3xl p-6 text-white shadow-xl shadow-black/10 transition duration-500 hover:-translate-y-1.5 hover:shadow-2xl"
    :class="
      profesor.estadoKey === 'en_clase'
        ? 'bg-gradient-to-br from-[#F2C94C] to-[#F29E2E] text-black'
        : 'bg-gradient-to-br from-[#3A3F47] to-[#2C3138] text-white'
    "
    @click="$emit('select', profesor)"
  >
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-4">
        <img
          v-if="profesor.avatar"
          :src="profesor.avatar"
          :alt="profesor.nombre"
          class="h-16 w-16 rounded-2xl object-cover shadow-lg shadow-black/20 transition duration-500 group-hover:scale-105"
        />
        <div v-else class="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/30 text-2xl font-semibold uppercase shadow-lg shadow-black/20">
          {{ initials }}
        </div>
        <div>
          <p class="text-sm font-medium uppercase tracking-widest text-white/70">{{ profesor.departamento }}</p>
          <h3 class="text-2xl font-semibold leading-tight">{{ profesor.nombre }}</h3>
        </div>
      </div>
      <span
        v-if="profesor.estadoKey === 'en_clase'"
        class="rounded-full bg-[#F2C94C] px-3 py-1 text-xs font-bold uppercase tracking-widest text-black"
      >
        EN CLASE
      </span>
      <span
        v-else
        class="rounded-full bg-[#4A5058] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white"
      >
        FUERA DE CLASE
      </span>
    </div>
    <div class="mt-6 grid gap-4 text-sm text-white/80 md:grid-cols-2">
      <div>
        <p class="text-xs uppercase tracking-widest text-white/60">Actividad</p>
        <p class="mt-1 text-base font-medium text-white">
          {{ profesor.actual ? profesor.actual.actividad : profesor.estado }}
        </p>
      </div>
      <div>
        <p class="text-xs uppercase tracking-widest text-white/60">Ubicación</p>
        <p class="mt-1 text-base font-medium text-white">
          {{ profesor.actual ? profesor.actual.ubicacion : profesor.ubicacionActual || 'Sin asignar' }}
        </p>
      </div>
    </div>
    <div class="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs font-medium uppercase tracking-widest text-white/70">
      <div v-if="profesor.actual">
        Termina a las {{ profesor.actual.fin }}
      </div>
      <div v-else-if="profesor.siguiente">
        Próxima actividad {{ profesor.siguiente.inicio }} · {{ profesor.siguiente.ubicacion }}
      </div>
      <button
        type="button"
        class="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
        @click.stop="$emit('select', profesor)"
      >
        Ver detalles
        <span aria-hidden="true">↗</span>
      </button>
    </div>
    <div class="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
      <div class="absolute -left-16 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-white/30 blur-3xl" />
      <div class="absolute -right-16 bottom-0 h-32 w-32 rounded-full bg-white/20 blur-3xl" />
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
  profesor: {
    type: Object,
    required: true
  }
});

defineEmits(['select']);

const initials = computed(() =>
  (props.profesor.nombre ?? '')
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
);
</script>
