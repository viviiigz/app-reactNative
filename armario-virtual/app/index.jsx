// app/index.jsx
// TAREA 4 — Home Interactivo del Armario Virtual (versión responsive por CAPAS).
// Técnica de layering: en vez de <ImageBackground> (que aplasta/recorta la
// figura), armamos un "sándwich":
//   1) La base: un <View> con el color de fondo real.
//   2) La imagen: un PNG transparente en position 'absolute' que flota encima.
//   3) La interfaz: botones anclados abajo, superpuestos sobre la figura.
// Así el fondo nunca deja franjas feas y la figura se ve entera en cualquier pantalla.
import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colores as PALETA } from '../src/theme/tema';


// Botón "Soft/Glow": borde ultra redondeado, sombra coloreada (glow) y
// respuesta táctil elástica al presionar (withSpring). Reutilizable.
function BotonSoft({ etiqueta, icono, colorFondo, colorTexto, colorGlow, delay, onPress }) {
  const escala = useSharedValue(1);

  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [{ scale: escala.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(600).springify().damping(14)}
      style={[styles.sombraGlow, { shadowColor: colorGlow }]}
    >
      <Animated.View style={estiloAnimado}>
        <Pressable
          onPress={onPress}
          onPressIn={() => (escala.value = withSpring(0.96))}
          onPressOut={() => (escala.value = withSpring(1))}
          style={[styles.boton, { backgroundColor: colorFondo }]}
        >
          <Ionicons name={icono} size={22} color={colorTexto} />
          <Text style={[styles.botonTexto, { color: colorTexto }]}>{etiqueta}</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

export default function Inicio() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Responsivo: acotamos el ancho de la botonera en pantallas grandes (tablet/web).
  const anchoBotonera = Math.min(width - 48, 480);

  return (
    // CAPA 1 — La base: el color de fondo lo define este View, no la imagen.
    <View style={styles.contenedor}>
      {/* Oculta el header nativo SOLO en esta pantalla (Home inmersivo). */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* CAPA 2 — La imagen flotante (PNG transparente).
          - position 'absolute' + absoluteFill: ocupa toda la pantalla.
          - resizeMode 'contain': la figura se ve ENTERA y a escala en cualquier
            tamaño, sin recortes ni deformación (responsive de verdad).
          - pointerEvents 'none': la imagen no intercepta toques, así los botones
            que quedan encima siguen siendo tocables. */}
  <Image
  source={require('../assets/images/fondito.png')}
  resizeMode="contain"
  pointerEvents="none"
  style={styles.imagenFlotante}
/>
      {/* CAPA 3 — La interfaz: botonera anclada abajo, superpuesta a la figura. */}
      <View
        style={[
          styles.overlay,
          { width: anchoBotonera, paddingBottom: insets.bottom + 60 },
        ]}
      >
        <BotonSoft
          etiqueta="Ver mis Outfits"
          icono="albums-outline"
          colorFondo={PALETA.rosaPastel}
          colorTexto={PALETA.texto}
          colorGlow={PALETA.rosaFuerte}
          delay={150}
          onPress={() => router.push('/outfits')} // pendiente Tarea 5 (ver nota)
        />
        <BotonSoft
          etiqueta="Ver mis Prendas"
          icono="shirt-outline"
          colorFondo={PALETA.rosaPastel}
          colorTexto={PALETA.texto}
          colorGlow={PALETA.rosaFuerte}
          delay={300}
          onPress={() => router.push('/prendas')}
        />
        <BotonSoft
          etiqueta="Agregar Prenda"
          icono="add-circle-outline"
          colorFondo={PALETA.rosaFuerte}
          colorTexto={PALETA.blancoPuro}
          colorGlow={PALETA.rosaFuerte}
          delay={450}
          onPress={() => router.push('/prendas/formulario')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: PALETA.base, // el fondo real de la pantalla
  },
imagenFlotante: {
    ...StyleSheet.absoluteFillObject, // llena TODA la pantalla
    width: '100%',
    height: '83%',

  },
  overlay: {
    flex: 1,
    alignSelf: 'center', // centra la botonera horizontalmente
    justifyContent: 'flex-end', // empuja los botones hacia abajo
    gap: 18,
  },
  sombraGlow: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 10,
    borderRadius: 28,
  },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 28,
  },
  botonTexto: {
    fontSize: 18,
    fontWeight: '700',
  },
});