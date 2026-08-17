// src/components/EstadoVacio.jsx
// Estado vacío reutilizable, alineado a la estética Soft/Glow UI.
// Se muestra cuando una lista no tiene datos (o no hay resultados de búsqueda).
// Acepta un botón de acción opcional (ej: "Agregar prenda").
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, espaciado, radios, tipografia, crearGlow } from '../theme/tema';

export default function EstadoVacio({
  titulo = 'Sin resultados',
  mensaje = 'No hay nada para mostrar por ahora.',
  icono = 'shirt-outline',
  textoBoton,
  onAccion,
}) {
  return (
    <View style={styles.contenedor}>
      {/* Ícono dentro de un círculo con glow (identidad visual de la app). */}
      <View style={styles.circuloIcono}>
        <Ionicons name={icono} size={40} color={colores.rosaFuerte} />
      </View>

      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.mensaje}>{mensaje}</Text>

      {/* El botón solo aparece si nos pasan texto Y una acción. */}
      {textoBoton && onAccion ? (
        <Pressable style={styles.boton} onPress={onAccion}>
          <Text style={styles.textoBoton}>{textoBoton}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colores.base,
    padding: espaciado.xl,
  },
  circuloIcono: {
    width: 96,
    height: 96,
    borderRadius: radios.circular,
    backgroundColor: colores.superficie,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: espaciado.lg,
    ...crearGlow(colores.rosaFuerte),
  },
  titulo: {
    fontSize: tipografia.subtitulo.tamano,
    fontWeight: tipografia.subtitulo.grosor,
    color: colores.texto,
    marginBottom: espaciado.sm,
    textAlign: 'center',
  },
  mensaje: {
    fontSize: tipografia.cuerpo.tamano,
    color: colores.textoSuave,
    textAlign: 'center',
    marginBottom: espaciado.lg,
  },
  boton: {
    backgroundColor: colores.rosaFuerte,
    paddingVertical: espaciado.sm,
    paddingHorizontal: espaciado.lg,
    borderRadius: radios.lg,
    ...crearGlow(colores.rosaFuerte),
  },
  textoBoton: {
    color: colores.blancoPuro,
    fontSize: tipografia.cuerpo.tamano,
    fontWeight: '700',
  },
});