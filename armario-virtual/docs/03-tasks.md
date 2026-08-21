# 03 - Tareas de Desarrollo (Plan de Ejecución)

## Fase 1: Setup y Arquitectura Base (UI/UX)
- [x] **Tarea 1.1:** Configurar enrutamiento base con `expo-router` (ocultar header nativo en el Home inmersivo).
- [x] **Tarea 1.2:** Crear diccionario de diseño en `src/theme/tema.js` (Estética Soft/Glow UI).
- [x] **Tarea 1.3:** Construir componentes globales y reutilizables (`Cargando`, `EstadoVacio`, `PrendaCard`).
- [x] **Tarea 1.4:** Maquetar pantalla de Inicio (`app/index.jsx`) con animaciones responsivas (`react-native-reanimated`).

## Fase 2: Capa de Datos Simulada (Mocks)
- [x] **Tarea 2.1:** Crear `src/mocks/mockPrendas.js` con datos y funciones asíncronas (latencia simulada de 1.5s con Promesas).
- [x] **Tarea 2.2:** Crear `src/mocks/mockOutfits.js` estructurando el modelo relacional (Álbumes → Looks → Prendas por ID).
- [x] **Tarea 2.3:** Normalizar el manejo de imágenes (`normalizarFuente`) para soportar `require()` locales y `uri` de cámara/galería.

## Fase 3: Módulo de Indumentaria (Prendas)
- [x] **Tarea 3.1:** Desarrollar catálogo interactivo (`app/prendas/index.jsx`) con filtrado por pestañas y buscador.
- [x] **Tarea 3.2:** Desarrollar vista de detalle de prenda (`app/prendas/[id].jsx`).
- [x] **Tarea 3.3:** Desarrollar formulario de alta/edición (`app/prendas/formulario.jsx`) integrando `expo-image-picker`.

## Fase 4: Módulo de Colecciones (Outfits estilo Pinterest)
- [x] **Tarea 4.1:** Desarrollar vista raíz de Álbumes (`app/outfits/index.jsx`) con Modal Soft UI para crear carpetas (con portada opcional).
- [x] **Tarea 4.2:** Resolver colisión de rutas dinámicas reorganizando en subcarpetas (`app/outfits/album/[albumId]` y `app/outfits/look/[lookId]`).
- [x] **Tarea 4.3:** Desarrollar vista de Colección (`app/outfits/album/[albumId].jsx`) con tarjetas full-width y miniaturas de prendas.
- [x] **Tarea 4.4:** Construir creador interactivo de Looks (`app/outfits/crear.jsx`) con validación en tiempo real (mínimo 3 prendas).
- [x] **Tarea 4.5:** Desarrollar vista de detalle del Look (`app/outfits/look/[lookId].jsx`) con Hero Header (portada o fallback a la primera prenda).

## Fase 5: Refactorización Profunda y Persistencia (Deuda Técnica)
- [x] **Tarea 5.1:** Centralizar reglas de negocio en `src/utils/validaciones.js` (`validarLook`: nombre no vacío + mínimo 3 prendas).
- [x] **Tarea 5.2:** Implementar Custom Hook orquestador (`useOutfits`) usando `useCallback` en mutaciones y `useMemo` en cálculos derivados.
- [x] **Tarea 5.3:** Extraer objetos `StyleSheet` a archivos `.styles.js` como fábrica `crearEstilos(tema)`.
- [x] **Tarea 5.4:** Implementar tema dinámico con Context (`ProveedorTema`, `useTheme`) para soportar modo claro/oscuro.
- [x] **Tarea 5.5:** Migrar la persistencia a `AsyncStorage` dentro de los mocks, manteniendo la misma interfaz (claves `armario:*`, `JSON.stringify`/`parse`) sin tocar las vistas.
- [ ] **Tarea 5.6:** Completar la migración de estilos `.styles.js` + `useTheme` en las pantallas restantes.*