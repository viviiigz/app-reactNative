// app/outfits/album/[albumId].jsx
import React, { useCallback, useMemo } from 'react';
import { View, Text, Image, Pressable, FlatList, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useOutfits } from '../../../src/features/outfits/hooks/useOutfits';
import { useTheme } from '../../../src/hooks/useTheme';
import { normalizarFuente } from '../../../src/utils/imagenes';
import Cargando from '../../../src/components/Cargando';
import EstadoVacio from '../../../src/components/EstadoVacio';
import { crearEstilos } from './[albumId].styles';

// Helper: confirmación que funciona en web (window.confirm) y en celular (Alert).
const confirmar = (titulo, mensaje, onSi) => {
  if (Platform.OS === 'web') {
    if (window.confirm(`${titulo}\n\n${mensaje}`)) onSi();
    return;
  }
  Alert.alert(titulo, mensaje, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Eliminar', style: 'destructive', onPress: onSi },
  ]);
};

export default function DentroDeLaSeccion() {
  const { albumId } = useLocalSearchParams();
  const router = useRouter();

  const tema = useTheme();
  const { colores } = tema;
  const styles = useMemo(() => crearEstilos(tema), [tema]);

  const { album, looks, mapaPrendas, cargando, error, cargarAlbum, borrarAlbum, borrarLook } = useOutfits();
  useFocusEffect(useCallback(() => { cargarAlbum(albumId); }, [cargarAlbum, albumId]));

  const confirmarEliminarAlbum = () => {
    confirmar('Eliminar sección', 'Se borrará la sección y todos sus looks.', async () => {
      await borrarAlbum(albumId);
      router.back();
    });
  };

  const confirmarEliminarLook = (lookId) => {
    confirmar('Eliminar look', '¿Querés eliminar este look?', () => borrarLook(lookId));
  };

  if (cargando) return <Cargando mensaje="Cargando sección..." />;
  if (error) return <EstadoVacio titulo="Ups" icono="alert-circle-outline" mensaje={error} />;

  return (
    <View style={styles.contenedor}>
      <Stack.Screen
        options={{
          title: album?.nombre ?? 'Sección',
          headerRight: () => (
            <Pressable onPress={confirmarEliminarAlbum} hitSlop={10}>
              <Ionicons name="trash-outline" size={22} color={colores.blancoPuro} />
            </Pressable>
          ),
        }}
      />

      {looks.length === 0 ? (
        <EstadoVacio
          titulo="Sección vacía"
          icono="shirt-outline"
          mensaje="Todavía no hay looks acá. ¡Armá el primero!"
          textoBoton="Crear Look"
          onAccion={() => router.push(`/outfits/crear?albumId=${albumId}`)}
        />
      ) : (
        <FlatList
          data={looks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 70).duration(400)}>
              <Pressable style={styles.tarjeta} onPress={() => router.push(`/outfits/look/${item.id}`)}>
                <View style={styles.tarjetaHeader}>
                  <Text style={styles.tarjetaTitulo} numberOfLines={1}>{item.nombre}</Text>
                  <Pressable
                    hitSlop={8}
                    // Evita que el toque de la papelera abra el detalle (burbujeo).
                    onPress={(e) => { e.stopPropagation(); confirmarEliminarLook(item.id); }}
                  >
                    <Ionicons name="trash-outline" size={20} color={colores.error} />
                  </Pressable>
                </View>
                <View style={styles.miniaturas}>
                  {item.prendasIds.map((idPrenda, i) => {
                    const f = normalizarFuente(mapaPrendas[idPrenda]);
                    return f ? (
                      <Image key={i} source={f} style={styles.mini} />
                    ) : (
                      <View key={i} style={[styles.mini, styles.miniSinFoto]}>
                        <Ionicons name="image-outline" size={18} color={colores.rosaFuerte} />
                      </View>
                    );
                  })}
                </View>
                <Text style={styles.tarjetaMeta}>{item.prendasIds.length} prendas</Text>
              </Pressable>
            </Animated.View>
          )}
        />
      )}

      <Pressable style={styles.fab} onPress={() => router.push(`/outfits/crear?albumId=${albumId}`)}>
        <Ionicons name="add" size={28} color={colores.blancoPuro} />
      </Pressable>
    </View>
  );
}