Actúa como un Lead Project Manager. Ahora necesito que redactes el tercer y último documento fundacional de nuestro proyecto: `docs/03-tasks.md`.

Este archivo debe contener el plan de ejecución técnico (Checklist) organizado en 5 fases lógicas, reflejando nuestra arquitectura SDD, el uso de AsyncStorage, la separación de estilos y la navegación libre de colisiones. 

Marca con `[x]` las tareas de las Fases 1, 2 y 4 (que ya hemos completado visualmente) y deja con `[ ]` o en progreso las fases de refactorización profunda y el módulo complejo de Outfits.

Por favor, entrégame únicamente el código Markdown listo para copiar y pegar, respetando esta estructura exacta:

# 03 - Tareas de Desarrollo (Plan de Ejecución)

## Fase 1: Setup y Arquitectura Base (UI/UX)
- [x] **Tarea 1.1:** Configurar enrutamiento base con `expo-router` (ocultar headers nativos).
- [x] **Tarea 1.2:** Crear diccionario de diseño en `src/theme/tema.js` (Estética Soft/Glow UI).
- [x] **Tarea 1.3:** Construir componentes globales y reutilizables (`Cargando`, `EstadoVacio`, `PrendaCard`).
- [x] **Tarea 1.4:** Maquetar pantalla de Inicio (`/index.jsx`) con animaciones responsivas.

## Fase 2: Capa de Datos y Persistencia (Storage)
- [x] **Tarea 2.1:** Implementar `src/utils/storage.js` como wrapper asíncrono para `AsyncStorage`.
- [x] **Tarea 2.2:** Crear `src/mocks/mockPrendas.js` con latencia simulada y fallback a almacenamiento local.
- [x] **Tarea 2.3:** Crear `src/mocks/mockOutfits.js` estructurando el modelo relacional (Álbumes -> Looks -> Prendas).

## Fase 3: Lógica de Negocio y Hooks (Separation of Concerns)
- [ ] **Tarea 3.1:** Centralizar reglas de negocio en `src/utils/validaciones.js` (Ej: Obligatorio mínimo 3 prendas por Look).
- [ ] **Tarea 3.2:** Implementar Custom Hooks orquestadores (`usePrendas`, `useOutfits`) usando `useCallback` y `useMemo`.
- [ ] **Tarea 3.3:** Extraer objetos `StyleSheet` de las vistas pesadas hacia archivos `.styles.js` dedicados.

## Fase 4: Módulo de Indumentaria (Prendas)
- [x] **Tarea 4.1:** Desarrollar catálogo interactivo (`app/prendas/index.jsx`) con sistema de filtrado por pestañas y buscador.
- [x] **Tarea 4.2:** Desarrollar vista de detalle de prenda (`app/prendas/[id].jsx`).
- [x] **Tarea 4.3:** Desarrollar formulario de alta/edición (`app/prendas/formulario.jsx`) integrando `expo-image-picker`.

## Fase 5: Módulo de Colecciones (Outfits estilo Pinterest)
- [ ] **Tarea 5.1:** Desarrollar vista raíz de Álbumes (`app/outfits/index.jsx`) con Modal Soft UI para creación de carpetas.
- [ ] **Tarea 5.2:** Desarrollar vista de Colección (`app/outfits/album/[albumId].jsx`) con tarjetas full-width y previsualización de miniaturas (thumbnails).
- [ ] **Tarea 5.3:** Construir creador interactivo de Looks (`app/outfits/crear.jsx`) con validación en tiempo real del estado de selección (mínimo 3).
- [ ] **Tarea 5.4:** Desarrollar vista inmersiva de detalle del Look (`app/outfits/look/[lookId].jsx`) con Hero Header dinámico (foto de portada o fallback a la primera prenda).