// src/utils/validaciones.js
// Lógica de validación PURA: funciones sin estado ni efectos, independientes
// del almacenamiento. Fáciles de testear y reutilizar.

// Mínimo de prendas que exige la regla de negocio para un look.
export const MINIMO_PRENDAS_LOOK = 3;

// Un nombre es válido si es un string con contenido real (no solo espacios).
export const nombreValido = (nombre) =>
  typeof nombre === 'string' && nombre.trim().length > 0;

// Regla estricta del look: nombre no vacío Y al menos 3 prendas seleccionadas.
export const validarLook = (nombre, prendasSeleccionadas = []) =>
  nombreValido(nombre) &&
  Array.isArray(prendasSeleccionadas) &&
  prendasSeleccionadas.length >= MINIMO_PRENDAS_LOOK;

// Regla del álbum: por ahora solo exige nombre.
export const validarAlbum = (nombre) => nombreValido(nombre);