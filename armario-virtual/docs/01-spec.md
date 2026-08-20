# 01 - Especificación: Armario Virtual (MVP)

## 1. Objetivo General
Desarrollar el prototipo funcional de una aplicación móvil orientada a la gestión inteligente de prendas y la creación de combinaciones (outfits). La aplicación está diseñada bajo el paradigma "UI First", buscando ofrecer una experiencia de usuario inmersiva, rápida y visualmente atractiva, estructurando la información mediante un sistema de colecciones similar a un tablero de inspiración (estilo Pinterest).

## 2. Arquitectura de Datos y Reglas de Negocio (Core)
El sistema opera sobre un modelo relacional de tres entidades principales:
* **Prendas:** Unidades individuales del catálogo (Ropa, Calzado, Accesorios).
* **Álbumes (Colecciones):** Carpetas creadas por el usuario para categorizar conjuntos (ej. "Verano 2026", "Look Facultad").
* **Looks (Outfits):** Combinaciones específicas de prendas guardadas dentro de un Álbum.

**Reglas Estrictas de Negocio:**
* **Validación de Looks:** Para que el sistema permita guardar un Look, este debe poseer obligatoriamente un nombre asignado y estar compuesto por un **mínimo de 3 prendas**.
* **Gestión de Portadas:** Un Look puede tener una foto de portada personalizada. Si el usuario no la provee, el sistema ejecuta una lógica de *fallback* asignando automáticamente la imagen de la primera prenda seleccionada.
* **Borrado en Cascada:** Al eliminar un Álbum, la capa de datos elimina automáticamente todos los Looks asociados a dicho álbum.

**Gestión de Estado y Persistencia:**
* **Fase Actual:** El sistema simula la latencia de red (1.5s) consumiendo datos desde servicios Mockeados en memoria, hidratando las vistas dinámicamente mediante `useFocusEffect`.
* **Fase Siguiente:** La orquestación asíncrona está preparada para conectarse a un almacenamiento persistente local utilizando `AsyncStorage`.

## 3. Especificaciones UI/UX (Diseño y Estética)
La aplicación implementa un sistema de diseño propio basado en la tendencia **"Soft/Glow UI"**, priorizando la legibilidad y la experiencia táctil fluida.
* **Paleta Cromática Centralizada:** Dominancia de blanco puro para las superficies, complementado con acentos en tonos pastel (Rosa Fuerte, Rosa Pastel, Lavanda Fuerte).
* **Morfología:** Radios de borde agresivos (`borderRadius: 24+`) en tarjetas y botones para un aspecto orgánico y moderno.
* **Profundidad y Elevación:** Sustitución de sombras negras convencionales por sombras expansivas coloreadas (Glow) que generan un efecto de "flotación" en los elementos interactivos.
* **Micro-interacciones:** Retroalimentación visual inmediata mediante el uso de `react-native-reanimated` en renderizados y pulsaciones de botones.

## 4. Estructura de Navegación Jerárquica (Expo Router)
La navegación se ha diseñado evitando colisiones dinámicas, separando claramente las rutas de listado y detalle:

1.  **`/` (Inicio):** Panel de bienvenida con accesos directos al Catálogo y al Armario.
2.  **Módulo Prendas:**
    * `/prendas`: Catálogo general con sistema de pestañas (Todos, Superior, Inferior, Calzado, Accesorio) y barra de búsqueda en tiempo real.
    * `/prendas/formulario`: Componente presentacional para el alta y edición de indumentaria.
    * `/prendas/[id]`: Vista de detalle individual de la prenda.
3.  **Módulo Outfits (Colecciones):**
    * `/outfits`: Pantalla raíz que lista los Álbumes creados (sin exponer contenido interno). Incluye Modal Soft UI para creación de colecciones.
    * `/outfits/album/[albumId]`: Vista interna de la colección. Lista tarjetas full-width de Looks, mostrando la `imagenPortada` y una previsualización (thumbnails) de las prendas involucradas.
    * `/outfits/crear`: Interfaz interactiva de selección múltiple con contador de validación en tiempo real.
    * `/outfits/look/[lookId]`: Vista inmersiva del Look individual, presentando un *Hero Header* y el desglose de la indumentaria utilizada.