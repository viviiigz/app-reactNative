// app/outfits/album/[albumId].jsx
// Looks de la sección. SIN portada en las tarjetas: solo nombre + miniaturas.
// (Las portadas viven únicamente en el listado de álbumes / index.jsx.)
// Navega a /outfits/look/[lookId]. Imports suben 3 niveles (../../../).
import React, { useCallback, useState } from 'react';
import { View, Text, Image, Pressable, FlatList, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { obtenerAlbumPorId, obtenerLooksPorAlbum, eliminarAlbum, eliminarLook } from '../../../src/mocks/mockOutfits';
import { obtenerPrendas } from '../../../src/mocks/mockPrendas';
import { normalizarFuente } from '../../../src/features/prendas/components/PrendaCard';
import Cargando from '../../../src/components/Cargando';
import EstadoVacio from '../../../src/components/EstadoVacio';
import { colores, espaciado, radios, tipografia, crearGlow } from '../../../src/theme/tema';

const ordenarNuevoAViejo = (lista) =>
  [...lista].sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());

export default function DentroDeLaSeccion() {
  const { albumId } = useLocalSearchParams();
  const router = useRouter();

  const [album, setAlbum] = useState(null);
  const [looks, setLooks] = useState([]);
  const [mapaPrendas, setMapaPrendas] = useState({});
  const [cargando, setCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let activo = true;
      (async () => {
        try {
          setCargando(true);
          const [alb, looksAlbum, prendas] = await Promise.all([
            obtenerAlbumPorId(albumId), obtenerLooksPorAlbum(albumId), obtenerPrendas(),
          ]);
          if (!activo) return;
          setAlbum(alb);
          setLooks(ordenarNuevoAViejo(looksAlbum));
          setMapaPrendas(Object.fromEntries(prendas.map((p) => [p.id, p.imagen])));
        } catch (e) {
          console.error('Error al cargar la sección:', e);
        } finally {
          if (activo) setCargando(false);
        }
      })();
      return () => { activo = false; };
    }, [albumId])
  );

  const confirmarEliminarAlbum = () => {
    Alert.alert('Eliminar sección', '¿Seguro? Se borrará la sección y todos sus looks.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        try { await eliminarAlbum(albumId); router.back(); }
        catch (e) { console.error('Error al eliminar la sección:', e); }
      } },
    ]);
  };

  const confirmarEliminarLook = (lookId) => {
    Alert.alert('Eliminar look', '¿Querés eliminar este look?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        try { await eliminarLook(lookId); setLooks((prev) => prev.filter((l) => l.id !== lookId)); }
        catch (e) { console.error('Error al eliminar el look:', e); }
      } },
    ]);
  };

  if (cargando) return <Cargando mensaje="Cargando sección..." />;

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
              {/* Tarjeta de look SIN portada: nombre + fila de miniaturas. */}
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

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.base },
  lista: { paddingHorizontal: 20, paddingVertical: espaciado.md, paddingBottom: 110 },
  tarjeta: { backgroundColor: colores.superficie, borderRadius: radios.xl, padding: espaciado.lg, marginBottom: espaciado.md, ...crearGlow(colores.rosaFuerte) },
  tarjetaHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tarjetaTitulo: { flex: 1, fontSize: tipografia.subtitulo.tamano, fontWeight: '700', color: colores.texto },
  miniaturas: { flexDirection: 'row', gap: espaciado.sm, marginTop: espaciado.md, flexWrap: 'wrap' },
  mini: { width: 50, height: 50, borderRadius: radios.md, backgroundColor: colores.borde },
  miniSinFoto: { justifyContent: 'center', alignItems: 'center', backgroundColor: colores.rosaPastel },
  tarjetaMeta: { fontSize: tipografia.etiqueta.tamano, color: colores.textoSuave, marginTop: espaciado.sm },
  fab: { position: 'absolute', right: espaciado.lg, bottom: espaciado.lg, width: 58, height: 58, borderRadius: radios.circular, backgroundColor: colores.rosaFuerte, justifyContent: 'center', alignItems: 'center', ...crearGlow(colores.rosaFuerte) },
});