// app/prendas/formulario.jsx
// TAREA 5 — Alta / Edición de Prenda (Soft/Glow UI).
// - Categorías estrictas: Superior / Inferior / Calzado / Accesorio.
// - Los botones de foto quedan SIEMPRE visibles: si ya hay imagen, cambian a
//   "Tomar nueva foto" / "Elegir otra", así es intuitivo reemplazarla.
// - Modo edición (hay id): precarga datos y muestra "Eliminar prenda".
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Pressable, Image, ScrollView,
  KeyboardAvoidingView, Platform, Alert, StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  agregarPrenda, actualizarPrenda, obtenerPrendaPorId, eliminarPrenda,
} from '../../src/mocks/mockPrendas';
import Cargando from '../../src/components/Cargando';
import { colores, espaciado, radios, tipografia, crearGlow } from '../../src/theme/tema';

// Categorías estrictas (sin "Abrigo" ni "Ropa").
const CATEGORIAS = ['Superior', 'Inferior', 'Calzado', 'Accesorio'];
const TEMPORADAS = ['Primavera / Verano', 'Otoño / Invierno', 'Transición', 'Todo el año'];

export default function FormularioPrenda() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const esEdicion = Boolean(id);

  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [temporada, setTemporada] = useState('');
  const [imagen, setImagen] = useState(null);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(esEdicion);

  useEffect(() => {
    if (!esEdicion) return;
    let activo = true;
    const precargar = async () => {
      try {
        const prenda = await obtenerPrendaPorId(id);
        if (activo && prenda) {
          setNombre(prenda.nombre ?? '');
          setCategoria(prenda.categoria ?? '');
          setTemporada(prenda.temporada ?? '');
          setImagen(prenda.imagen ?? null);
        }
      } catch (error) {
        console.error('Error al precargar la prenda:', error);
      } finally {
        if (activo) setCargando(false);
      }
    };
    precargar();
    return () => { activo = false; };
  }, [id, esEdicion]);

  const tomarFoto = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Permiso necesario', 'Necesitamos acceso a la cámara.');
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'], allowsEditing: true, aspect: [4, 5], quality: 0.7,
    });
    if (!resultado.canceled) setImagen(resultado.assets[0].uri);
  };

  const elegirDeGaleria = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Permiso necesario', 'Necesitamos acceso a tu galería.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, aspect: [4, 5], quality: 0.7,
    });
    if (!resultado.canceled) setImagen(resultado.assets[0].uri);
  };

  const validar = () => {
    const e = {};
    if (!nombre.trim()) e.nombre = 'El nombre es obligatorio.';
    if (!categoria) e.categoria = 'Elegí una categoría.';
    if (!temporada) e.temporada = 'Elegí una temporada.';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const guardar = async () => {
    if (!validar()) return;
    // La imagen es opcional: si no hay, se guarda null (el mock ya no inventa URLs).
    const datos = { nombre: nombre.trim(), categoria, temporada, imagen: imagen ?? null };
    try {
      setGuardando(true);
      if (esEdicion) await actualizarPrenda(id, datos);
      else await agregarPrenda(datos);
      router.back();
    } catch (error) {
      console.error('Error al guardar la prenda:', error);
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEliminar = () => {
    Alert.alert(
      'Eliminar prenda',
      '¿Seguro que querés eliminar esta prenda? No se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarPrenda(id);
              router.replace('/prendas'); // volvemos al catálogo ya actualizado
            } catch (error) {
              console.error('Error al eliminar la prenda:', error);
            }
          },
        },
      ]
    );
  };

  if (cargando) return <Cargando mensaje="Cargando datos..." />;

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={styles.titulo}>{esEdicion ? 'Editar prenda' : 'Nueva prenda'}</Text>
        </Animated.View>

        {/* Nombre */}
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={[styles.input, errores.nombre && styles.inputError]}
          placeholder="Ej: Campera de jean"
          placeholderTextColor={colores.textoSuave}
          value={nombre}
          onChangeText={setNombre}
        />
        {errores.nombre ? <Text style={styles.error}>{errores.nombre}</Text> : null}

        {/* Categoría */}
        <Text style={styles.label}>Categoría</Text>
        <View style={styles.grupoPills}>
          {CATEGORIAS.map((cat) => {
            const activa = cat === categoria;
            return (
              <Pressable
                key={cat}
                onPress={() => setCategoria(cat)}
                style={[styles.pill, activa && styles.pillCategoriaActiva]}
              >
                <Text style={[styles.pillTexto, activa && styles.pillTextoActivo]}>{cat}</Text>
              </Pressable>
            );
          })}
        </View>
        {errores.categoria ? <Text style={styles.error}>{errores.categoria}</Text> : null}

        {/* Temporada */}
        <Text style={styles.label}>Temporada</Text>
        <View style={styles.grupoPills}>
          {TEMPORADAS.map((temp) => {
            const activa = temp === temporada;
            return (
              <Pressable
                key={temp}
                onPress={() => setTemporada(temp)}
                style={[styles.pill, activa && styles.pillTemporadaActiva]}
              >
                <Text style={[styles.pillTexto, activa && styles.pillTextoActivo]}>{temp}</Text>
              </Pressable>
            );
          })}
        </View>
        {errores.temporada ? <Text style={styles.error}>{errores.temporada}</Text> : null}

        {/* Foto: los botones quedan SIEMPRE visibles. Si ya hay imagen, cambian
            de texto para dejar claro que se puede reemplazar. */}
        <Text style={styles.label}>Foto</Text>
        <View style={styles.botonesFoto}>
          <Pressable style={styles.botonFoto} onPress={tomarFoto}>
            <Ionicons name="camera-outline" size={20} color={colores.texto} />
            <Text style={styles.botonFotoTexto}>
              {imagen ? 'Tomar nueva foto' : 'Tomar Foto'}
            </Text>
          </Pressable>
          <Pressable style={styles.botonFoto} onPress={elegirDeGaleria}>
            <Ionicons name="images-outline" size={20} color={colores.texto} />
            <Text style={styles.botonFotoTexto}>
              {imagen ? 'Elegir otra' : 'Subir de Galería'}
            </Text>
          </Pressable>
        </View>

        {/* Previsualización (bordes muy suaves) con opción de quitar la foto. */}
        {imagen && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.previewWrap}>
            <Image source={{ uri: imagen }} style={styles.preview} />
            <Pressable style={styles.quitarFoto} onPress={() => setImagen(null)}>
              <Ionicons name="close" size={18} color={colores.blancoPuro} />
            </Pressable>
          </Animated.View>
        )}

        {/* Guardar: siempre disponible (la foto es opcional). */}
        <Pressable
          style={[styles.botonGuardar, guardando && styles.botonDeshabilitado]}
          onPress={guardar}
          disabled={guardando}
        >
          <Text style={styles.botonGuardarTexto}>
            {guardando ? 'Guardando...' : 'Guardar prenda'}
          </Text>
        </Pressable>

        {/* Eliminar: SOLO en modo edición. */}
        {esEdicion && (
          <Pressable style={styles.botonEliminar} onPress={confirmarEliminar}>
            <Ionicons name="trash-outline" size={18} color={colores.error} />
            <Text style={styles.botonEliminarTexto}>Eliminar prenda</Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.base },
  contenido: { padding: espaciado.lg, paddingBottom: espaciado.xl },
  titulo: {
    fontSize: tipografia.titulo.tamano, fontWeight: tipografia.titulo.grosor,
    color: colores.texto, marginBottom: espaciado.md,
  },
  label: {
    fontSize: tipografia.etiqueta.tamano, fontWeight: '600', color: colores.texto,
    marginTop: espaciado.lg, marginBottom: espaciado.xs,
  },
  input: {
    backgroundColor: colores.superficie, borderWidth: 1, borderColor: colores.borde,
    borderRadius: radios.md, paddingHorizontal: espaciado.md, paddingVertical: espaciado.md,
    fontSize: tipografia.cuerpo.tamano, color: colores.texto,
  },
  inputError: { borderColor: colores.error },
  error: { color: colores.error, fontSize: tipografia.etiqueta.tamano, marginTop: espaciado.xs },
  grupoPills: { flexDirection: 'row', flexWrap: 'wrap', gap: espaciado.sm },
  pill: {
    paddingVertical: espaciado.sm, paddingHorizontal: espaciado.md,
    borderRadius: radios.circular, backgroundColor: colores.superficie,
    borderWidth: 1, borderColor: colores.borde,
  },
  pillCategoriaActiva: { backgroundColor: colores.lavanda, borderColor: colores.lavandaFuerte },
  pillTemporadaActiva: { backgroundColor: colores.rosaPastel, borderColor: colores.rosaFuerte },
  pillTexto: { fontSize: tipografia.etiqueta.tamano, color: colores.texto },
  pillTextoActivo: { color: colores.texto, fontWeight: '700' },
  botonesFoto: { flexDirection: 'row', gap: espaciado.md },
  botonFoto: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: espaciado.sm, backgroundColor: colores.rosaPastel,
    paddingVertical: espaciado.md, borderRadius: radios.md,
  },
  botonFotoTexto: { fontSize: tipografia.etiqueta.tamano, fontWeight: '600', color: colores.texto },
  previewWrap: { marginTop: espaciado.lg, position: 'relative' },
  preview: {
    width: '100%', height: 320, borderRadius: radios.xl, backgroundColor: colores.borde,
  },
  // Botón "quitar foto" flotante sobre la previsualización.
  quitarFoto: {
    position: 'absolute', top: espaciado.sm, right: espaciado.sm,
    width: 32, height: 32, borderRadius: radios.circular,
    backgroundColor: 'rgba(74,68,88,0.7)', justifyContent: 'center', alignItems: 'center',
  },
  botonGuardar: {
    backgroundColor: colores.rosaFuerte, paddingVertical: espaciado.md,
    borderRadius: radios.lg, alignItems: 'center', marginTop: espaciado.lg,
    ...crearGlow(colores.rosaFuerte),
  },
  botonDeshabilitado: { opacity: 0.6 },
  botonGuardarTexto: {
    color: colores.blancoPuro, fontSize: tipografia.subtitulo.tamano, fontWeight: '700',
  },
  botonEliminar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: espaciado.sm,
    backgroundColor: colores.rojoSuave, paddingVertical: espaciado.md,
    borderRadius: radios.lg, marginTop: espaciado.md,
    borderWidth: 1, borderColor: colores.error,
  },
  botonEliminarTexto: { color: colores.error, fontSize: tipografia.cuerpo.tamano, fontWeight: '700' },
});