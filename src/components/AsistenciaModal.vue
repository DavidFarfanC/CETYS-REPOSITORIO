<template>
  <Transition name="modal-scale">
    <div v-if="open">
      <div class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200" />
      <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          class="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-gray-900/90 p-8 text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl transition"
          :class="{
            'scale-100 opacity-100': open,
            'scale-95 opacity-0': !open
          }"
        >
          <header class="flex items-start gap-4">
            <img
              src="https://res.cloudinary.com/dvt59hfgg/image/upload/v1764835327/id_moises_adame_nombre_Mois%C3%A9s_S%C3%A1nchez_Adame_departamento_Ingenier%C3%ADa_avatar_httpsres.cloudinary.comdvt59hfggimageuploadv176482549431_ufdccd.png_ubicacion_actual_4302_estado_en_clase_horario_ogxem0.jpg"
              alt="Miguel Ángel Lara Ceballos"
              class="h-18 w-18 rounded-full border border-white/10 object-cover shadow-lg"
              style="height: 72px; width: 72px"
            />
            <div class="space-y-2">
              <p class="text-sm font-medium uppercase tracking-[0.35em] text-gray-300">Registro</p>
              <h2 class="text-3xl font-semibold">Registro de asistencia a la clase</h2>
              <p class="text-base text-gray-300">
                Profesor: <strong class="text-white">Miguel Ángel Lara Ceballos</strong> ·
                <span class="inline-flex items-center gap-2">
                  <span class="inline-block h-2.5 w-2.5 rounded-full bg-[#6FCF97] animate-[pulse-green_1.4s_ease-in-out_infinite]" />
                  Ubicación actual: CETYS Universidad Tijuana
                </span>
              </p>
            </div>
          </header>

          <div class="mt-8 flex flex-col gap-4 sm:flex-row" v-if="!processing">
            <button
              type="button"
              class="inline-flex flex-1 items-center justify-center gap-3 rounded-2xl bg-[#F2C94C] px-5 py-4 text-sm font-semibold text-black shadow-md transition hover:scale-[1.01] hover:shadow-lg"
              @click="handleAction('asistencia')"
            >
              Asistir a la clase
            </button>
            <button
              type="button"
              class="inline-flex flex-1 items-center justify-center gap-3 rounded-2xl bg-gray-700 px-5 py-4 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01] hover:shadow-lg"
              @click="handleAction('falta')"
            >
              Falta justificada
            </button>
          </div>
          <div v-else class="mt-8 space-y-3">
            <div
              class="rounded-2xl px-5 py-4 text-sm font-semibold text-white shadow-md"
              :class="selectedAction === 'asistencia' ? 'bg-[#6FCF97] text-black' : 'bg-[#56CCF2]'"
            >
              {{ selectedAction === 'asistencia' ? 'Asistiendo a la clase' : 'Falta justificada en proceso' }}
            </div>
            <p class="text-sm text-gray-300">Cargando respuesta…</p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const processing = ref(false);
const selectedAction = ref(null);

const handleAction = (action) => {
  if (processing.value) return;
  selectedAction.value = action;
  processing.value = true;
  setTimeout(() => {
    emit('close');
    processing.value = false;
    selectedAction.value = null;
  }, 2000);
};
</script>

<style scoped>
.modal-scale-enter-active {
  transition: opacity 180ms cubic-bezier(0.22, 1, 0.36, 1), transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
}
.modal-scale-leave-active {
  transition: opacity 180ms cubic-bezier(0.22, 1, 0.36, 1), transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
}
.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
.modal-scale-leave-from,
.modal-scale-enter-to {
  opacity: 1;
  transform: scale(1);
}

@keyframes pulse-green {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.4);
    opacity: 0.6;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
