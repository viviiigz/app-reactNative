# 03 - Tareas de Desarrollo

- [x] **Tarea 1 - Cimientos UI/UX:** Crear tema y mocks.
- [x] **Tarea 2 - Enrutador Inmersivo:** Configurar Stack y ocultar header.
- [x] **Tarea 3 - Componentes Globales:** Construir Cargando, EstadoVacio y PrendaCard.
- [x] **Tarea 4 - Home Interactivo:** Armar inicio con animaciones y diseño responsivo.
- [x] **Tarea 5 - Funcionalidad de Prendas:** Armar catálogo, detalle y formulario con filtros estrictos y cámara.
- [ ] **Tarea 6 - Lógica de Outfits (Mock):** Crear `src/mocks/mockOutfits.js` para gestionar los conjuntos.
- [ ] **Tarea 7 - Creador de Outfits:** Armar `app/outfits/crear.jsx` implementando la lógica de selección múltiple (obligatorio 3 prendas mínimo) y asignación de nombre.
- [ ] **Tarea 8 - Vista de Outfits:** Armar `app/outfits/index.jsx` (listado de carpetas) y `app/outfits/[id].jsx` (detalle visual del conjunto).

# 03 - Tareas de Desarrollo

- [x] **Tarea 1 a 5:** Cimientos UI, Enrutador base, Home y Vistas Visuales de Prendas completadas.
- [ ] **Tarea 6 - Refactorización de Arquitectura (Deuda Técnica):** Extraer lógica de las vistas hacia `src/features/prendas/hooks/usePrendas.js` y `src/utils/validaciones.js`. Aislar componentes `PrendaCard`, `Cargando` y `EstadoVacio`.
- [ ] **Tarea 7 - Persistencia Real:** Integrar `AsyncStorage` en el servicio de prendas para que los datos sobrevivan al reinicio de la app, conviviendo con el mock de latencia.
- [ ] **Tarea 8 - Outfits:** Desarrollar la lógica de selección interactiva (mínimo 3 prendas) y vistas de `/outfits`.