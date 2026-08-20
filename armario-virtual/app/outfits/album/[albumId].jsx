// app/outfits/album/[albumId].jsx
// Vista presentacional de la carpeta: consume useOutfits (cargar + eliminar)
// y useTheme (estilos dinámicos). Usa <Cargando /> y <EstadoVacio />.
import React, { useCallback, useMemo } from 'react';
import { View, Text, Image, Pressable, FlatList, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useOutfits } from '../../../src/features/outfits/hooks/useOutfits';
import { useTheme } from '../../../src/hooks/useTheme';
import { normalizarFuente } from '../../../src/features/prendas/components/PrendaCard';
import Cargando from '../../../src/components/Cargando';
import EstadoVacio from '../../../src/components/EstadoVacio';
import { crearEstilos } from './[albumId].styles';

export default function DentroDeLaSeccion() {
  const { albumId } = useLocalSearchParams();
  const router = useRouter();

  // --- Tema dinámico ---
  const tema = useTheme();
  const { colores } = tema;
  const styles = useMemo(() => crearEstilos(tema), [tema]);

  // --- Datos ---
  const { album, looks, mapaPrendas, cargando, error, cargarAlbum, borrarAlbum, borrarLook } = useOutfits();
  useFocusEffect(useCallback(() => { cargarAlbum(albumId); }, [cargarAlbum, albumId]));

  const confirmarEliminarAlbum = () => {
    Alert.alert('Eliminar sección', '¿Seguro? Se borrará la sección y todos sus looks.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => { await borrarAlbum(albumId); router.back(); } },
    ]);
  };

  const confirmarEliminarLook = (lookId) => {
    Alert.alert('Eliminar look', '¿Querés eliminar este look?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => borrarLook(lookId) },
    ]);
  };

  if (cargando) return <Cargando mensaje="Cargando sección..." />;

  if (error) {
    return <EstadoVacio titulo="Ups" icono="alert-circle-outline" mensaje={error} />;
  }

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
                  <Pressable onPress={() => confirmarEliminarLook(item.id)} hitSlop={8}>
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