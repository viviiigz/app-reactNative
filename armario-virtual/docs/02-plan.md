# 02 - Plan Técnico y Arquitectura

## 1. Tecnologías
* **Framework:** React Native + Expo SDK 54
* **Ruteo:** `expo-router` (File-based routing)
* **Estilos:** `StyleSheet.create()` + Expo Vector Icons
* **Almacenamiento:** `AsyncStorage` (para futura persistencia)

## 2. Árbol de Directorios Estricto
armario-virtual/
├── docs/ 
│   ├── 01-spec.md 
│   ├── 02-plan.md 
│   └── 03-tasks.md 
├── app/ 
│   ├── _layout.jsx 
│   ├── index.jsx 
│   ├── prendas/
│   │   ├── index.jsx 
│   │   ├── [id].jsx 
│   │   └── formulario.jsx 
│   └── outfits/
│       ├── index.jsx         # Listado de carpetas de outfits
│       ├── crear.jsx         # Pantalla interactiva para armar el outfit
│       └── [id].jsx          # Detalle del outfit armado
└── src/ 
    ├── components/Cargando, EstadoVacio
    ├── features/prendas
                /components: UI específica (PrendaCard)
                /hooks
    ├── mocks/ 
    │   ├── mockPrendas.js 
    │   └── mockOutfits.js    
    ├── theme/ 
    └── utils/