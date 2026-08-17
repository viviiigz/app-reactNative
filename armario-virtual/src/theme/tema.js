// src/theme/tema.js
// -----------------------------------------------------------------------------
// Tokens de diseño de la app (fuente única de verdad para el estilo).
// Toda pantalla/componente importa de acá; NO se hardcodean colores ni
// espaciados sueltos. Si mañana cambia la identidad visual, se toca solo esto.
// -----------------------------------------------------------------------------

// Paleta de colores. Tonos cálidos y sobrios, pensados para una app de armario.
export const colores = {
  fondo: '#F5F3EF', // fondo general de las pantallas (crema suave)
  superficie: '#FFFFFF', // tarjetas, inputs, contenedores elevados
  primario: '#f692ba', // color de marca (verde salvia) para botones/acentos
  primarioOscuro: '#be557f', // estados presionados / títulos fuertes
  secundario: '#f5cde5', // acento dorado para detalles y badges
  borde: '#E4E0D8', // bordes de inputs y separadores
  error: '#C0392B', // mensajes de validación
  exito: '#2E7D32', // confirmaciones (ej: "prenda guardada")
  blancoPuro: '#FFFFFF',
  rosaPastel: '#FBDCE5',
  rosaFuerte: '#F48FB1',
  lavanda: '#E7E0FA',
  lavandaFuerte: '#B39DDB',
  texto: '#4A4458',
  textoSuave: '#9A94A8',
  rojoSuave: '#ed7171', // fondo pastel del botón "Eliminar"
};

// Escala de espaciados (en px). Usar SIEMPRE estos valores para márgenes y
// paddings, así el ritmo visual queda consistente en toda la app.
export const espaciado = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Radios de borde para tarjetas, botones e inputs.
export const radios = {
  sm: 6,
  md: 12,
  lg: 20,
  circular: 999, // para avatares o botones redondos
};

// Tokens de tipografía (tamaños y grosores).
export const tipografia = {
  titulo: { tamano: 24, grosor: '700' },
  subtitulo: { tamano: 18, grosor: '600' },
  cuerpo: { tamano: 15, grosor: '400' },
  etiqueta: { tamano: 13, grosor: '500' },
};
// Helper para generar una sombra "glow" coloreada a partir de un color.
export const crearGlow = (color) => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.35,
  shadowRadius: 16,
  elevation: 8,
});


// Export agrupado por comodidad: permite `import { tema } from '...'`
// y usar tema.colores.primario, tema.espaciado.md, etc.
export const tema = { colores, espaciado, radios, tipografia, crearGlow };

export default tema;