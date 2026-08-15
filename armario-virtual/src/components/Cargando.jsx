// src/components/Cargando.jsx
// Estado de carga reutilizable: spinner centrado con un mensaje opcional.
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colores, espaciado, tipografia } from '../theme/tema';

export default function Cargando({ mensaje = 'Cargando...' }) {
  return (
    <View style={styles.contenedor}>
      <ActivityIndicator size="large" color={colores.primario} />
      <Text style={styles.texto}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colores.fondo,
    padding: espaciado.lg,
  },
  texto: {
    marginTop: espaciado.md,
    color: colores.textoSuave,
    fontSize: tipografia.cuerpo.tamano,
  },
});