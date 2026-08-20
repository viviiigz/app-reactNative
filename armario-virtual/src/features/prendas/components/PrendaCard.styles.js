// src/features/prendas/components/PrendaCard.styles.js
// Fábrica de estilos de la tarjeta de prenda.
import { StyleSheet } from 'react-native';

export const crearEstilos = (tema) => {
  const { colores, espaciado, radios, tipografia, crearGlow } = tema;

  return StyleSheet.create({
    tarjeta: { flexDirection: 'row', backgroundColor: colores.superficie, borderRadius: radios.lg, marginBottom: espaciado.md, overflow: 'hidden', ...crearGlow(colores.rosaFuerte) },
    imagen: { width: 96, height: 96, backgroundColor: colores.borde },
    sinFoto: { justifyContent: 'center', alignItems: 'center', backgroundColor: colores.rosaPastel },
    info: { flex: 1, padding: espaciado.md, justifyContent: 'center' },
    nombre: { fontSize: tipografia.subtitulo.tamano, fontWeight: tipografia.subtitulo.grosor, color: colores.texto },
    categoria: { fontSize: tipografia.cuerpo.tamano, color: colores.textoSuave, marginTop: 2 },
    badge: { alignSelf: 'flex-start', backgroundColor: colores.lavanda, paddingVertical: 2, paddingHorizontal: espaciado.sm, borderRadius: radios.circular, marginTop: espaciado.sm },
    badgeTexto: { fontSize: tipografia.etiqueta.tamano, color: colores.lavandaFuerte, fontWeight: '700' },
  });
};