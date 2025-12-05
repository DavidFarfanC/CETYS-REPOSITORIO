<template>
  <header class="sticky top-0 z-40 border-b border-white/10 bg-white/70 backdrop-blur-md transition-colors duration-700 dark:border-white/5 dark:bg-gray-900/60">
    <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 sm:px-10 lg:px-12">
      <RouterLink to="/" class="group inline-flex items-center gap-3">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-cetys-yellow font-semibold text-cetys-black shadow-glass transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
          CETYS
        </div>
        <div class="flex flex-col">
          <span class="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-300">Teacher Tracker</span>
          <span class="text-xl font-semibold text-cetys-black dark:text-white">CETYS Universidad</span>
        </div>
      </RouterLink>
      <nav class="hidden items-center gap-8 text-sm font-medium text-gray-500 md:flex dark:text-gray-300">
        <RouterLink to="/" class="hover:text-cetys-black dark:hover:text-white">Inicio</RouterLink>
        <RouterLink to="/dashboard" class="hover:text-cetys-black dark:hover:text-white">Profesores</RouterLink>
        <RouterLink to="/mapa" class="hover:text-cetys-black dark:hover:text-white">Mapa</RouterLink>
        <button
          type="button"
          class="inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/5 bg-white/80 text-gray-700 shadow-md transition hover:scale-105 hover:border-cetys-yellow/70 hover:text-cetys-black dark:border-white/10 dark:bg-gray-800/80 dark:text-white"
          @click="toggleTheme"
          :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
        >
          <component :is="isDark ? MoonIcon : SunIcon" class="h-6 w-6" />
        </button>
      </nav>
      <div class="flex items-center gap-3 md:hidden">
        <button
          type="button"
          class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/10 text-white backdrop-blur-sm transition hover:scale-105 hover:border-cetys-yellow/70 hover:text-cetys-yellow"
          @click="showMenu = true"
          aria-label="Abrir menú"
        >
          <Bars3Icon class="h-7 w-7" />
        </button>
      </div>
    </div>
    <MobileMenu :open="showMenu" :is-dark="isDark" @close="showMenu = false" @toggle-theme="toggleTheme" />
  </header>
</template>

<script setup>
import { onUnmounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { MoonIcon, SunIcon, Bars3Icon } from '@heroicons/vue/24/outline';
import MobileMenu from '@/components/MobileMenu.vue';

const isDark = ref(false);
const showMenu = ref(false);
let prefersDarkMedia;
let mediaHandler;

if (typeof window !== 'undefined') {
  prefersDarkMedia = window.matchMedia('(prefers-color-scheme: dark)');
  isDark.value = prefersDarkMedia.matches;
  mediaHandler = (event) => {
    isDark.value = event.matches;
  };
  prefersDarkMedia.addEventListener('change', mediaHandler);
}

watch(
  isDark,
  (value) => {
    if (value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  { immediate: true }
);

const toggleTheme = () => {
  isDark.value = !isDark.value;
};

onUnmounted(() => {
  if (prefersDarkMedia && mediaHandler) {
    prefersDarkMedia.removeEventListener('change', mediaHandler);
  }
});
</script>
