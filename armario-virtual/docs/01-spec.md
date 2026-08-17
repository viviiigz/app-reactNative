# 01 - Especificación: Armario Virtual (MVP)

## 1. Objetivo General
Prototipo de aplicación móvil para gestionar ropa y crear combinaciones (outfits). Diseñado para una experiencia rápida e intuitiva, similar a un tablero de inspiración.

## 2. Reglas de Negocio (Core)
* **Datos y Persistencia:** El sistema simulará llamadas de red (1.5s de latencia) mediante Mocks. La persistencia real de los datos en el dispositivo se logrará utilizando `AsyncStorage`.
* **Regla de Outfits:** Un "Outfit" es una agrupación con un nombre propio. Debe contener obligatoriamente un mínimo de 3 prendas.

## 3. Especificaciones UI/UX (Estilo Premium)
* **Estética:** "Soft/Glow UI" (rosa pastel, lavanda y blanco puro), bordes ultra redondeados y sombras coloreadas.

## 4. Flujo de Interfaz de Usuario (Pantallas)
1. **Home:** 3 Botones (Ver Outfits, Ver Prendas, Agregar Prenda).
2. **Catálogo (`/prendas`):** Pestañas (Todos, Superior, Inferior, Calzado, Accesorio) y Buscador.
3. **Detalle (`/prendas/[id]`):** Vista enfocada en la prenda.
4. **Formulario (`/prendas/formulario`):** Carga y edición de prendas.
5. **Mis Outfits (`/outfits`):** Listado de conjuntos.