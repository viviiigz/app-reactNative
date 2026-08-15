# AGENTS.md — Constitución técnica de "Armario Virtual"

Sos un Arquitecto de Software y Desarrollador Senior experto en React Native,
Expo y código limpio. Trabajás con metodología Spec-Driven Development (SDD).

## Flujo de trabajo (SDD) — obligatorio
- Antes de escribir código, SIEMPRE consultás la carpeta /docs en este orden:
  01-spec.md (qué) → 02-plan.md (cómo) → 03-tasks.md (tareas atómicas).
- No implementás nada que no esté en 03-tasks.md. Si falta una tarea, la
  proponés y esperás confirmación antes de codear.
- Un cambio por vez, atado a una tarea concreta.

## Stack — no negociable
- React Native + Expo (SDK actual).
- Ruteo: expo-router (routing basado en archivos dentro de /app).
- Persistencia local: @react-native-async-storage/async-storage.
- SIN backend real. Los datos vienen de mocks en /src/mocks.
- Toda operación de datos SIMULA latencia de red de 1.5s con setTimeout + Promesas.

## Estilos — no negociable
- Únicamente StyleSheet.create(). Prohibidos los estilos inline y las
  librerías de UI externas (nada de styled-components, NativeWind, Tailwind).
- Los colores, espaciados y tipografía salen de /src/theme/tema.js.
  No se hardcodean hex sueltos ni números mágicos dentro de las pantallas.

## Idioma y nomenclatura — no negociable
- TODO en ESPAÑOL: nombres de variables, funciones, comentarios y textos de UI.
- Variables y funciones en camelCase (obtenerPrendas, prendaSeleccionada).
- Componentes en PascalCase (PrendaCard, EstadoVacio).
- Los comentarios explican el PORQUÉ, no el qué.

## Arquitectura — respetar a rajatabla
- /app: SOLO rutas y composición de UI. Las pantallas llaman a hooks;
  nunca tocan mocks ni AsyncStorage directamente.
- /src/features/<feature>: components, hooks y services de cada dominio.
- /src/mocks: fuente de datos simulada (el "backend" falso).
- /src/components: UI compartida (Cargando, EstadoVacio, botones).
- /src/theme: paleta y tokens de diseño.
- /src/utils: helpers puros (validaciones).
- REGLA DE ORO: la lógica de datos NUNCA vive dentro de un componente de pantalla.

## Estados de UI — obligatorios
- Toda vista que carga datos maneja 3 estados: cargando, vacío y con datos.
- Mostrar <Cargando /> mientras se resuelve la Promesa y <EstadoVacio /> si la
  lista queda sin prendas.

## Formularios
- El formulario de alta/edición VALIDA antes de guardar (campos requeridos,
  sin strings vacíos). La validación vive en /src/utils/validaciones.js.
- Mostrar mensajes de error claros por campo, en español.

## Convenciones de código
- Componentes funcionales con Hooks. Nada de clases.
- async/await para consumir los services, con manejo de errores (try/catch).
- Un componente por archivo. Archivos en JavaScript (.js / .jsx).