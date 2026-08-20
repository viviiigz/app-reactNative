// app/outfits/index.styles.js
// Fábrica de estilos de la pantalla "Mis Outfits" (grilla de álbumes + modal).
import { StyleSheet } from 'react-native';

export const crearEstilos = (tema) => {
  const { colores, espaciado, radios, tipografia, crearGlow } = tema;

  return StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: colores.base },
    lista: { padding: espaciado.md, paddingBottom: 110 },
    encabezado: { fontSize: tipografia.titulo.tamano, fontWeight: tipografia.titulo.grosor, color: colores.texto, marginVertical: espaciado.md, marginLeft: espaciado.xs },
    fila: { gap: espaciado.md },
    tarjetaWrap: { flex: 1, marginBottom: espaciado.md },
    tarjeta: { backgroundColor: colores.superficie, borderRadius: radios.lg, overflow: 'hidden', ...crearGlow(colores.rosaFuerte) },
    portada: { width: '100%', height: 110, backgroundColor: colores.borde },
    portadaImg: { width: '100%', height: '100%' },
    portadaVacia: { justifyContent: 'center', alignItems: 'center', backgroundColor: colores.rosaPastel },
    nombre: { fontSize: tipografia.cuerpo.tamano, fontWeight: '700', color: colores.texto, textAlign: 'center', padding: espaciado.md },
    fab: { position: 'absolute', right: espaciado.lg, bottom: espaciado.lg, width: 58, height: 58, borderRadius: radios.circular, backgroundColor: colores.rosaFuerte, justifyContent: 'center', alignItems: 'center', ...crearGlow(colores.rosaFuerte) },
    overlay: { flex: 1, backgroundColor: 'rgba(74,68,88,0.4)', justifyContent: 'center', padding: espaciado.lg },
    modalCard: { backgroundColor: colores.superficie, borderRadius: radios.xl, padding: espaciado.lg, ...crearGlow(colores.lavandaFuerte) },
    modalTitulo: { fontSize: tipografia.subtitulo.tamano, fontWeight: '700', color: colores.texto, marginBottom: espaciado.md },
    previewWrap: { position: 'relative', marginBottom: espaciado.md },
    preview: { width: '100%', height: 120, borderRadius: radios.lg, backgroundColor: colores.borde },
    previewVacia: { justifyContent: 'center', alignItems: 'center', backgroundColor: colores.rosaPastel, marginBottom: espaciado.md },
    previewTexto: { color: colores.rosaFuerte, fontWeight: '600', marginTop: espaciado.xs, fontSize: tipografia.etiqueta.tamano },
    quitar: { position: 'absolute', top: espaciado.sm, right: espaciado.sm, width: 28, height: 28, borderRadius: radios.circular, backgroundColor: 'rgba(74,68,88,0.7)', justifyContent: 'center', alignItems: 'center' },
    pickerBotones: { flexDirection: 'row', gap: espaciado.md, marginBottom: espaciado.md },
    pickerBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: espaciado.sm, backgroundColor: colores.rosaPastel, paddingVertical: espaciado.sm, borderRadius: radios.md },
    pickerBtnTexto: { color: colores.texto, fontWeight: '600', fontSize: tipografia.etiqueta.tamano },
    modalInput: { backgroundColor: colores.base, borderWidth: 1, borderColor: colores.borde, borderRadius: radios.md, paddingHorizontal: espaciado.md, paddingVertical: espaciado.md, fontSize: tipografia.cuerpo.tamano, color: colores.texto },
    modalBotones: { flexDirection: 'row', gap: espaciado.md, marginTop: espaciado.lg },
    modalCancelar: { flex: 1, paddingVertical: espaciado.md, borderRadius: radios.lg, alignItems: 'center', borderWidth: 1, borderColor: colores.borde },
    modalCancelarTexto: { color: colores.textoSuave, fontWeight: '700' },
    modalCrear: { flex: 1, paddingVertical: espaciado.md, borderRadius: radios.lg, alignItems: 'center', backgroundColor: colores.rosaFuerte, ...crearGlow(colores.rosaFuerte) },
    modalCrearTexto: { color: colores.blancoPuro, fontWeight: '700' },
    botonApagado: { backgroundColor: colores.borde, shadowOpacity: 0, elevation: 0 },
  });
};