# Teacher Tracker CETYS

Landing, dashboard y mapa interactivo en Vue 3/Tailwind para saber dónde están los profesores del Campus CETYS Universidad Tijuana. La aplicación es 100% frontend y lee un único archivo JSON estático con los profesores; no hay backend, Firebase ni APIs externas.

## Arquitectura (estática)
- **Frontend:** Vue 3 + Vite, TailwindCSS, GSAP y Heroicons.
- **Datos:** `public/data/profesores.json` servido directamente por Vite/Vercel.
- **Lógica:** `src/composables/useSchedule.js` hace `fetch('/data/profesores.json')`, calcula el bloque actual/próximo con dayjs y enriquece cada profesor con estados y estilos.
- **UI:** vistas para landing (`HomeView`), dashboard con filtros y modal (`DashboardView`), mapa (`MapView` + `CampusMap`) y detalle (`ProfessorView`).

## Archivo `public/data/profesores.json`
El JSON es un **array** de profesores. Cada profesor debe incluir exactamente:
```json
{
  "id": "juan_ramirez",
  "nombre": "Dr. Juan Ramírez",
  "departamento": "Física",
  "avatar": "https://res.cloudinary.com/.../juan.png",
  "ubicacion_actual": "Aula A-203",
  "estado": "en_clase",
  "horarios": [
    { "dia": "Lunes", "inicio": "08:00", "fin": "09:30", "ubicacion": "A-203", "actividad": "Física I" },
    { "dia": "Lunes", "inicio": "10:00", "fin": "11:00", "ubicacion": "D-12", "actividad": "Asesorías" }
  ]
}
```
Valores válidos para `estado`: `en_clase`, `oficina`, `asesoria`, `disponible`.

### Ejemplo incluido
Se incluye un ejemplo listo en `public/data/profesores.json` con 3 profesores (avatars en Cloudinary).

### Cómo actualizar cada semestre
1. Abre `public/data/profesores.json`.
2. Agrega/edita profesores siguiendo la estructura anterior.
3. Guarda y despliega: el frontend los leerá automáticamente al cargar.

### Cómo añadir más profesores
Duplica un objeto, cambia `id` (único), nombre, departamento, avatar, `ubicacion_actual`, `estado` y los bloques de `horarios`.

## Estructura mínima del proyecto
- `src/main.js`: arranque de Vue + router.
- `src/composables/useSchedule.js`: carga del JSON local y cálculo de horarios.
- `src/views/*`: páginas (Home, Dashboard, Map, Professor).
- `src/components/*`: header, tarjetas, modal y mapa.
- `public/data/profesores.json`: fuente de datos única.
- `public/campus-map.jpg` (opcional): plano oficial del campus; si no existe, se usa un SVG de respaldo.

## Uso local
```bash
npm install
npm run dev
```
Abrir `http://localhost:5173` y verificar que el dashboard muestra los profesores del JSON.

## Deploy en Vercel
1. Conecta el repo en Vercel.
2. Build command: `npm run build`. Output: `dist`.
3. El archivo `public/data/profesores.json` se sirve tal cual; actualízalo y vuelve a desplegar para cambios de semestre.

## Notas
- No existe backend, Firebase ni variables de entorno.
- El botón “Actualizar ahora” vuelve a leer el JSON local (sin pooling cada minuto).

---

By Kamila García — diseño e interacción centrados en estudiantes CETYS.
