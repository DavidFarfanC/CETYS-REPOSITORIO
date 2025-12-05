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
            <TransitionGroup name="marker">
              <button
                v-for="marker in activeMarkers"
                :key="`prof-${marker.id}`"
                type="button"
                class="map-marker map-marker--live"
                :style="profMarkerStyle(marker)"
                :title="marker.profesor.nombre"
              >
                {{ marker.shorthand }}
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

const props = defineProps({
  profesoresActivos: {
    type: Array,
    default: () => []
  },
  profesores: {
    type: Array,
    default: () => []
  },
  selectedBuilding: {
    type: [String, null],
    default: null
  }
});

const mapImagePath = 'https://res.cloudinary.com/dvt59hfgg/image/upload/v1764879974/MAPA_B_uqpmyy.jpg';
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

const { professors: scheduleProfessors } = useSchedule();
const professors = computed(() =>
  props.profesores && props.profesores.length ? props.profesores : scheduleProfessors.value
);

const campusAreasData = [
  {
    id: "ed5",
    label: "Edificio 5",
    shorthand: "5",
    type: "Aulas",
    description: "Edificio de salones con clave 5***.",
    position: { top: 46, left: 13.2 },
    color: "#facc15",
    aliases: ["5", "5*", "50", "51", "52", "53", "54", "Salón 5", "Edificio 5"]
  },
  {
    id: "admi",
    label: "Administración",
    shorthand: "ADM",
    type: "Servicios",
    description: "Edificio administrativo del campus.",
    position: { top: 73, left: 19.9 },
    color: "#ea71e8ff",
    aliases: ["ADM", "Administración", "Oficinas"]
  },
  {
    id: "ed8",
    label: "Edificio 8",
    shorthand: "8",
    type: "Aulas",
    description: "Edificio de salones con clave 8***.",
    position: { top: 8.3, left: 62 },
    color: "#f87171",
    aliases: ["8", "8*", "80", "81", "Salón 8", "Edificio 8"]
  },
  {
    id: "posg",
    label: "Posgrados",
    shorthand: "POSG",
    type: "Aulas",
    description: "Edificio de posgrados (salones 7***).",
    position: { top: 20, left: 81 },
    color: "#fb923c",
    aliases: ["7", "7*", "70", "71", "POSG", "Posgrados", "Edificio 7"]
  },
  {
    id: "cece",
    label: "CECE",
    shorthand: "10",
    type: "Aulas",
    description: "Centro de Excelencia y Competitividad Empresarial (salones 10***).",
    position: { top: 53, left: 81.23 },
    color: "#60a5fa",
    aliases: ["10", "10*", "103", "CECE", "Edificio 10"]
  },
  {
    id: "e4",
    label: "Edificio 4",
    shorthand: "4",
    type: "Aulas",
    description: "Edificio de salones con clave 4***.",
    position: { top: 66, left: 74 },
    color: "#c084fc",
    aliases: ["4", "4*", "40", "41", "Edificio 4", "E4"]
  },
  {
    id: "lab",
    label: "Laboratorio de Ingeniería",
    shorthand: "LAB",
    type: "Laboratorios",
    description: "Laboratorios de ingeniería (salones 6***).",
    position: { top: 66, left: 85.3 },
    color: "#22d3ee",
    aliases: ["6", "6*", "60", "61", "LAB", "Laboratorio", "Edificio 6"]
  },
  {
    id: "ed3",
    label: "Edificio 3",
    shorthand: "3",
    type: "Aulas",
    description: "Edificio de salones con clave 3***.",
    position: { top: 87, left: 82 },
    color: "#fde047",
    aliases: ["3", "3*", "30", "31", "Edificio 3"]
  },
  {
    id: "cafe",
    label: "Cafetería Central",
    shorthand: "CAF",
    type: "Servicios",
    description: "Zona comercial y de alimentos.",
    position: { top: 42, left: 43 },
    color: "#0bc236ff",
    aliases: ["CAF", "Cafetería", "CAFE", "Food Court", "Comedor"]
  },
  {
    id: "biblio",
    label: "Biblioteca",
    shorthand: "BIB",
    type: "Servicios",
    description: "Centro de información y salas de estudio.",
    position: { top: 48, left: 60.5 },
    color: "#f28d3aff",
    aliases: ["BIB", "Biblioteca", "Centro de Información", "Biblio"]
  },
  {
    id: "ed9",
    label: "Edificio 9",
    shorthand: "9",
    type: "Aulas",
    description: "Edificio de salones y espacios amplios (9***).",
    position: { top: 82, left: 45 },
    color: "#fde047",
    aliases: ["9", "9*", "90", "91", "Edificio 9"]
  }
];

const matchesAlias = (aliases, target) => {
  if (!target) return false;
  const normalisedTarget = target.toLowerCase();
  return aliases.some((alias) => {
    const pattern = alias.toLowerCase();
    if (pattern.endsWith('*')) {
      return normalisedTarget.startsWith(pattern.slice(0, -1));
    }
    return normalisedTarget.includes(pattern);
  });
};

const activeMarkers = computed(() => {
  const activos =
    props.profesoresActivos && props.profesoresActivos.length
      ? props.profesoresActivos
      : professors.value.filter((p) => (p.estadoKey ? p.estadoKey === 'en_clase' : p.estado === 'en_clase'));

  return activos
    .map((prof) => {
      const ubicacion = prof.ubicacion_actual || prof.ubicacionActual || prof.actual?.ubicacion;
      if (!ubicacion) return null;
      const area = campusAreasData.find((a) => matchesAlias(a.aliases, ubicacion));
      if (!area) return null;
      return {
        id: prof.id,
        profesor: prof,
        position: area.position,
        shorthand: area.shorthand,
        color: '#F2C94C'
      };
    })
    .filter(Boolean);
});

const activeLocations = computed(() => {
  const set = new Set();
  professors.value.forEach((prof) => {
    if (prof.actual?.ubicacion) {
      set.add(prof.actual.ubicacion.toLowerCase());
    } else if (prof.ubicacionActual) {
      set.add(prof.ubicacionActual.toLowerCase());
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
      const currentFallback = prof.ubicacionActual?.toLowerCase();
      const matchesCurrent = currentLocation
        ? aliases.some((alias) => currentLocation.includes(alias))
        : currentFallback
          ? aliases.some((alias) => currentFallback.includes(alias))
          : false;
      const matchesNext = !matchesCurrent && nextLocation ? aliases.some((alias) => nextLocation.includes(alias)) : false;

      if (!matchesCurrent && !matchesNext) {
        return null;
      }

      const block = matchesCurrent ? prof.actual ?? { actividad: 'Ubicación actual', ubicacion: prof.ubicacionActual } : prof.siguiente;

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

const profMarkerStyle = (marker) => ({
  top: `calc(${marker.position.top}% - 18px)`,
  left: `calc(${marker.position.left}% - 18px)`,
  '--marker-color': marker.color ?? '#F2C94C'
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
//tiamo 