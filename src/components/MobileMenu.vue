<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-[9999]"
        @click="handleClose"
      />
    </Transition>
    <Transition name="drawer">
      <div
        v-if="open"
        class="fixed top-0 right-0 h-full w-[78%] max-w-[380px] bg-[#0f172a] shadow-2xl z-[10000] transform transition-transform duration-300"
        :class="open ? 'translate-x-0' : 'translate-x-full'"
        @click.stop
      >
        <div class="flex flex-col gap-6 p-6 text-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-lg font-semibold">
              <span>CETYS</span>
            </div>
            <button
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:scale-105 hover:border-cetys-yellow/70 hover:text-cetys-yellow"
              @click="handleClose"
              aria-label="Cerrar menú"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>

          <nav class="flex flex-col gap-4 text-base font-medium">
            <RouterLink to="/" class="rounded-xl px-3 py-2 hover:bg-white/10" @click="handleClose">Inicio</RouterLink>
            <RouterLink to="/dashboard" class="rounded-xl px-3 py-2 hover:bg-white/10" @click="handleClose">Profesores</RouterLink>
            <RouterLink to="/mapa" class="rounded-xl px-3 py-2 hover:bg-white/10" @click="handleClose">Mapa</RouterLink>
          </nav>

          <button
            type="button"
            class="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:scale-105 hover:border-cetys-yellow/70 hover:text-cetys-yellow"
            @click="toggleTheme"
          >
            <component :is="isDark ? MoonIcon : SunIcon" class="mr-2 h-5 w-5" />
            {{ isDark ? 'Modo claro' : 'Modo oscuro' }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { MoonIcon, SunIcon, XMarkIcon } from '@heroicons/vue/24/outline';

defineProps({
  open: {
    type: Boolean,
    default: false
  },
  isDark: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'toggle-theme']);

const handleClose = () => emit('close');
const toggleTheme = () => emit('toggle-theme');
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
