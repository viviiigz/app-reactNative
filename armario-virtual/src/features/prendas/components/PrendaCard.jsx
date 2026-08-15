// src/features/prendas/components/PrendaCard.jsx
// Tarjeta visual de una prenda para el listado. Es "tonta": solo recibe la
// prenda y una función onPress; no sabe de dónde vienen los datos.
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colores, espaciado, radios, tipografia } from '../../../theme/tema';

export default function PrendaCard({ prenda, onPress }) {
  return (
    <TouchableOpacity style={styles.tarjeta} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: prenda.imagen }} style={styles.imagen} />

      <View style={styles.info}>
        <Text style={styles.nombre} numberOfLines={1}>
          {prenda.nombre}
        </Text>
        <Text style={styles.categoria}>{prenda.categoria}</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeTexto}>{prenda.temporada}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    backgroundColor: colores.superficie,
    borderRadius: radios.md,
    marginBottom: espaciado.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colores.borde,
  },
  imagen: {
    width: 90,
    height: 90,
    backgroundColor: colores.borde,
  },
  info: {
    flex: 1,
    padding: espaciado.md,
    justifyContent: 'center',
  },
  nombre: {
    fontSize: tipografia.subtitulo.tamano,
    fontWeight: tipografia.subtitulo.grosor,
    color: colores.texto,
  },
  categoria: {
    fontSize: tipografia.cuerpo.tamano,
    color: colores.textoSuave,
    marginTop: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colores.secundario,
    paddingVertical: 2,
    paddingHorizontal: espaciado.sm,
    borderRadius: radios.circular,
    marginTop: espaciado.sm,
  },
  badgeTexto: {
    fontSize: tipografia.etiqueta.tamano,
    color: colores.primarioOscuro,
    fontWeight: '600',
  },
});