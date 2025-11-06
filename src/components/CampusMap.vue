<template>
  <section id="mapa" class="rounded-3xl border border-black/5 bg-white/70 p-10 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/60">
    <div class="grid gap-10 lg:grid-cols-[minmax(0,1.3fr),minmax(0,0.8fr)]">
      <div class="space-y-6">
        <header class="space-y-2">
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-gray-400">Mapa interactivo</p>
          <h2 class="text-3xl font-semibold text-cetys-black dark:text-white">Explora el campus CETYS Tijuana</h2>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Navega el plano institucional, identifica edificios clave y ubica en segundos dónde se encuentran las actividades académicas y de asesoría.
          </p>
        </header>

        <div class="flex flex-wrap items-center gap-3">
          <label class="flex min-w-[240px] flex-1 items-center gap-3 rounded-2xl border border-black/5 bg-white/80 px-4 py-3 text-sm text-gray-500 shadow-sm focus-within:border-cetys-yellow/70 dark:border-white/10 dark:bg-gray-900/60 dark:text-gray-300">
            <span class="font-medium uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Buscar</span>
            <input
              v-model="search"
              type="search"
              placeholder="Nombre del edificio o código (ej. A-203)"
              class="w-full bg-transparent text-base font-medium text-cetys-black placeholder:text-gray-400 focus:outline-none dark:text-white"
            />
          </label>
          <label class="flex items-center gap-3 rounded-2xl border border-black/5 bg-white/80 px-4 py-3 text-sm text-gray-500 shadow-sm focus-within:border-cetys-yellow/70 dark:border-white/10 dark:bg-gray-900/60 dark:text-gray-300">
            <span class="font-medium uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Categoría</span>
            <select v-model="typeFilter" class="w-full bg-transparent text-base font-medium text-cetys-black focus:outline-none dark:text-white">
              <option value="todos">Todas</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </label>
        </div>

        <div class="relative overflow-hidden rounded-3xl border border-black/5 bg-gray-200/80 shadow-xl dark:border-white/10 dark:bg-gray-800/60">
          <div class="relative aspect-[4/3]">
            <img
              :src="imageSource"
              alt="Plano oficial del campus CETYS Tijuana"
              class="absolute inset-0 h-full w-full object-cover object-center"
              @error="handleImageError"
            />
            <div class="absolute inset-0 bg-gradient-to-br from-white/5 via-white/0 to-black/10 dark:from-gray-900/20 dark:via-gray-900/10 dark:to-gray-900/60" />

            <TransitionGroup name="marker">
              <button
                v-for="area in filteredAreas"
                :key="area.id"
                type="button"
                class="map-marker"
                :class="{
                  'map-marker--active': selectedArea?.id === area.id,
                  'map-marker--live': area.hasActivity,
                  'map-marker--upcoming': !area.hasActivity && area.hasUpcoming
                }"
                :style="markerStyle(area)"
                @click="selectArea(area)"
              >
                {{ area.shorthand }}
              </button>
            </TransitionGroup>
          </div>
          <div class="absolute bottom-5 left-5 flex items-center gap-3 rounded-full bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cetys-black shadow-lg dark:bg-gray-900/80 dark:text-white">
            <span class="inline-flex h-3 w-3 rounded-full bg-cetys-yellow" />
            Actividad en vivo
            <span class="inline-flex h-3 w-3 rounded-full bg-emerald-400/80" />
            Próximo bloque
          </div>
        </div>
      </div>

      <aside class="space-y-6">
        <div class="rounded-3xl border border-black/5 bg-white/80 p-6 shadow-lg dark:border-white/10 dark:bg-gray-900/60">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Interacción</p>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Selecciona un punto del mapa o usa el listado para destacar edificios. Los marcadores se iluminan cuando existe actividad en el horario actual o
            próxima.
          </p>
        </div>

        <div v-if="selectedArea" class="space-y-4 rounded-3xl border border-black/5 bg-white/90 p-6 shadow-xl dark:border-white/10 dark:bg-gray-900/70">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-[0.3em] text-gray-400">{{ selectedArea.type }}</p>
              <h3 class="mt-1 text-2xl font-semibold text-cetys-black dark:text-white">{{ selectedArea.label }}</h3>
            </div>
            <span class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 dark:bg-gray-800 dark:text-gray-300">
              {{ selectedArea.shorthand }}
            </span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-300">{{ selectedArea.description }}</p>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in selectedArea.aliases"
              :key="tag"
              class="rounded-full border border-black/5 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300"
            >
              {{ tag.replace('*', '') }}
            </span>
          </div>

          <div v-if="selectedAreaProfessors.length" class="space-y-3 rounded-2xl bg-gray-50/80 p-4 dark:bg-gray-800/60">
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Profesores relacionados</p>
            <ul class="space-y-3">
              <li
                v-for="prof in selectedAreaProfessors"
                :key="prof.id + prof.estado"
                class="rounded-2xl border border-black/5 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-gray-900/60"
              >
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-300">{{ prof.departamento }}</p>
                    <p class="text-base font-semibold text-cetys-black dark:text-white">{{ prof.nombre }}</p>
                  </div>
                  <span
                    class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em]"
                    :class="prof.isCurrent ? 'bg-cetys-yellow text-cetys-black' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'"
                  >
                    {{ prof.estado }}
                  </span>
                </div>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">{{ prof.actividad }}</p>
                <p class="text-xs uppercase tracking-[0.3em] text-gray-400">
                  {{ prof.ubicacion }} · {{ prof.horario }}
                </p>
              </li>
            </ul>
          </div>
          <div v-else class="rounded-2xl border border-black/5 bg-gray-50/80 p-4 text-sm text-gray-500 dark:border-white/10 dark:bg-gray-900/50 dark:text-gray-300">
            No hay profesores activos vinculados a esta zona en este momento.
          </div>
        </div>

        <div class="rounded-3xl border border-black/5 bg-white/80 p-6 shadow-lg dark:border-white/10 dark:bg-gray-900/60">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Listado de ubicaciones</p>
          <ul class="mt-4 space-y-2 max-h-80 overflow-y-auto pr-1">
            <li v-for="area in filteredAreas" :key="area.id">
              <button
                type="button"
                class="flex w-full items-center justify-between rounded-2xl border border-transparent px-4 py-3 text-left transition focus-visible:outline-none"
                :class="[
                  selectedArea?.id === area.id ? 'bg-cetys-yellow/80 text-cetys-black shadow-lg' : 'bg-white/90 text-gray-600 hover:border-cetys-yellow/60 hover:bg-white',
                  'dark:bg-gray-900/60 dark:text-gray-300 dark:hover:bg-gray-800/70'
                ]"
                @click="selectArea(area)"
              >
                <div>
                  <p class="text-sm font-semibold text-cetys-black dark:text-white">{{ area.label }}</p>
                  <p class="text-xs uppercase tracking-[0.3em] text-gray-400">{{ area.type }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    v-if="area.hasActivity"
                    class="inline-flex h-2.5 w-2.5 rounded-full bg-cetys-yellow shadow-[0_0_0_6px_rgba(255,198,0,0.25)]"
                    aria-hidden="true"
                  />
                  <span
                    v-else-if="area.hasUpcoming"
                    class="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400/80 shadow-[0_0_0_6px_rgba(52,211,153,0.25)]"
                    aria-hidden="true"
                  />
                  <span class="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">{{ area.shorthand }}</span>
                </div>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useSchedule } from '@/composables/useSchedule';

const mapImagePath = '/campus-map.jpg';
const fallbackSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640">
    <defs>
      <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f1f5f9" />
        <stop offset="100%" stop-color="#e2e8f0" />
      </linearGradient>
    </defs>
    <rect width="960" height="640" fill="url(#grad)" />
    <g fill="#1d1d1b" fill-opacity="0.12">
      <rect x="120" y="140" width="220" height="120" rx="20" />
      <rect x="430" y="120" width="420" height="180" rx="40" />
      <rect x="180" y="320" width="360" height="200" rx="26" />
      <rect x="620" y="340" width="160" height="180" rx="24" />
    </g>
    <g fill="#1d1d1b" fill-opacity="0.65" font-family="Arial, Helvetica, sans-serif">
      <text x="180" y="96" font-size="32" font-weight="600">Mapa del campus</text>
      <text x="180" y="132" font-size="18" fill-opacity="0.65">Coloca el archivo campus-map.jpg en la carpeta /public para mostrar el plano oficial.</text>
    </g>
    <g fill="#1d1d1b" fill-opacity="0.45" font-family="Arial, Helvetica, sans-serif" font-size="18">
      <text x="140" y="240">Edificio Aulas</text>
      <text x="200" y="470">Aulas 300 / 400</text>
      <text x="660" y="460">Oficinas D</text>
      <text x="560" y="210">Estadio CETYS</text>
    </g>
  </svg>
`;
const fallbackImage = `data:image/svg+xml;utf8,${encodeURIComponent(fallbackSvg)}`;

const search = ref('');
const typeFilter = ref('todos');
const selectedAreaId = ref(null);
const hasImageError = ref(false);

const { professors } = useSchedule();

const campusAreasData = [
  {
    id: 'edificio-aulas',
    label: 'Edificio de Aulas',
    shorthand: '1',
    type: 'Aulas',
    description: 'Núcleo de salones para licenciaturas y tronco común. Incluye aulas A-200 y A-300.',
    position: { top: 60, left: 52 },
    color: '#FFC600',
    aliases: ['A-203', 'A-20', 'Aulas 200', 'Aulas 300', 'Salón A-', 'Edificio de Aulas']
  },
  {
    id: 'edificio-d',
    label: 'Edificio de Oficinas D',
    shorthand: 'D',
    type: 'Oficinas',
    description: 'Direcciones académicas, asesorías y oficinas administrativas del campus.',
    position: { top: 47, left: 67 },
    color: '#f97316',
    aliases: ['Oficina D', 'D-', 'Dirección Académica', 'Oficinas D']
  },
  {
    id: 'studio-creativo',
    label: 'Estudios de Diseño y Comunicación',
    shorthand: 'C',
    type: 'Aulas',
    description: 'Salas tipo estudio para Diseño Gráfico, Animación Digital y medios audiovisuales.',
    position: { top: 68, left: 33 },
    color: '#ec4899',
    aliases: ['Studio C', 'Estudio C', 'Sala Creativa', 'Diseño']
  },
  {
    id: 'laboratorios-ingenieria',
    label: 'CINAP · Laboratorios de Ingeniería',
    shorthand: '5',
    type: 'Laboratorios',
    description: 'Laboratorios de física, óptica, robótica e innovación tecnológica.',
    position: { top: 42, left: 45 },
    color: '#3b82f6',
    aliases: ['CINAP', 'Lab. Óptica', 'Laboratorio de Óptica', 'Lab. Innovación', 'Laboratorio', 'Ing.']
  },
  {
    id: 'laboratorio-robotica',
    label: 'Laboratorio de Innovación & Robótica',
    shorthand: 'R',
    type: 'Laboratorios',
    description: 'Espacio para prácticas de robótica aplicada, IA y prototipado de ingeniería.',
    position: { top: 54, left: 41 },
    color: '#22d3ee',
    aliases: ['Lab. Innovación', 'Robótica', 'Laboratorio de IA', 'Lab Innovacion']
  },
  {
    id: 'centro-asistencia',
    label: 'Centro de Asesoría · CAL',
    shorthand: 'CAL',
    type: 'Centros de atención',
    description: 'Centro de asesoría estudiantil y orientación psicopedagógica.',
    position: { top: 72, left: 59 },
    color: '#8b5cf6',
    aliases: ['CAL', 'Centro de Asesoría', 'Asesoría', 'Centro de Atención']
  },
  {
    id: 'biblioteca',
    label: 'Centro de Información “Luis Fimbres Moreno”',
    shorthand: 'BIB',
    type: 'Centros de atención',
    description: 'Biblioteca, salas de estudio y recursos digitales para investigación académica.',
    position: { top: 78, left: 46 },
    color: '#0ea5e9',
    aliases: ['Biblioteca', 'Centro de Información', 'Luis Fimbres', 'Sala de Lectura']
  },
  {
    id: 'estadio',
    label: 'Estadio “Margarita Astiazarán de Fimbres”',
    shorthand: 'EST',
    type: 'Áreas comunes',
    description: 'Estadio, pista de atletismo y canchas para torneos representativos del campus.',
    position: { top: 18, left: 66 },
    color: '#1D1D1B',
    aliases: ['Estadio', 'Cancha', 'Pista', 'Campo deportivos']
  },
  {
    id: 'cafeteria',
    label: 'Cafetería Central & Food Court',
    shorthand: 'CAF',
    type: 'Servicios',
    description: 'Opciones de alimentos, café y snacks. Punto de encuentro estudiantil.',
    position: { top: 84, left: 53 },
    color: '#16a34a',
    aliases: ['Cafetería', 'Café', 'Food Court', 'Comedor']
  },
  {
    id: 'estacionamiento-principal',
    label: 'Estacionamiento Principal',
    shorthand: 'P',
    type: 'Servicios',
    description: 'Acceso principal vehicular, registro de visitantes y zonas de pick-up.',
    position: { top: 82, left: 76 },
    color: '#64748b',
    aliases: ['Estacionamiento', 'Parking', 'Acceso principal']
  }
];

const matchesAlias = (aliases, target) => {
  const normalisedTarget = target.toLowerCase();
  return aliases.some((alias) => {
    const pattern = alias.toLowerCase();
    if (pattern.endsWith('*')) {
      return normalisedTarget.startsWith(pattern.slice(0, -1));
    }
    return normalisedTarget.includes(pattern);
  });
};

const activeLocations = computed(() => {
  const set = new Set();
  professors.value.forEach((prof) => {
    if (prof.actual?.ubicacion) {
      set.add(prof.actual.ubicacion.toLowerCase());
    }
  });
  return set;
});

const upcomingLocations = computed(() => {
  const set = new Set();
  professors.value.forEach((prof) => {
    if (prof.siguiente?.ubicacion) {
      set.add(prof.siguiente.ubicacion.toLowerCase());
    }
  });
  return set;
});

const enrichedAreas = computed(() =>
  campusAreasData.map((area) => {
    const hasActivity = Array.from(activeLocations.value).some((loc) => matchesAlias(area.aliases, loc));
    const hasUpcoming = !hasActivity && Array.from(upcomingLocations.value).some((loc) => matchesAlias(area.aliases, loc));
    return {
      ...area,
      hasActivity,
      hasUpcoming
    };
  })
);

const categories = computed(() => {
  const values = new Set(enrichedAreas.value.map((area) => area.type));
  return Array.from(values).sort((a, b) => a.localeCompare(b, 'es'));
});

const filteredAreas = computed(() => {
  const term = search.value.trim().toLowerCase();
  return enrichedAreas.value.filter((area) => {
    const matchesTerm =
      !term ||
      area.label.toLowerCase().includes(term) ||
      area.aliases.some((alias) => alias.toLowerCase().includes(term));
    const matchesType = typeFilter.value === 'todos' || area.type === typeFilter.value;
    return matchesTerm && matchesType;
  });
});

watch(
  filteredAreas,
  (areas) => {
    if (!areas.length) {
      selectedAreaId.value = null;
      return;
    }
    if (!selectedAreaId.value || !areas.some((area) => area.id === selectedAreaId.value)) {
      const preferred = areas.find((area) => area.hasActivity) ?? areas[0];
      selectedAreaId.value = preferred.id;
    }
  },
  { immediate: true }
);

const selectedArea = computed(() => enrichedAreas.value.find((area) => area.id === selectedAreaId.value) ?? null);

const selectedAreaProfessors = computed(() => {
  if (!selectedArea.value) {
    return [];
  }
  const aliases = selectedArea.value.aliases.map((alias) => alias.toLowerCase());
  return professors.value
    .map((prof) => {
      const currentLocation = prof.actual?.ubicacion?.toLowerCase();
      const nextLocation = prof.siguiente?.ubicacion?.toLowerCase();
      const matchesCurrent = currentLocation ? aliases.some((alias) => currentLocation.includes(alias)) : false;
      const matchesNext = !matchesCurrent && nextLocation ? aliases.some((alias) => nextLocation.includes(alias)) : false;

      if (!matchesCurrent && !matchesNext) {
        return null;
      }

      const block = matchesCurrent ? prof.actual : prof.siguiente;

      return {
        id: prof.id,
        nombre: prof.nombre,
        departamento: prof.departamento,
        estado: matchesCurrent ? 'En actividad' : 'Próxima actividad',
        actividad: block?.actividad ?? 'Actividad programada',
        horario: block ? `${block.inicio} – ${block.fin}` : '',
        ubicacion: block?.ubicacion ?? '',
        isCurrent: matchesCurrent
      };
    })
    .filter(Boolean);
});

const markerStyle = (area) => ({
  top: `calc(${area.position.top}% - 18px)`,
  left: `calc(${area.position.left}% - 18px)`,
  '--marker-color': area.color
});

const selectArea = (area) => {
  selectedAreaId.value = area.id;
};

const handleImageError = () => {
  hasImageError.value = true;
};

const imageSource = computed(() => (hasImageError.value ? fallbackImage : mapImagePath));
</script>

<style scoped>
.map-marker {
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  border: 2px solid rgba(255, 255, 255, 0.9);
  background: var(--marker-color, #1d1d1b);
  color: #1d1d1b;
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 35px rgba(17, 24, 39, 0.22);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.map-marker--active {
  transform: translateY(-2px) scale(1.12);
  box-shadow: 0 28px 45px rgba(17, 24, 39, 0.28);
}

.map-marker--live::after,
.map-marker--upcoming::after {
  content: '';
  position: absolute;
  inset: -10px;
  border-radius: 9999px;
  border: 2px solid rgba(255, 255, 255, 0.32);
  opacity: 0;
  transform: scale(0.9);
  animation: markerPulse 2.4s infinite;
}

.map-marker--live::after {
  background: rgba(255, 198, 0, 0.2);
}

.map-marker--upcoming::after {
  background: rgba(16, 185, 129, 0.18);
}

.map-marker--live {
  color: #1d1d1b;
}

.map-marker--upcoming {
  background: #34d399;
  color: #064e3b;
}

@keyframes markerPulse {
  0% {
    opacity: 0.6;
    transform: scale(0.6);
  }
  70% {
    opacity: 0;
    transform: scale(1.3);
  }
  100% {
    opacity: 0;
    transform: scale(1.35);
  }
}

.marker-enter-active,
.marker-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.marker-enter-from,
.marker-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
