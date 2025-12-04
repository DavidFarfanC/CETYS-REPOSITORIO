<template>
  <AsistenciaModal :open="true" @close="closeModal" />
</template>

<script setup>
import { useRouter } from 'vue-router';
import AsistenciaModal from '@/components/AsistenciaModal.vue';

const router = useRouter();

const closeModal = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
};
</script>
