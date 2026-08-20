// app/prendas/[id].styles.js
// Fábrica de estilos del Detalle de Prenda.
import { StyleSheet } from 'react-native';

export const crearEstilos = (tema) => {
  const { colores, espaciado, radios, tipografia, crearGlow } = tema;

  return StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: colores.base },
    contenido: { padding: espaciado.lg },
    imagen: { width: '100%', height: 340, borderRadius: radios.xl, backgroundColor: colores.borde, marginBottom: espaciado.lg },
    sinFoto: { justifyContent: 'center', alignItems: 'center', backgroundColor: colores.rosaPastel },
    sinFotoTexto: { marginTop: espaciado.sm, color: colores.rosaFuerte, fontSize: tipografia.cuerpo.tamano, fontWeight: '600' },
    nombre: { fontSize: tipografia.titulo.tamano, fontWeight: tipografia.titulo.grosor, color: colores.texto, marginBottom: espaciado.lg },
    fila: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: espaciado.md, borderBottomWidth: 1, borderBottomColor: colores.borde },
    etiqueta: { fontSize: tipografia.cuerpo.tamano, color: colores.textoSuave },
    valor: { fontSize: tipografia.cuerpo.tamano, color: colores.texto, fontWeight: '600' },
    botonEditar: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: espaciado.sm,
      backgroundColor: colores.rosaFuerte, paddingVertical: espaciado.md, borderRadius: radios.lg,
      marginTop: espaciado.xl, ...crearGlow(colores.rosaFuerte),
    },
    textoBotonEditar: { color: colores.blancoPuro, fontSize: tipografia.subtitulo.tamano, fontWeight: '600' },
  });
};