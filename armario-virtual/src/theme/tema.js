// src/theme/tema.js
// Define los TOKENS de diseño. Los colores vienen en dos paletas (claro/oscuro);
// espaciado, radios y tipografía no dependen del modo. El Provider elige cuál
// paleta está activa. Se mantiene `colores` (claro) exportado para retrocompat
// con los archivos que todavía no migraron a useTheme.

// --- Tokens agnósticos al modo ---
export const espaciado = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radios = { sm: 10, md: 18, lg: 28, xl: 36, circular: 999 };
export const tipografia = {
  titulo: { tamano: 26, grosor: '700' },
  subtitulo: { tamano: 18, grosor: '600' },
  cuerpo: { tamano: 15, grosor: '400' },
  etiqueta: { tamano: 13, grosor: '500' },
};
export const crearGlow = (color) => ({
  shadowColor: color, shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
});

// --- Paleta MODO CLARO ---
export const coloresClaro = {
  base: '#FFF5F8', superficie: '#FFFFFF', blancoPuro: '#FFFFFF',
  rosaPastel: '#FBDCE5', rosaFuerte: '#F48FB1',
  lavanda: '#E7E0FA', lavandaFuerte: '#B39DDB',
  texto: '#4A4458', textoSuave: '#9A94A8',
  borde: '#F0E6EC', error: '#E57373', rojoSuave: '#FDECEC',
};

// --- Paleta MODO OSCURO ---
// Los acentos (rosaFuerte, lavandaFuerte, error) se mantienen para que el glow
// siga leyéndose; cambian fondos y textos.
export const coloresOscuro = {
  base: '#1C1922', superficie: '#272231', blancoPuro: '#FFFFFF',
  rosaPastel: '#3A2A33', rosaFuerte: '#F48FB1',
  lavanda: '#332C46', lavandaFuerte: '#B39DDB',
  texto: '#EDE9F2', textoSuave: '#9A94A8',
  borde: '#3A3446', error: '#E57373', rojoSuave: '#3A2626',
};

// --- Temas completos (lo que consume el Provider) ---
export const temaClaro = { modo: 'claro', colores: coloresClaro, espaciado, radios, tipografia, crearGlow };
export const temaOscuro = { modo: 'oscuro', colores: coloresOscuro, espaciado, radios, tipografia, crearGlow };

// --- Retrocompat: archivos aún no migrados siguen importando { colores } ---
export const colores = coloresClaro;
export const tema = temaClaro;
export default tema;