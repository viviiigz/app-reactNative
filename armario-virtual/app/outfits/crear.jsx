// app/outfits/crear.jsx
// Vista presentacional con tema DINÁMICO: useTheme para colores, crearEstilos
// para el StyleSheet (memoizado), useOutfits para datos y validarLook para la regla.
import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, Image, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useOutfits } from '../../src/features/outfits/hooks/useOutfits';
import { useTheme } from '../../src/hooks/useTheme';
import { validarLook, MINIMO_PRENDAS_LOOK } from '../../src/utils/validaciones';
import { normalizarFuente } from '../../src/utils/imagenes';
import Cargando from '../../src/components/Cargando';
import { crearEstilos } from './crear.styles';

export default function CrearLook() {
  const router = useRouter();
  const { albumId } = useLocalSearchParams();

  // --- Tema dinámico ---
  const tema = useTheme();
  const { colores } = tema; // colores para íconos (inline)
  // useMemo: los estilos solo se recalculan si cambia el tema, no en cada render.
  const styles = useMemo(() => crearEstilos(tema), [tema]);

  const { prendas, cargando, cargarPrendas, crearNuevoLook } = useOutfits();

  const [nombre, setNombre] = useState('');
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [guardando, setGuardando] = useState(false);

  useFocusEffect(useCallback(() => { cargarPrendas(); }, [cargarPrendas]));

  const alternar = (id) =>
    setSeleccionadas((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const puedeGuardar = validarLook(nombre, seleccionadas) && !guardando;
  const reglaOk = seleccionadas.length >= MINIMO_PRENDAS_LOOK;

  const guardar = async () => {
    if (!puedeGuardar) return;
    try {
      setGuardando(true);
      await crearNuevoLook({ albumId, nombre: nombre.trim(), prendasIds: seleccionadas });
      router.back();
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <Cargando mensaje="Cargando prendas..." />;

  return (
    <View style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
        {!albumId && (
          <View style={styles.aviso}>
            <Ionicons name="alert-circle-outline" size={18} color={colores.error} />
            <Text style={styles.avisoTexto}>Falta la sección. Volvé y entrá desde una carpeta.</Text>
          </View>
        )}

        <Text style={styles.label}>Nombre del Look</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Look para la facu"
          placeholderTextColor={colores.textoSuave}
          value={nombre}
          onChangeText={setNombre}
        />

        <View style={styles.reglaCaja}>
          <View style={styles.reglaFila}>
            <Ionicons
              name={reglaOk ? 'checkmark-circle' : 'alert-circle-outline'}
              size={18}
              color={reglaOk ? colores.lavandaFuerte : colores.rosaFuerte}
            />
            <Text style={styles.reglaTexto}>
              Seleccionadas: {seleccionadas.length}/{MINIMO_PRENDAS_LOOK} prendas mínimo
            </Text>
          </View>
          <View style={styles.barra}>
            <View style={[styles.barraRelleno, { width: `${Math.min((seleccionadas.length / MINIMO_PRENDAS_LOOK) * 100, 100)}%` }]} />
          </View>
        </View>

        <Text style={styles.label}>Elegí las prendas</Text>
        <View style={styles.grilla}>
          {prendas.map((prenda, index) => {
            const activa = seleccionadas.includes(prenda.id);
            const fuente = normalizarFuente(prenda.imagen);
            return (
              <Animated.View key={prenda.id} entering={FadeInDown.delay(index * 40).duration(300)} style={styles.prendaWrap}>
                <Pressable style={[styles.prenda, activa && styles.prendaSeleccionada]} onPress={() => alternar(prenda.id)}>
                  {activa && (
                    <View style={styles.check}><Ionicons name="checkmark" size={14} color={colores.blancoPuro} /></View>
                  )}
                  {fuente ? (
                    <Image source={fuente} style={styles.prendaImg} />
                  ) : (
                    <View style={[styles.prendaImg, styles.sinFoto]}>
                      <Ionicons name="image-outline" size={22} color={colores.rosaFuerte} />
                    </View>
                  )}
                  <Text style={styles.prendaNombre} numberOfLines={1}>{prenda.nombre}</Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.pie}>
        <Pressable
          style={[styles.botonGuardar, !puedeGuardar && styles.botonDeshabilitado]}
          disabled={!puedeGuardar}
          onPress={guardar}
        >
          <Text style={[styles.botonTexto, !puedeGuardar && styles.botonTextoApagado]}>
            {guardando ? 'Guardando...' : 'Guardar Look'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}