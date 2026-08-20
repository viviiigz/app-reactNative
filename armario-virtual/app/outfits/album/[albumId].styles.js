// app/outfits/album/[albumId].styles.js
// Fábrica de estilos de la vista "dentro de la sección" (lista de looks).
import { StyleSheet } from 'react-native';

export const crearEstilos = (tema) => {
  const { colores, espaciado, radios, tipografia, crearGlow } = tema;

  return StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: colores.base },
    lista: { paddingHorizontal: espaciado.lg, paddingVertical: espaciado.md, paddingBottom: 110 },
    tarjeta: { backgroundColor: colores.superficie, borderRadius: radios.xl, padding: espaciado.lg, marginBottom: espaciado.md, ...crearGlow(colores.rosaFuerte) },
    tarjetaHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    tarjetaTitulo: { flex: 1, fontSize: tipografia.subtitulo.tamano, fontWeight: '700', color: colores.texto },
    miniaturas: { flexDirection: 'row', gap: espaciado.sm, marginTop: espaciado.md, flexWrap: 'wrap' },
    mini: { width: 50, height: 50, borderRadius: radios.md, backgroundColor: colores.borde },
    miniSinFoto: { justifyContent: 'center', alignItems: 'center', backgroundColor: colores.rosaPastel },
    tarjetaMeta: { fontSize: tipografia.etiqueta.tamano, color: colores.textoSuave, marginTop: espaciado.sm },
    fab: { position: 'absolute', right: espaciado.lg, bottom: espaciado.lg, width: 58, height: 58, borderRadius: radios.circular, backgroundColor: colores.rosaFuerte, justifyContent: 'center', alignItems: 'center', ...crearGlow(colores.rosaFuerte) },
  });
};