<template>
  <AsistenciaModal :open="open" @close="closeModal" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AsistenciaModal from '@/components/AsistenciaModal.vue';

const router = useRouter();
const open = ref(false);

onMounted(() => {
  // Abrimos en siguiente tick para permitir animación de entrada
  requestAnimationFrame(() => {
    open.value = true;
  });
});

const closeModal = () => {
  open.value = false;
  setTimeout(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  }, 180); // duración de la animación de salida
};
</script>
