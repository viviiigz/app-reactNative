// app/index.styles.js
// Fábrica de estilos del Home inmersivo (base + imagen flotante + botonera).
import { StyleSheet } from 'react-native';

export const crearEstilos = (tema) => {
  const { colores, espaciado, radios } = tema;

  return StyleSheet.create({
    contenedor: { flex: 1, backgroundColor: colores.base },
    imagenFlotante: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '83%',
    },
    overlay: {
      flex: 1,
      alignSelf: 'center',
      justifyContent: 'flex-end',
      gap: espaciado.md,
    },
    sombraGlow: {
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.45,
      shadowRadius: 20,
      elevation: 10,
      borderRadius: radios.lg,
    },
    boton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: espaciado.sm,
      paddingVertical: espaciado.md,
      paddingHorizontal: espaciado.lg,
      borderRadius: radios.lg,
    },
    botonTexto: {
      fontSize: 18,
      fontWeight: '700',
    },
  });
};