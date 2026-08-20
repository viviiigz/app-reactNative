// app/outfits/look/[lookId].styles.js
// Fábrica de estilos del Detalle del Look (hero de texto + lista de prendas).
import { StyleSheet } from 'react-native';

export const crearEstilos = (tema) => {
  const { colores, espaciado, radios, tipografia, crearGlow } = tema;

  return StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: colores.base },
    contenido: { padding: espaciado.lg, paddingBottom: espaciado.xl },
    hero: { backgroundColor: colores.rosaPastel, borderRadius: radios.xl, padding: espaciado.xl, alignItems: 'center', ...crearGlow(colores.rosaFuerte) },
    heroIcono: { width: 64, height: 64, borderRadius: radios.circular, backgroundColor: colores.superficie, justifyContent: 'center', alignItems: 'center', marginBottom: espaciado.md },
    heroTitulo: { fontSize: tipografia.titulo.tamano, fontWeight: '700', color: colores.texto, textAlign: 'center' },
    heroMeta: { fontSize: tipografia.etiqueta.tamano, color: colores.textoSuave, marginTop: espaciado.xs },
    seccion: { fontSize: tipografia.subtitulo.tamano, fontWeight: '700', color: colores.texto, marginTop: espaciado.lg, marginBottom: espaciado.md },
    prendaCard: { flexDirection: 'row', backgroundColor: colores.superficie, borderRadius: radios.lg, marginBottom: espaciado.md, overflow: 'hidden', ...crearGlow(colores.rosaFuerte) },
    prendaImg: { width: 90, height: 90, backgroundColor: colores.borde },
    prendaSinFoto: { justifyContent: 'center', alignItems: 'center', backgroundColor: colores.rosaPastel },
    prendaInfo: { flex: 1, padding: espaciado.md, justifyContent: 'center' },
    prendaNombre: { fontSize: tipografia.subtitulo.tamano, fontWeight: '700', color: colores.texto },
    prendaDato: { fontSize: tipografia.cuerpo.tamano, color: colores.textoSuave, marginTop: 2 },
    badge: { alignSelf: 'flex-start', backgroundColor: colores.lavanda, paddingVertical: 2, paddingHorizontal: espaciado.sm, borderRadius: radios.circular, marginTop: espaciado.sm },
    badgeTexto: { fontSize: tipografia.etiqueta.tamano, color: colores.lavandaFuerte, fontWeight: '700' },
  });
};