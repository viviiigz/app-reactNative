// app/outfits/look/[lookId].jsx
// Detalle del Look con tema dinámico. Busca el look y cruza sus prendasIds
// con mockPrendas para mostrar la lista completa. Hero de texto (sin portada).
import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { useLocalSearchParams, useFocusEffect, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { obtenerLookPorId } from '../../../src/mocks/mockOutfits';
import { obtenerPrendas } from '../../../src/mocks/mockPrendas';
import { useTheme } from '../../../src/hooks/useTheme';
import { normalizarFuente } from '../../../src/utils/imagenes';
import Cargando from '../../../src/components/Cargando';
import EstadoVacio from '../../../src/components/EstadoVacio';
import { crearEstilos } from './[lookId].styles';

export default function DetalleLook() {
  const { lookId } = useLocalSearchParams();

  // --- Tema dinámico ---
  const tema = useTheme();
  const { colores } = tema;
  const styles = useMemo(() => crearEstilos(tema), [tema]);

  const [look, setLook] = useState(null);
  const [prendas, setPrendas] = useState([]); // solo las del look, en orden
  const [cargando, setCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let activo = true;
      (async () => {
        try {
          setCargando(true);
          const [lk, todas] = await Promise.all([obtenerLookPorId(lookId), obtenerPrendas()]);
          if (!activo) return;
          setLook(lk);
          if (lk) {
            const mapa = Object.fromEntries(todas.map((p) => [p.id, p]));
            setPrendas(lk.prendasIds.map((id) => mapa[id]).filter(Boolean));
          }
        } catch (e) {
          console.error('Error al cargar el look:', e);
        } finally {
          if (activo) setCargando(false);
        }
      })();
      return () => { activo = false; };
    }, [lookId])
  );

  if (cargando) return <Cargando mensaje="Cargando look..." />;

  if (!look) {
    return <EstadoVacio titulo="Look no encontrado" icono="alert-circle-outline" mensaje="Este look no existe o fue eliminado." />;
  }

  return (
    <View style={styles.contenedor}>
      <Stack.Screen options={{ title: look.nombre ?? 'Look' }} />
      <ScrollView contentContainerStyle={styles.contenido}>
        {/* Hero de texto (sin portada) */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.hero}>
          <View style={styles.heroIcono}>
            <Ionicons name="albums-outline" size={30} color={colores.rosaFuerte} />
          </View>
          <Text style={styles.heroTitulo}>{look.nombre}</Text>
          <Text style={styles.heroMeta}>{prendas.length} prendas en este look</Text>
        </Animated.View>

        {/* Lista vertical de prendas */}
        <Text style={styles.seccion}>Prendas</Text>
        {prendas.map((prenda, index) => {
          const f = normalizarFuente(prenda.imagen);
          return (
            <Animated.View key={prenda.id} entering={FadeInDown.delay(index * 60).duration(400)} style={styles.prendaCard}>
              {f ? (
                <Image source={f} style={styles.prendaImg} />
              ) : (
                <View style={[styles.prendaImg, styles.prendaSinFoto]}>
                  <Ionicons name="image-outline" size={26} color={colores.rosaFuerte} />
                </View>
              )}
              <View style={styles.prendaInfo}>
                <Text style={styles.prendaNombre} numberOfLines={1}>{prenda.nombre}</Text>
                <Text style={styles.prendaDato}>{prenda.categoria}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeTexto}>{prenda.temporada}</Text>
                </View>
              </View>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}