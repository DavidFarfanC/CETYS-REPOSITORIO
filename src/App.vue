<template>
  <div class="relative min-h-screen bg-white text-cetys-black transition-colors duration-500 dark:bg-gray-900 dark:text-white">
    <div class="pointer-events-none fixed inset-0 -z-10 bg-white/50 backdrop-blur-lg dark:bg-gray-900/60" />
    <div class="absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-cetys-yellow/40 via-transparent to-transparent blur-3xl opacity-70" />
    <AppHeader />
    <main class="mx-auto w-full max-w-6xl px-6 pb-20 pt-16 sm:px-10 lg:px-12">
      <RouterView v-slot="{ Component }">
        <Transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from {
  transform: translateY(12px);
  opacity: 0;
}

.fade-slide-leave-to {
  transform: translateY(-12px);
  opacity: 0;
}
</style>
