// app/outfits/crear.jsx
// Creador de Look: captura albumId de la URL, selección de prendas (mín. 3) y
// nombre del look. Al guardar, lo asocia al álbum vía mock y hace router.back().
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Image, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { obtenerPrendas } from '../../src/mocks/mockPrendas';
import { crearLook } from '../../src/mocks/mockOutfits';
import { normalizarFuente } from '../../src/features/prendas/components/PrendaCard';
import Cargando from '../../src/components/Cargando';
import { colores, espaciado, radios, tipografia, crearGlow } from '../../src/theme/tema';

const MINIMO = 3;

export default function CrearLook() {
  const router = useRouter();
  const { albumId } = useLocalSearchParams();

  const [prendas, setPrendas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nombre, setNombre] = useState('');
  const [prendasSeleccionadas, setPrendasSeleccionadas] = useState([]);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        setCargando(true);
        const datos = await obtenerPrendas();
        if (activo) setPrendas(datos);
      } catch (e) {
        console.error('Error al cargar prendas:', e);
      } finally {
        if (activo) setCargando(false);
      }
    })();
    return () => { activo = false; };
  }, []);

  const alternar = (idPrenda) => {
    setPrendasSeleccionadas((prev) =>
      prev.includes(idPrenda) ? prev.filter((x) => x !== idPrenda) : [...prev, idPrenda]
    );
  };

  const seleccionadas = prendasSeleccionadas.length;
  const nombreOk = nombre.trim().length > 0;
  const cumpleRegla = seleccionadas >= MINIMO;
  const puedeGuardar = nombreOk && cumpleRegla && !guardando;

  const guardar = async () => {
    if (!puedeGuardar) return;
    try {
      setGuardando(true);
      await crearLook({ albumId, nombre: nombre.trim(), prendasIds: prendasSeleccionadas });
      router.back();
    } catch (e) {
      console.error('Error al guardar el look:', e);
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
              name={cumpleRegla ? 'checkmark-circle' : 'alert-circle-outline'}
              size={18}
              color={cumpleRegla ? colores.lavandaFuerte : colores.rosaFuerte}
            />
            <Text style={styles.reglaTexto}>Seleccionadas: {seleccionadas}/{MINIMO} prendas mínimo</Text>
          </View>
          <View style={styles.barra}>
            <View style={[styles.barraRelleno, { width: `${Math.min((seleccionadas / MINIMO) * 100, 100)}%` }]} />
          </View>
        </View>

        <Text style={styles.label}>Elegí las prendas</Text>
        <View style={styles.grilla}>
          {prendas.map((prenda, index) => {
            const activa = prendasSeleccionadas.includes(prenda.id);
            const fuente = normalizarFuente(prenda.imagen);
            return (
              <Animated.View key={prenda.id} entering={FadeInDown.delay(index * 40).duration(300)} style={styles.prendaWrap}>
                <Pressable style={[styles.prenda, activa && styles.prendaSeleccionada]} onPress={() => alternar(prenda.id)}>
                  {activa && (
                    <View style={styles.check}>
                      <Ionicons name="checkmark" size={14} color={colores.blancoPuro} />
                    </View>
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

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.base },
  contenido: { padding: espaciado.lg, paddingBottom: espaciado.xl },
  aviso: {
    flexDirection: 'row', alignItems: 'center', gap: espaciado.sm,
    backgroundColor: colores.rojoSuave, borderRadius: radios.md,
    padding: espaciado.md, marginBottom: espaciado.md, borderWidth: 1, borderColor: colores.error,
  },
  avisoTexto: { color: colores.error, fontSize: tipografia.etiqueta.tamano, flex: 1 },
  label: {
    fontSize: tipografia.etiqueta.tamano, fontWeight: '600', color: colores.texto,
    marginTop: espaciado.lg, marginBottom: espaciado.xs,
  },
  input: {
    backgroundColor: colores.superficie, borderWidth: 1, borderColor: colores.borde,
    borderRadius: radios.md, paddingHorizontal: espaciado.md, paddingVertical: espaciado.md,
    fontSize: tipografia.cuerpo.tamano, color: colores.texto,
  },
  reglaCaja: {
    backgroundColor: colores.superficie, borderRadius: radios.lg,
    padding: espaciado.md, marginTop: espaciado.lg, ...crearGlow(colores.rosaFuerte),
  },
  reglaFila: { flexDirection: 'row', alignItems: 'center', gap: espaciado.sm },
  reglaTexto: { fontSize: tipografia.cuerpo.tamano, color: colores.texto, fontWeight: '600' },
  barra: { height: 8, backgroundColor: colores.borde, borderRadius: radios.circular, marginTop: espaciado.sm, overflow: 'hidden' },
  barraRelleno: { height: '100%', backgroundColor: colores.rosaFuerte, borderRadius: radios.circular },
  grilla: { flexDirection: 'row', flexWrap: 'wrap', gap: espaciado.md },
  prendaWrap: { width: '30%' },
  prenda: {
    backgroundColor: colores.superficie, borderRadius: radios.lg, padding: espaciado.sm,
    alignItems: 'center', borderWidth: 3, borderColor: 'transparent',
  },
  prendaSeleccionada: { borderColor: colores.rosaFuerte },
  check: {
    position: 'absolute', top: 6, right: 6, width: 22, height: 22,
    borderRadius: radios.circular, backgroundColor: colores.rosaFuerte,
    justifyContent: 'center', alignItems: 'center', zIndex: 2,
  },
  prendaImg: { width: '100%', height: 80, borderRadius: radios.md, backgroundColor: colores.borde },
  sinFoto: { justifyContent: 'center', alignItems: 'center', backgroundColor: colores.rosaPastel },
  prendaNombre: { fontSize: tipografia.etiqueta.tamano, color: colores.texto, textAlign: 'center', marginTop: espaciado.xs },
  pie: { padding: espaciado.lg, borderTopWidth: 1, borderTopColor: colores.borde, backgroundColor: colores.base },
  botonGuardar: {
    backgroundColor: colores.rosaFuerte, paddingVertical: espaciado.md,
    borderRadius: radios.lg, alignItems: 'center', ...crearGlow(colores.rosaFuerte),
  },
  botonDeshabilitado: { backgroundColor: colores.borde, shadowOpacity: 0, elevation: 0 },
  botonTexto: { color: colores.blancoPuro, fontSize: tipografia.subtitulo.tamano, fontWeight: '700' },
  botonTextoApagado: { color: colores.textoSuave },
});