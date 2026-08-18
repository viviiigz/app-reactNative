// app/outfits/look/[lookId].jsx
// Detalle del Look: hero header (título, SIN imagen de portada) + lista vertical
// de las prendas que lo componen, hidratadas desde mockPrendas.
import React, { useCallback, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useFocusEffect, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { obtenerLookPorId } from '../../../src/mocks/mockOutfits';
import { obtenerPrendas } from '../../../src/mocks/mockPrendas';
import { normalizarFuente } from '../../../src/features/prendas/components/PrendaCard';
import Cargando from '../../../src/components/Cargando';
import EstadoVacio from '../../../src/components/EstadoVacio';
import { colores, espaciado, radios, tipografia, crearGlow } from '../../../src/theme/tema';

export default function DetalleLook() {
  const { lookId } = useLocalSearchParams();
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
            // Cruzamos ids del look con las prendas completas (respetando el orden).
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
    return (
      <EstadoVacio
        titulo="Look no encontrado"
        icono="alert-circle-outline"
        mensaje="Este look no existe o fue eliminado."
      />
    );
  }

  return (
    <View style={styles.contenedor}>
      <Stack.Screen options={{ title: look.nombre ?? 'Look' }} />
      <ScrollView contentContainerStyle={styles.contenido}>
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

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.base },
  contenido: { padding: espaciado.lg, paddingBottom: espaciado.xl },
  seccion: { fontSize: tipografia.subtitulo.tamano, fontWeight: '700', color: colores.texto, marginBottom: espaciado.md },
  prendaCard: { flexDirection: 'row', backgroundColor: colores.superficie, borderRadius: radios.lg, marginBottom: espaciado.md, overflow: 'hidden', ...crearGlow(colores.rosaFuerte) },
  prendaImg: { width: 90, height: 90, backgroundColor: colores.borde },
  prendaSinFoto: { justifyContent: 'center', alignItems: 'center', backgroundColor: colores.rosaPastel },
  prendaInfo: { flex: 1, padding: espaciado.md, justifyContent: 'center' },
  prendaNombre: { fontSize: tipografia.subtitulo.tamano, fontWeight: '700', color: colores.texto },
  prendaDato: { fontSize: tipografia.cuerpo.tamano, color: colores.textoSuave, marginTop: 2 },
  badge: { alignSelf: 'flex-start', backgroundColor: colores.lavanda, paddingVertical: 2, paddingHorizontal: espaciado.sm, borderRadius: radios.circular, marginTop: espaciado.sm },
  badgeTexto: { fontSize: tipografia.etiqueta.tamano, color: colores.lavandaFuerte, fontWeight: '700' },
});