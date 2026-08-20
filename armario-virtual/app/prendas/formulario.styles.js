// app/prendas/formulario.styles.js
// Fábrica de estilos de la pantalla Alta/Edición de prenda. Recibe el tema
// activo y devuelve el StyleSheet. Se consume con useMemo(() => crearEstilos(tema), [tema]).
import { StyleSheet } from 'react-native';

export const crearEstilos = (tema) => {
  const { colores, espaciado, radios, tipografia, crearGlow } = tema;

  return StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: colores.base },
    contenido: { padding: espaciado.lg, paddingBottom: espaciado.xl },
    titulo: {
      fontSize: tipografia.titulo.tamano, fontWeight: tipografia.titulo.grosor,
      color: colores.texto, marginBottom: espaciado.md,
    },
    label: {
      fontSize: tipografia.etiqueta.tamano, fontWeight: '600', color: colores.texto,
      marginTop: espaciado.lg, marginBottom: espaciado.xs,
    },
    input: {
      backgroundColor: colores.superficie, borderWidth: 1, borderColor: colores.borde,
      borderRadius: radios.md, paddingHorizontal: espaciado.md, paddingVertical: espaciado.md,
      fontSize: tipografia.cuerpo.tamano, color: colores.texto,
    },
    inputError: { borderColor: colores.error },
    error: { color: colores.error, fontSize: tipografia.etiqueta.tamano, marginTop: espaciado.xs },
    grupoPills: { flexDirection: 'row', flexWrap: 'wrap', gap: espaciado.sm },
    pill: {
      paddingVertical: espaciado.sm, paddingHorizontal: espaciado.md,
      borderRadius: radios.circular, backgroundColor: colores.superficie,
      borderWidth: 1, borderColor: colores.borde,
    },
    pillCategoriaActiva: { backgroundColor: colores.lavanda, borderColor: colores.lavandaFuerte },
    pillTemporadaActiva: { backgroundColor: colores.rosaPastel, borderColor: colores.rosaFuerte },
    pillTexto: { fontSize: tipografia.etiqueta.tamano, color: colores.texto },
    pillTextoActivo: { color: colores.texto, fontWeight: '700' },
    botonesFoto: { flexDirection: 'row', gap: espaciado.md },
    botonFoto: {
      flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: espaciado.sm, backgroundColor: colores.rosaPastel,
      paddingVertical: espaciado.md, borderRadius: radios.md,
    },
    botonFotoTexto: { fontSize: tipografia.etiqueta.tamano, fontWeight: '600', color: colores.texto },
    previewWrap: { marginTop: espaciado.lg, position: 'relative' },
    preview: { width: '100%', height: 320, borderRadius: radios.xl, backgroundColor: colores.borde },
    quitarFoto: {
      position: 'absolute', top: espaciado.sm, right: espaciado.sm,
      width: 32, height: 32, borderRadius: radios.circular,
      backgroundColor: 'rgba(74,68,88,0.7)', justifyContent: 'center', alignItems: 'center',
    },
    botonGuardar: {
      backgroundColor: colores.rosaFuerte, paddingVertical: espaciado.md,
      borderRadius: radios.lg, alignItems: 'center', marginTop: espaciado.lg,
      ...crearGlow(colores.rosaFuerte),
    },
    botonDeshabilitado: { opacity: 0.6 },
    botonGuardarTexto: { color: colores.blancoPuro, fontSize: tipografia.subtitulo.tamano, fontWeight: '700' },
    botonEliminar: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: espaciado.sm,
      backgroundColor: colores.rojoSuave, paddingVertical: espaciado.md,
      borderRadius: radios.lg, marginTop: espaciado.md,
      borderWidth: 1, borderColor: colores.error,
    },
    botonEliminarTexto: { color: colores.error, fontSize: tipografia.cuerpo.tamano, fontWeight: '700' },
  });
};