<template>
  <section class="flex flex-col gap-12">
    <header class="space-y-6 rounded-3xl border border-black/5 bg-white/70 p-10 shadow-2xl shadow-black/10 backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/60">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-gray-400">Vista general</p>
          <h1 class="mt-2 text-3xl font-semibold text-cetys-black sm:text-4xl dark:text-white">Dashboard de Profesores</h1>
          <p class="mt-3 max-w-2xl text-base text-gray-600 dark:text-gray-300">
            Encuentra rápidamente a cualquier profesor, conoce su actividad actual y planea tus visitas al campus con información actualizada minuto a minuto.
          </p>
        </div>
        <div class="flex gap-2 text-sm text-gray-500 dark:text-gray-300">
          <span>Hora actual en CETYS:</span>
          <strong class="text-cetys-black dark:text-white">
            {{ horaTijuana || 'Sincronizando…' }}
          </strong>
        </div>
      </div>
      <div class="grid gap-4 md:grid-cols-[minmax(0,1fr),minmax(0,0.8fr),auto]">
        <label class="flex items-center gap-3 rounded-2xl border border-black/5 bg-white/90 px-5 py-3 shadow-sm transition hover:border-cetys-yellow/70 dark:border-white/10 dark:bg-gray-900/60">
          <span class="text-sm font-medium text-gray-400">Buscar</span>
          <input
            v-model="search"
            type="search"
            placeholder="Nombre o departamento"
            class="w-full bg-transparent text-base font-medium text-cetys-black placeholder:text-gray-400 focus:outline-none dark:text-white"
          />
        </label>
        <label class="flex items-center gap-3 rounded-2xl border border-black/5 bg-white/90 px-5 py-3 shadow-sm transition hover:border-cetys-yellow/70 dark:border-white/10 dark:bg-gray-900/60">
          <span class="text-sm font-medium text-gray-400">Departamento</span>
          <select
            v-model="department"
            class="w-full bg-transparent text-base font-medium text-cetys-black focus:outline-none dark:text-white"
          >
            <option value="todos">Todos</option>
            <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
          </select>
        </label>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-2xl bg-cetys-yellow px-6 py-3 text-sm font-semibold text-cetys-black shadow-lg shadow-yellow-400/40 transition hover:scale-105 hover:shadow-2xl"
          @click="refreshNow"
        >
          Actualizar ahora
        </button>
      </div>
    </header>

    <div class="grid gap-6 md:grid-cols-3">
      <div class="rounded-3xl border border-black/5 bg-white/80 p-6 shadow-xl backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/60">
        <p class="text-xs uppercase tracking-[0.3em] text-gray-400">Profesores activos</p>
        <p class="mt-2 text-3xl font-semibold text-cetys-black dark:text-white">{{ activeCount }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-300">Con actividad en curso ahora mismo.</p>
      </div>
      <div class="rounded-3xl border border-black/5 bg-white/80 p-6 shadow-xl backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/60">
        <p class="text-xs uppercase tracking-[0.3em] text-gray-400">Total registrados</p>
        <p class="mt-2 text-3xl font-semibold text-cetys-black dark:text-white">{{ professors.length }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-300">Profesionistas con horario disponible en la plataforma.</p>
      </div>
      <div class="rounded-3xl border border-black/5 bg-white/80 p-6 shadow-xl backdrop-blur-lg dark:border-white/10 dark:bg-gray-900/60">
        <p class="text-xs uppercase tracking-[0.3em] text-gray-400">Próxima actualización</p>
        <p class="mt-2 text-xl font-semibold text-cetys-black dark:text-white">Menos de 3 minutos</p>
        <p class="text-sm text-gray-500 dark:text-gray-300">Actualización automática cada minuto.</p>
      </div>
    </div>

    <div v-if="loading" class="rounded-3xl border border-black/5 bg-white/70 p-12 text-center text-gray-500 shadow-lg dark:border-white/10 dark:bg-gray-900/60">
      Cargando profesores…
    </div>
    <div v-else-if="!filteredProfessors.length" class="rounded-3xl border border-black/5 bg-white/70 p-12 text-center shadow-lg dark:border-white/10 dark:bg-gray-900/60">
      <p class="text-base font-medium text-cetys-black dark:text-white">No encontramos profesores para tu búsqueda.</p>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-300">Prueba con otro nombre o departamento.</p>
    </div>
    <div v-else class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <ProfessorCard v-for="profesor in filteredProfessors" :key="profesor.id" :profesor="profesor" @select="openModal(profesor)" />
    </div>

    <ProfessorDetailModal :open="selected !== null" :profesor="selected" @close="selected = null" />
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import ProfessorCard from '@/components/ProfessorCard.vue';
import ProfessorDetailModal from '@/components/ProfessorDetailModal.vue';
import { useSchedule } from '@/composables/useSchedule';

const search = ref('');
const department = ref('todos');
const selected = ref(null);
const horaTijuana = ref('');
let horaInterval;

const { professors, loading, activeCount, lastUpdated, refreshNow } = useSchedule();

const departments = computed(() => {
  const items = new Set();
  professors.value.forEach((prof) => {
    if (prof.departamento) {
      items.add(prof.departamento);
    }
  });
  return Array.from(items).sort();
});

const filteredProfessors = computed(() => {
  const term = search.value.trim().toLowerCase();
  return professors.value.filter((prof) => {
    const matchesDepartment = department.value === 'todos' || prof.departamento === department.value;
    const matchesTerm =
      !term ||
      prof.nombre.toLowerCase().includes(term) ||
      (prof.departamento && prof.departamento.toLowerCase().includes(term));
    return matchesDepartment && matchesTerm;
  });
});

const openModal = (profesor) => {
  selected.value = profesor;
};

const updateHoraTijuana = () => {
  horaTijuana.value = new Date().toLocaleTimeString('es-MX', {
    timeZone: 'America/Tijuana',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

onMounted(() => {
  updateHoraTijuana();
  horaInterval = window.setInterval(updateHoraTijuana, 1000);
});

onUnmounted(() => {
  if (horaInterval) {
    window.clearInterval(horaInterval);
  }
});
</script>
