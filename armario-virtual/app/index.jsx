// app/index.jsx
// Home inmersivo (técnica de capas: base + PNG transparente flotante + botonera).
// Tema dinámico: useTheme para colores + crearEstilos para el StyleSheet.
import React, { useMemo } from 'react';
import { View, Text, Image, Pressable, useWindowDimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown, useSharedValue, useAnimatedStyle, withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../src/hooks/useTheme';
import { crearEstilos } from './index.styles';

// Botón "Soft/Glow": recibe todo por props. Recibe también `styles` para no
// recrear su propio StyleSheet en cada instancia.
function BotonSoft({ etiqueta, icono, colorFondo, colorTexto, colorGlow, delay, onPress, styles }) {
  const escala = useSharedValue(1);
  const estiloAnimado = useAnimatedStyle(() => ({ transform: [{ scale: escala.value }] }));

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

  // --- Tema dinámico ---
  const tema = useTheme();
  const { colores } = tema;
  const styles = useMemo(() => crearEstilos(tema), [tema]);

  // Responsivo: acotamos el ancho de la botonera en pantallas grandes.
  const anchoBotonera = Math.min(width - 48, 480);

  return (
    <View style={styles.contenedor}>
      {/* Header oculto solo en el Home (inmersivo). */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Imagen flotante (PNG transparente). pointerEvents 'none' para no bloquear toques. */}
      <Image
        source={require('../assets/images/fondito.png')}
        resizeMode="contain"
        pointerEvents="none"
        style={styles.imagenFlotante}
      />

      {/* Botonera anclada abajo. */}
      <View style={[styles.overlay, { width: anchoBotonera, paddingBottom: insets.bottom + 60 }]}>
        <BotonSoft
          etiqueta="Ver mis Outfits"
          icono="albums-outline"
          colorFondo={colores.rosaPastel}
          colorTexto={colores.texto}
          colorGlow={colores.rosaFuerte}
          delay={150}
          onPress={() => router.push('/outfits')}
          styles={styles}
        />
        <BotonSoft
          etiqueta="Ver mis Prendas"
          icono="shirt-outline"
          colorFondo={colores.rosaPastel}
          colorTexto={colores.texto}
          colorGlow={colores.rosaFuerte}
          delay={300}
          onPress={() => router.push('/prendas')}
          styles={styles}
        />
        <BotonSoft
          etiqueta="Agregar Prenda"
          icono="add-circle-outline"
          colorFondo={colores.rosaFuerte}
          colorTexto={colores.blancoPuro}
          colorGlow={colores.rosaFuerte}
          delay={450}
          onPress={() => router.push('/prendas/formulario')}
          styles={styles}
        />
      </View>
    </View>
  );
}