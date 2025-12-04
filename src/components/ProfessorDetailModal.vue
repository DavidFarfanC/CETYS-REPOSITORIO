<template>
  <Transition name="modal-fade">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-10"
      role="dialog"
      aria-modal="true"
    >
      <div class="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white/90 shadow-2xl backdrop-blur-xl dark:bg-gray-900/80">
        <button
          type="button"
          class="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/70 text-gray-600 transition hover:scale-105 hover:text-black dark:border-white/10 dark:bg-gray-800/60 dark:text-gray-200"
          @click="$emit('close')"
          aria-label="Cerrar detalles"
        >
          ✕
        </button>
        <div class="max-h-[80vh] overflow-y-auto p-6 sm:p-10">
          <ProfessorView :profesor="profesor" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import ProfessorView from '@/views/ProfessorView.vue';

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
