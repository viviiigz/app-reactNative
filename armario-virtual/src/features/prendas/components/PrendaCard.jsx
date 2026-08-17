// src/features/prendas/components/PrendaCard.jsx
// Tarjeta de una prenda para el listado (Soft/Glow UI).
// Normaliza la fuente de imagen: acepta require() (número), uri (string) o null.
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colores, espaciado, radios, tipografia, crearGlow } from '../../../theme/tema';

// Convierte prenda.imagen en un `source` válido para <Image>, o null si no hay.
// Funciona en móvil Y en web:
// - null / undefined / '' → sin foto.
// - string (uri de cámara/galería) → se envuelve en { uri }.
// - cualquier otra cosa (require: número en nativo, objeto en web) → tal cual.
export const normalizarFuente = (imagen) => {
  if (!imagen) return null;
  if (typeof imagen === 'string') return { uri: imagen };
  return imagen; // asset local de require(), sea número (nativo) u objeto (web)
};

export default function PrendaCard({ prenda, onPress }) {
  const fuente = normalizarFuente(prenda.imagen);

  return (
    <Pressable style={styles.tarjeta} onPress={onPress}>
      {fuente ? (
        <Image source={fuente} style={styles.imagen} />
      ) : (
        // Placeholder "Sin foto" con la identidad visual de la app.
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

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    backgroundColor: colores.superficie,
    borderRadius: radios.lg,
    marginBottom: espaciado.md,
    overflow: 'hidden',
    ...crearGlow(colores.rosaFuerte),
  },
  imagen: {
    width: 96,
    height: 96,
    backgroundColor: colores.borde,
  },
  sinFoto: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colores.rosaPastel,
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
    backgroundColor: colores.lavanda,
    paddingVertical: 2,
    paddingHorizontal: espaciado.sm,
    borderRadius: radios.circular,
    marginTop: espaciado.sm,
  },
  badgeTexto: {
    fontSize: tipografia.etiqueta.tamano,
    color: colores.lavandaFuerte,
    fontWeight: '700',
  },
});