// src/features/prendas/components/PrendaCard.jsx
// Tarjeta de prenda con tema dinámico. La resolución de imagen ahora vive en
// src/utils/imagenes.js (función pura), no acá.
import React, { useMemo } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { normalizarFuente } from '../../../utils/imagenes';
import { crearEstilos } from './PrendaCard.styles';

export default function PrendaCard({ prenda, onPress }) {
  const tema = useTheme();
  const { colores } = tema;
  const styles = useMemo(() => crearEstilos(tema), [tema]);

  const fuente = normalizarFuente(prenda.imagen);

  return (
    <Pressable style={styles.tarjeta} onPress={onPress}>
      {fuente ? (
        <Image source={fuente} style={styles.imagen} />
      ) : (
        <View style={[styles.imagen, styles.sinFoto]}>
          <Ionicons name="image-outline" size={26} color={colores.rosaFuerte} />
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.nombre} numberOfLines={1}>{prenda.nombre}</Text>
        <Text style={styles.categoria}>{prenda.categoria}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeTexto}>{prenda.temporada}</Text>
        </View>
      </View>
    </Pressable>
  );
}