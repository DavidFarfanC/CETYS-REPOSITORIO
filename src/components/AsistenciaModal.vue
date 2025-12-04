<template>
  <Transition name="fade">
    <div v-if="open">
      <div class="fixed inset-0 z-40 bg-black bg-opacity-40 backdrop-blur-sm" />
      <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div class="w-full max-w-xl rounded-3xl border border-black/5 bg-white/95 p-8 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/90">
          <h2 class="text-3xl font-semibold text-cetys-black dark:text-white">Registro de asistencia a la clase</h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Profesor: Miguel Ángel Lara Ceballos · Ubicación actual: CETYS Universidad Tijuana
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              class="inline-flex flex-1 items-center justify-center rounded-2xl bg-[#F2C94C] px-4 py-3 text-sm font-semibold text-black shadow-md transition hover:scale-[1.01] hover:shadow-lg"
              @click="$emit('close')"
            >
              Asistir a la clase
            </button>
            <button
              type="button"
              class="inline-flex flex-1 items-center justify-center rounded-2xl bg-gray-700 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01] hover:shadow-lg"
              @click="$emit('close')"
            >
              Falta justificada
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  open: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close']);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
