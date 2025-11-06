<template>
  <section class="flex flex-col gap-10">
    <header class="space-y-4 rounded-3xl border border-black/5 bg-white/70 p-10 shadow-2xl shadow-black/10 backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/60">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-gray-400">Campus Tijuana</p>
          <h1 class="mt-1 text-3xl font-semibold text-cetys-black sm:text-4xl dark:text-white">Mapa interactivo</h1>
          <p class="mt-3 max-w-3xl text-base text-gray-600 dark:text-gray-300">
            Localiza aulas, laboratorios y oficinas en segundos. Los marcadores resaltan cuando existe actividad en curso o próxima, tomando como referencia
            los horarios del dashboard.
          </p>
        </div>
      </div>
    </header>

    <CampusMap />
  </section>
</template>

<script setup>
import CampusMap from '@/components/CampusMap.vue';
</script>
