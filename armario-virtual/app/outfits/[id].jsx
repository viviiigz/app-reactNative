// app/outfits/[id].jsx
// Detalle de Outfit: título grande + carrusel horizontal con imágenes grandes
// de las prendas del look. Botones Editar / Eliminar (por ahora visuales).
import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { obtenerPrendas } from '../../src/mocks/mockPrendas';
import { normalizarFuente } from '../../src/utils/imagenes';
import Cargando from '../../src/components/Cargando';
import { colores, espaciado, radios, tipografia, crearGlow } from '../../src/theme/tema';

// Nombre simulado del look (hasta conectar datos reales por id).
const NOMBRE_OUTFIT = 'Look para la facu';

export default function DetalleOutfit() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [prendas, setPrendas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        setCargando(true);
        const datos = await obtenerPrendas();
        // Simulamos que este outfit tiene asignadas las primeras 4 prendas.
        if (activo) setPrendas(datos.slice(0, 4));
      } catch (e) {
        console.error('Error al cargar el outfit:', e);
      } finally {
        if (activo) setCargando(false);
      }
    })();
    return () => { activo = false; };
  }, []);

  if (cargando) return <Cargando mensaje="Cargando outfit..." />;

  return (
    <View style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.contenido}>
        {/* Título grande */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={styles.titulo}>{NOMBRE_OUTFIT}</Text>
          <Text style={styles.subtitulo}>{prendas.length} prendas en este look</Text>
        </Animated.View>

        {/* Carrusel horizontal con imágenes grandes */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carrusel}
        >
          {prendas.map((prenda, index) => {
            const fuente = normalizarFuente(prenda.imagen);
            return (
              <Animated.View
                key={prenda.id}
                entering={FadeInDown.delay(index * 80).duration(400)}
                style={styles.card}
              >
                {fuente ? (
                  <Image source={fuente} style={styles.img} />
                ) : (
                  <View style={[styles.img, styles.sinFoto]}>
                    <Ionicons name="image-outline" size={48} color={colores.rosaFuerte} />
                    <Text style={styles.sinFotoTexto}>Sin foto</Text>
                  </View>
                )}
                <Text style={styles.cardNombre} numberOfLines={1}>{prenda.nombre}</Text>
                <Text style={styles.cardCat}>{prenda.categoria}</Text>
              </Animated.View>
            );
          })}
        </ScrollView>
      </ScrollView>

      {/* Acciones */}
      <View style={styles.pie}>
        <Pressable style={styles.botonEditar} onPress={() => router.push(`/outfits/crear?id=${id}`)}>
          <Ionicons name="create-outline" size={20} color={colores.blancoPuro} />
          <Text style={styles.textoEditar}>Editar</Text>
        </Pressable>
        <Pressable style={styles.botonEliminar}>
          <Ionicons name="trash-outline" size={20} color={colores.error} />
          <Text style={styles.textoEliminar}>Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.base },
  contenido: { padding: espaciado.lg, paddingBottom: espaciado.xl },
  titulo: {
    fontSize: tipografia.titulo.tamano, fontWeight: tipografia.titulo.grosor, color: colores.texto,
  },
  subtitulo: {
    fontSize: tipografia.cuerpo.tamano, color: colores.textoSuave,
    marginTop: espaciado.xs, marginBottom: espaciado.lg,
  },
  carrusel: { gap: espaciado.md, paddingVertical: espaciado.sm, paddingRight: espaciado.md },
  card: {
    width: 190, backgroundColor: colores.superficie, borderRadius: radios.xl,
    padding: espaciado.md, ...crearGlow(colores.rosaFuerte),
  },
  img: { width: '100%', height: 240, borderRadius: radios.lg, backgroundColor: colores.borde },
  sinFoto: { justifyContent: 'center', alignItems: 'center', backgroundColor: colores.rosaPastel },
  sinFotoTexto: { marginTop: espaciado.xs, color: colores.rosaFuerte, fontWeight: '600' },
  cardNombre: {
    fontSize: tipografia.cuerpo.tamano, fontWeight: '700', color: colores.texto,
    marginTop: espaciado.sm,
  },
  cardCat: { fontSize: tipografia.etiqueta.tamano, color: colores.textoSuave, marginTop: 2 },
  pie: {
    flexDirection: 'row', gap: espaciado.md, padding: espaciado.lg,
    borderTopWidth: 1, borderTopColor: colores.borde,
  },
  botonEditar: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: espaciado.sm,
    backgroundColor: colores.rosaFuerte, paddingVertical: espaciado.md, borderRadius: radios.lg,
    ...crearGlow(colores.rosaFuerte),
  },
  textoEditar: { color: colores.blancoPuro, fontWeight: '700', fontSize: tipografia.cuerpo.tamano },
  botonEliminar: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: espaciado.sm,
    backgroundColor: colores.rojoSuave, paddingVertical: espaciado.md, borderRadius: radios.lg,
    borderWidth: 1, borderColor: colores.error,
  },
  textoEliminar: { color: colores.error, fontWeight: '700', fontSize: tipografia.cuerpo.tamano },
});