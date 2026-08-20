// app/prendas/index.styles.js
// Fábrica de estilos del catálogo de prendas (buscador + pestañas + lista).
import { StyleSheet } from 'react-native';

export const crearEstilos = (tema) => {
  const { colores, espaciado, radios, tipografia, crearGlow } = tema;

  return StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: colores.base },
    buscador: {
      flexDirection: 'row', alignItems: 'center', gap: espaciado.sm,
      backgroundColor: colores.superficie, marginHorizontal: espaciado.md,
      marginTop: espaciado.md, paddingHorizontal: espaciado.md,
      paddingVertical: espaciado.sm, borderRadius: radios.lg,
      ...crearGlow(colores.rosaFuerte),
    },
    buscadorInput: { flex: 1, fontSize: tipografia.cuerpo.tamano, color: colores.texto },
    pestanas: { flexDirection: 'row', gap: espaciado.sm, paddingHorizontal: espaciado.md, paddingVertical: espaciado.md },
    pestana: {
      paddingVertical: espaciado.sm, paddingHorizontal: espaciado.lg,
      borderRadius: radios.circular, backgroundColor: colores.superficie,
      alignItems: 'center', borderWidth: 1, borderColor: colores.borde,
    },
    pestanaActiva: { backgroundColor: colores.rosaFuerte, borderColor: colores.rosaFuerte },
    pestanaTexto: { fontSize: tipografia.etiqueta.tamano, fontWeight: '600', color: colores.texto },
    pestanaTextoActivo: { color: colores.blancoPuro },
    lista: { padding: espaciado.md, paddingBottom: 96 },
    fab: {
      position: 'absolute', right: espaciado.lg, bottom: espaciado.lg,
      width: 58, height: 58, borderRadius: radios.circular,
      backgroundColor: colores.rosaFuerte, justifyContent: 'center',
      alignItems: 'center', ...crearGlow(colores.rosaFuerte),
    },
  });
};