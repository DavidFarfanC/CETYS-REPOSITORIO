# Teacher Tracker CETYS

Aplicación web en Vue 3 para conocer en tiempo real la disponibilidad y ubicación de profesores del Campus CETYS Universidad Tijuana. La UI consume un API propia (que a su vez puede leer de Firebase) y presenta un dashboard, mapa y vistas detalladas con una experiencia tipo Apple/Tesla.

## Objetivo
- Dar a estudiantes y staff una vista rápida de dónde está cada profesor y qué actividad tiene en curso.
- Centralizar la consulta en un API para que los datos se actualicen por semestre sin tocar el frontend.
- Evitar pooling agresivo en el cliente: sólo se consulta bajo demanda (botón “Actualizar” o al entrar a las vistas).

## Arquitectura propuesta
- **Frontend:** Vue 3 + Vite, TailwindCSS para estilos, GSAP para animaciones, Heroicons para iconos.
- **Estado y lógica horaria:** `src/composables/useSchedule.js` obtiene los profesores desde el API, normaliza horarios con dayjs y calcula:
  - Estado actual (en clase/lab/oficina/asesoría/ disponible) y estilos asociados.
  - Bloque siguiente y contador de activos.
- **UI:** vistas para landing (`HomeView`), dashboard con filtros y modal (`DashboardView`), mapa (`MapView` + `CampusMap`), y detalle por profesor (`ProfessorView`).
- **Datos:** API REST externa que lee la colección `profesores` de tu backend/Firebase. El frontend sólo necesita los endpoints y un `VITE_API_BASE_URL`.
- **Fallback local:** `src/assets/data/professors.json` se usa automáticamente si el API falla o aún no está disponible.

## Flujo de comunicación
1. El cliente lee `VITE_API_BASE_URL` y ejecuta `GET /profesores` al montar las vistas que usan `useSchedule`.
2. La respuesta se enriquece en el cliente (cálculo de estado, actividad en curso y próxima).
3. El botón “Actualizar ahora” vuelve a consultar el API; no hay intervalos de 60 s.
4. `ProfessorView` y el mapa comparten el mismo estado en memoria, evitando consultas duplicadas.

## API esperada (ejemplo)
Base URL definida en `VITE_API_BASE_URL` (por defecto `http://localhost:8787`).

- `GET /profesores` → lista de profesores
  ```json
  [
    {
      "id": "juan_ramirez",
      "nombre": "Dr. Juan Ramírez",
      "departamento": "Física",
      "avatar": "https://...",
      "horarios": [
        { "dia": "Lunes", "inicio": "08:00", "fin": "09:30", "ubicacion": "A-203", "actividad": "Clase de Física I" },
        { "dia": "Lunes", "inicio": "10:00", "fin": "11:00", "ubicacion": "Oficina D-12", "actividad": "Asesorías" }
      ]
    }
  ]
  ```
- `GET /profesores/:id` → detalle individual (misma forma del elemento anterior).

El backend puede montar estos endpoints directamente sobre Firestore/Realtime DB y exponerlos al frontend.

## Configuración rápida
1) Crear `.env` en la raíz:
```env
VITE_API_BASE_URL=http://localhost:8787
```
2) Instalar y correr:
```bash
npm install
npm run dev
```
3) Opcional: coloca `public/campus-map.jpg` para mostrar el plano oficial; de lo contrario se usa un SVG de respaldo.

## Estructura destacada
- `src/main.js`: bootstrap Vue + router.
- `src/composables/useSchedule.js`: consultas al API, enriquecimiento y estados derivados.
- `src/views/DashboardView.vue`: búsqueda, filtros y tarjetas de profesores.
- `src/components/ProfessorCard.vue` y `ProfessorDetailModal.vue`: UI de profesor.
- `src/components/CampusMap.vue`: mapa con marcadores y vinculación a horarios activos.

## Testing y QA manual
- Verifica que `GET /profesores` responde y que el botón “Actualizar ahora” refleja cambios.
- Cambia la hora del sistema o los datos mock para validar el cálculo de estado actual/próximo.
- Revisa responsividad (breakpoints Tailwind) y carga de la imagen del mapa.

---

By Kamila García — diseño e interacción centrados en estudiantes CETYS.
