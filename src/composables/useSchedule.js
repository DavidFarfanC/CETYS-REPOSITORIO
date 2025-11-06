import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/es';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/services/firebase';
import fallbackData from '@/assets/data/professors.json';

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(localizedFormat);
dayjs.locale('es');

const STATUS_MAP = [
  { key: 'Clase', label: 'En clase', style: 'from-cetys-yellow/80 to-amber-500/70 text-cetys-black' },
  { key: 'Laboratorio', label: 'En laboratorio', style: 'from-blue-500/80 to-indigo-500/70 text-white' },
  { key: 'Oficina', label: 'En oficina', style: 'from-emerald-500/80 to-teal-500/70 text-white' },
  { key: 'Asesor', label: 'En asesoría', style: 'from-purple-500/80 to-violet-500/70 text-white' }
];

const resolveStatus = (actividad = '') => {
  const base = actividad.toLowerCase();
  const match = STATUS_MAP.find(({ key }) => base.includes(key.toLowerCase()));
  if (match) {
    return match;
  }
  return {
    key: 'Disponible',
    label: 'Disponible',
    style: 'from-gray-200/80 to-gray-300/70 text-gray-800 dark:from-gray-700/70 dark:to-gray-600/70 dark:text-white'
  };
};

const professors = ref([]);
const sourceData = ref([]);
const loading = ref(true);
const error = ref(null);
const lastUpdated = ref(null);
const now = ref(dayjs());
let stopRealtimeListener;
let timer;
let bootstrapped = false;

const normaliseDay = (value) => value.toLowerCase();

const evaluateState = (rawProfessors) => {
  sourceData.value = rawProfessors;

  const today = now.value.format('YYYY-MM-DD');
  const currentDay = normaliseDay(now.value.format('dddd'));

  const enriched = rawProfessors.map((prof) => {
    const horarios = prof.horarios ?? [];
    const todaysSlots = horarios
      .filter((slot) => normaliseDay(slot.dia) === currentDay)
      .map((slot) => {
        const start = dayjs(`${today} ${slot.inicio}`, 'YYYY-MM-DD HH:mm');
        const end = dayjs(`${today} ${slot.fin}`, 'YYYY-MM-DD HH:mm');
        return { ...slot, start, end };
      })
      .sort((a, b) => a.start.valueOf() - b.start.valueOf());

    const currentSlot = todaysSlots.find((slot) => now.value.isBetween(slot.start, slot.end, null, '[)'));
    const nextSlot = todaysSlots.find((slot) => slot.start.isAfter(now.value));
    const status = currentSlot ? resolveStatus(currentSlot.actividad) : null;

    return {
      ...prof,
      estado: status?.label ?? 'Fuera de horario',
      estadoStyle: status?.style ?? 'from-gray-300/60 to-gray-200/50 text-gray-700 dark:from-gray-700/70 dark:to-gray-600/60 dark:text-gray-100',
      actual: currentSlot
        ? {
            ...currentSlot,
            inicio: currentSlot.start.format('HH:mm'),
            fin: currentSlot.end.format('HH:mm')
          }
        : null,
      siguiente: nextSlot
        ? {
            ...nextSlot,
            inicio: nextSlot.start.format('HH:mm'),
            fin: nextSlot.end.format('HH:mm')
          }
        : null
    };
  });

  professors.value = enriched;
  lastUpdated.value = dayjs();
};

const startRealtime = () => {
  if (stopRealtimeListener) {
    return;
  }
  try {
    const profesoresCollection = collection(firestore, 'profesores');
    stopRealtimeListener = onSnapshot(
      profesoresCollection,
      (snapshot) => {
        const payload = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        evaluateState(payload.length ? payload : fallbackData);
        loading.value = false;
      },
      (err) => {
        console.warn('Fallo la sincronización con Firestore, usando datos de ejemplo.', err);
        error.value = err;
        evaluateState(fallbackData);
        loading.value = false;
      }
    );
  } catch (err) {
    console.warn('No fue posible iniciar Firestore, usando datos de ejemplo.', err);
    error.value = err;
    evaluateState(fallbackData);
    loading.value = false;
  }
};

const bootstrap = () => {
  if (bootstrapped || typeof window === 'undefined') {
    return;
  }
  bootstrapped = true;
  startRealtime();
  timer = window.setInterval(() => {
    now.value = dayjs();
    const baseline = sourceData.value.length ? sourceData.value : fallbackData;
    evaluateState(baseline);
  }, 60_000);
};

const refreshNow = () => {
  const baseline = sourceData.value.length ? sourceData.value : fallbackData;
  now.value = dayjs();
  evaluateState(baseline);
};

const activeCount = computed(() => professors.value.filter((prof) => prof.actual).length);

export function useSchedule() {
  bootstrap();
  return {
    professors,
    loading,
    error,
    now,
    activeCount,
    lastUpdated,
    refreshNow
  };
}
