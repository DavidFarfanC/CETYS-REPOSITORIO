# Teacher Tracker CETYS

Interfaz web en Vue 3 para consultar, en tiempo real, la ubicación y actividad de profesores del Campus CETYS Universidad Tijuana. El proyecto combina animaciones tipo Apple, datos en Firebase y un dashboard dinámico para búsqueda y exploración de horarios.

## ✨ Características

- **Diseño minimalista** inspirado en Apple/Tesla con microinteracciones, transiciones suaves y modo oscuro.
- **Dashboard en vivo** con tarjetas dinámicas, indicadores de actividad y filtros por nombre o departamento.
- **Sincronización periódica**: actualiza automáticamente cada minuto y permite refresh manual.
- **Vista detallada** con horario semanal completo y modal animado para cada profesor.
- **Mapa interactivo del campus** con marcadores inteligentes y asociación a horarios activos.
- **Integración con Firebase** (Firestore) mediante VueFire. Incluye datos de ejemplo para desarrollo offline.

## 🧱 Stack

- [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) para estilos
- [GSAP](https://greensock.com/gsap/) para animaciones
- [Firebase](https://firebase.google.com/) (Firestore) + [VueFire](https://vuefire.vuejs.org/)
- [day.js](https://day.js.org/) para manejo de fechas
- [Heroicons](https://heroicons.com/) para iconografía

## 🚀 Primeros pasos

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

> **Nota:** El repositorio incluye datos de ejemplo (`src/assets/data/professors.json`) por lo que puedes explorar la UI sin configurar Firebase de inmediato.

## 🔑 Variables de entorno

Crea un archivo `.env` en la raíz con las credenciales de tu proyecto Firebase:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:xxxxxxxxxxxxxx
```

El archivo `src/services/firebase.js` inicializa la app con estos valores. Si alguna variable falta, se usan credenciales de demostración junto a los datos mock para evitar errores durante el desarrollo.

## 🗄️ Estructura de Firestore

Colección sugerida: `profesores`

```json
{
  "profesores": {
    "juan_ramirez": {
      "nombre": "Dr. Juan Ramírez",
      "departamento": "Física",
      "avatar": "https://...",
      "horarios": [
        { "dia": "Lunes", "inicio": "08:00", "fin": "09:30", "ubicacion": "A-203", "actividad": "Clase de Física I" },
        { "dia": "Lunes", "inicio": "10:00", "fin": "11:00", "ubicacion": "Oficina D-12", "actividad": "Asesorías" }
      ]
    }
  }
}
```

Cada documento representa a un profesor y su horario semanal. El sistema usa el día y hora actuales para determinar actividad, ubicación y estado visual (clase, laboratorio, asesoría, etc.).

## 🧭 Arquitectura de carpetas destacada

- `src/App.vue`: layout base con transiciones globales.
- `src/views/HomeView.vue`: landing con hero animado y tarjetas de spotlight.
- `src/views/DashboardView.vue`: dashboard principal, filtros y métricas.
- `src/components/ProfessorCard.vue`: tarjeta animada con estado actual.
- `src/components/ProfessorDetailModal.vue`: modal con detalle semanal.
- `src/views/MapView.vue`: vista dedicada al mapa interactivo del campus.
- `src/components/CampusMap.vue`: mapa interactivo con marcadores, filtros y vínculo a horarios activos.
- `src/composables/useSchedule.js`: lógica para sincronización (Firestore + mock) y cálculo de actividades.

## 🗺️ Plano del campus

- Coloca la imagen oficial del plano de CETYS Tijuana en `public/campus-map.jpg` (formato JPG o PNG).
- El componente `CampusMap.vue` detectará el archivo automáticamente; si no existe, mostrará un fallback ilustrativo.
- Puedes editar los puntos (`campusAreasData`) en `src/components/CampusMap.vue` para alinear los marcadores con tus ubicaciones personalizadas.

## 🧪 Recomendaciones de testing/manual QA

- Verifica el cálculo de horarios cambiando manualmente la hora del sistema o ajustando los datos de ejemplo.
- Conecta la app a tu instancia Firebase y confirma que se reflejen los cambios en menos de un minuto.
- Revisa la responsividad en dispositivos móviles (breakpoints Tailwind).
- Añade pruebas end-to-end (ej. Cypress) si necesitas validar flujos en un despliegue productivo.

## 📦 Despliegue sugerido

- **Firebase Hosting:** integra el CLI de Firebase y ejecuta `npm run build` seguido de `firebase deploy`.
- **Vercel:** enlaza el repositorio, define variables de entorno y usa el script de build por defecto (`vite build`).

---

By Kamila García — diseño e interacción centrados en estudiantes CETYS.
