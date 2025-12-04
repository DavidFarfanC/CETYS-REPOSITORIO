import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/es';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(localizedFormat);
dayjs.locale('es');

export const CETYS_TZ = 'America/Tijuana';

export const STATUS_MAP = {
  en_clase: { label: 'En clase', style: 'bg-gradient-to-br from-cetys-yellow/80 to-amber-500/70 text-cetys-black' },
  fuera_de_clase: { label: 'Fuera de clase', style: 'bg-gradient-to-br from-blue-600/60 to-indigo-600/60 text-white' }
};

export const getNow = () => dayjs().tz(CETYS_TZ);

export const isInClass = (profesor, now = getNow()) => {
  if (!Array.isArray(profesor.horarios)) return false;
  const todayName = now.format('dddd').toLowerCase();

  return profesor.horarios.some((h) => {
    const sameDay = h.dia?.toLowerCase() === todayName;
    if (!sameDay) return false;

    const start = dayjs.tz(h.inicio, 'HH:mm', CETYS_TZ);
    const end = dayjs.tz(h.fin, 'HH:mm', CETYS_TZ);
    return now.isAfter(start) && now.isBefore(end);
  });
};

export const computeSlots = (horarios = [], now = getNow()) => {
  const today = now.format('YYYY-MM-DD');
  const currentDay = now.format('dddd').toLowerCase();

  const todaysSlots = horarios
    .filter((slot) => slot.dia?.toLowerCase() === currentDay)
    .map((slot) => {
      const start = dayjs.tz(`${today} ${slot.inicio}`, 'YYYY-MM-DD HH:mm', CETYS_TZ);
      const end = dayjs.tz(`${today} ${slot.fin}`, 'YYYY-MM-DD HH:mm', CETYS_TZ);
      return { ...slot, start, end };
    })
    .sort((a, b) => a.start.valueOf() - b.start.valueOf());

  const currentSlot = todaysSlots.find((slot) => now.isBetween(slot.start, slot.end, null, '[)'));
  const nextSlot = todaysSlots.find((slot) => slot.start.isAfter(now));

  return { currentSlot, nextSlot };
};

export const computeStates = (profesores = [], now = getNow()) =>
  profesores.map((prof) => {



    // EXCEPCIÓN opcional: Miguel Lara
    if (prof.id === 'miguel_lara') {
      return {
        ...prof,
        estadoKey: 'fuera_de_clase',
        estado: 'Fuera de clase',
        estadoStyle: STATUS_MAP.fuera_de_clase.style,
        ubicacionActual: prof.ubicacion_actual ?? '',
        actual: null,
        siguiente: null
      };
    }


    const { currentSlot, nextSlot } = computeSlots(prof.horarios, now);
    const isActive = Boolean(currentSlot);
    const estadoKey = isActive ? 'en_clase' : 'fuera_de_clase';
    const status = STATUS_MAP[estadoKey];

    return {
      ...prof,
      estadoKey,
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

export const getActiveSlot = (profesor, now = getNow()) => {
  if (!profesor?.horarios) {
    return null;
  }
  const today = now.format('dddd');
  return (
    profesor.horarios.find((h) => {
      const sameDay = h.dia === today;
      if (!sameDay) return false;
      const start = dayjs.tz(h.inicio, 'HH:mm', CETYS_TZ);
      const end = dayjs.tz(h.fin, 'HH:mm', CETYS_TZ);
      return now.isAfter(start) && now.isBefore(end);
    }) || null
  );
};
