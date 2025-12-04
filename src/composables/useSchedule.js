import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { computeStates, getActiveSlot, getNow } from '@/utils/schedule';

const fallbackData = [];

const professors = ref([]);
const loading = ref(true);
const error = ref(null);
const lastUpdated = ref(null);
const now = ref(getNow());
let bootstrapped = false;

const evaluateState = (rawProfessors) => {
  const enriched = computeStates(rawProfessors, now.value).map((prof) => ({
    ...prof,
    activeSlot: getActiveSlot(prof, now.value)
  }));
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
  now.value = getNow();
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
