// app/outfits/crear.styles.js
// Fábrica de estilos: recibe el tema activo y devuelve el StyleSheet.
// El componente la llama con useMemo(() => crearEstilos(tema), [tema]).
import { StyleSheet } from 'react-native';

export const crearEstilos = (tema) => {
  const { colores, espaciado, radios, tipografia, crearGlow } = tema;

  return StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: colores.base },
    contenido: { padding: espaciado.lg, paddingBottom: espaciado.xl },
    aviso: {
      flexDirection: 'row', alignItems: 'center', gap: espaciado.sm,
      backgroundColor: colores.rojoSuave, borderRadius: radios.md,
      padding: espaciado.md, marginBottom: espaciado.md, borderWidth: 1, borderColor: colores.error,
    },
    avisoTexto: { color: colores.error, fontSize: tipografia.etiqueta.tamano, flex: 1 },
    label: { fontSize: tipografia.etiqueta.tamano, fontWeight: '600', color: colores.texto, marginTop: espaciado.lg, marginBottom: espaciado.xs },
    input: {
      backgroundColor: colores.superficie, borderWidth: 1, borderColor: colores.borde,
      borderRadius: radios.md, paddingHorizontal: espaciado.md, paddingVertical: espaciado.md,
      fontSize: tipografia.cuerpo.tamano, color: colores.texto,
    },
    reglaCaja: { backgroundColor: colores.superficie, borderRadius: radios.lg, padding: espaciado.md, marginTop: espaciado.lg, ...crearGlow(colores.rosaFuerte) },
    reglaFila: { flexDirection: 'row', alignItems: 'center', gap: espaciado.sm },
    reglaTexto: { fontSize: tipografia.cuerpo.tamano, color: colores.texto, fontWeight: '600' },
    barra: { height: 8, backgroundColor: colores.borde, borderRadius: radios.circular, marginTop: espaciado.sm, overflow: 'hidden' },
    barraRelleno: { height: '100%', backgroundColor: colores.rosaFuerte, borderRadius: radios.circular },
    grilla: { flexDirection: 'row', flexWrap: 'wrap', gap: espaciado.md },
    prendaWrap: { width: '30%' },
    prenda: { backgroundColor: colores.superficie, borderRadius: radios.lg, padding: espaciado.sm, alignItems: 'center', borderWidth: 3, borderColor: 'transparent' },
    prendaSeleccionada: { borderColor: colores.rosaFuerte },
    check: { position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: radios.circular, backgroundColor: colores.rosaFuerte, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
    prendaImg: { width: '100%', height: 80, borderRadius: radios.md, backgroundColor: colores.borde },
    sinFoto: { justifyContent: 'center', alignItems: 'center', backgroundColor: colores.rosaPastel },
    prendaNombre: { fontSize: tipografia.etiqueta.tamano, color: colores.texto, textAlign: 'center', marginTop: espaciado.xs },
    pie: { padding: espaciado.lg, borderTopWidth: 1, borderTopColor: colores.borde, backgroundColor: colores.base },
    botonGuardar: { backgroundColor: colores.rosaFuerte, paddingVertical: espaciado.md, borderRadius: radios.lg, alignItems: 'center', ...crearGlow(colores.rosaFuerte) },
    botonDeshabilitado: { backgroundColor: colores.borde, shadowOpacity: 0, elevation: 0 },
    botonTexto: { color: colores.blancoPuro, fontSize: tipografia.subtitulo.tamano, fontWeight: '700' },
    botonTextoApagado: { color: colores.textoSuave },
  });
};