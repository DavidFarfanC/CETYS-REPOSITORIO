import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/es';

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(localizedFormat);
dayjs.locale('es');

const STATUS_MAP = {
  en_clase: { label: 'En clase', style: 'from-cetys-yellow/80 to-amber-500/70 text-cetys-black' },
  oficina: { label: 'En oficina', style: 'from-emerald-500/80 to-teal-500/70 text-white' },
  asesoria: { label: 'En asesoría', style: 'from-purple-500/80 to-violet-500/70 text-white' },
  disponible: { label: 'Disponible', style: 'from-gray-200/80 to-gray-300/70 text-gray-800 dark:from-gray-700/70 dark:to-gray-600/70 dark:text-white' },
  laboratorio: { label: 'En laboratorio', style: 'from-blue-500/80 to-indigo-500/70 text-white' }
};

const fallbackData = [];

const resolveStatus = (estado, actividad = '') => {
  const key = estado?.toLowerCase();
  if (key && STATUS_MAP[key]) {
    return STATUS_MAP[key];
  }
  const base = actividad.toLowerCase();
  if (base.includes('lab')) return STATUS_MAP.laboratorio;
  if (base.includes('asesor')) return STATUS_MAP.asesoria;
  if (base.includes('clase')) return STATUS_MAP.en_clase;
  if (base.includes('oficina')) return STATUS_MAP.oficina;
  return STATUS_MAP.disponible;
};

const professors = ref([]);
const loading = ref(true);
const error = ref(null);
const lastUpdated = ref(null);
const now = ref(dayjs());
let bootstrapped = false;

const normaliseDay = (value) => value.toLowerCase();

const evaluateState = (rawProfessors) => {
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
    const status = resolveStatus(prof.estado, currentSlot?.actividad);

    return {
      ...prof,
      estado: status.label,
      estadoStyle: status.style,
      ubicacionActual: prof.ubicacion_actual ?? '',
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

const loadProfessors = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch('/data/profesores.json');
    if (!response.ok) {
      throw new Error(`Error ${response.status} al cargar los profesores`);
    }
    const payload = await response.json();
    evaluateState(Array.isArray(payload) && payload.length ? payload : fallbackData);
  } catch (err) {
    console.warn('Fallo la carga local, usando datos de respaldo.', err);
    error.value = err;
    evaluateState(fallbackData);
  } finally {
    loading.value = false;
  }
};

const bootstrap = () => {
  if (bootstrapped || typeof window === 'undefined') {
    return;
  }
  bootstrapped = true;
  loadProfessors();
};

const refreshNow = () => {
  now.value = dayjs();
  return loadProfessors();
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
