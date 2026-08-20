// src/utils/imagenes.js
// Utilidad PURA para resolver la fuente de una imagen de <Image>.
// Convive require() (número en nativo, objeto en web), uri (string) y null.
export const normalizarFuente = (imagen) => {
  if (!imagen) return null;                       // null / undefined / '' → sin foto
  if (typeof imagen === 'string') return { uri: imagen }; // uri de cámara/galería
  return imagen;                                   // asset local de require()
};