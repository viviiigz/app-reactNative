
# 02 - Plan Técnico y Arquitectura

## 1. Tecnologías
* **Framework:** React Native + Expo SDK 54
* **Ruteo:** `expo-router` (File-based routing)
* **Estilos:** `StyleSheet.create()` + Expo Vector Icons
* **Almacenamiento:** `AsyncStorage` (para futura persistencia, actualmente usando mocks en memoria)
* **Animaciones:** `react-native-reanimated`

## 2. Árbol de Directorios Estricto
Representa este árbol exacto usando caracteres ASCII/Unicode de árbol de directorios:
armario-virtual/
├── docs/ (01-spec.md, 02-plan.md, 03-tasks.md)
├── app/ 
│   ├── _layout.jsx 
│   ├── index.jsx 
│   ├── outfits/
│   │   ├── index.jsx (Vista raíz de álbumes, con botón de crear)
│   │   ├── crear.jsx (Formulario para crear un look)
│   │   ├── album/
│   │   │   └── [albumId].jsx (Vista de los looks dentro de un álbum)
│   │   └── look/
│   │       └── [lookId].jsx (Detalle individual de un look)
│   └── prendas/
│       ├── index.jsx 
│       ├── [id].jsx 
│       └── formulario.jsx 
└── src/ 
    ├── components/ (Cargando, EstadoVacio)
    ├── features/
    │   └── prendas/
    │       ├── components/ (UI específica como PrendaCard)
    │       └── hooks/
    ├── mocks/ (mockPrendas.js, mockOutfits.js)
    ├── theme/ (tema.js)
    └── utils/

## 3. Patrones de Arquitectura
- **UI First & Soft/Glow UI:** Desarrollo enfocado en la fidelidad visual antes de la lógica dura, utilizando variables centralizadas desde `src/theme/tema.js`.
- **Ruteo Jerárquico Seguro:** Separación estricta de rutas dinámicas ( `/album/[id]` vs `/look/[id]` ) para evitar colisiones en `expo-router`.
- **Separation of Concerns (En progreso):** Transición gradual hacia la extracción de lógica de las vistas hacia la carpeta `utils` y el manejo de estado hacia Custom Hooks.

