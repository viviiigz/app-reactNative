// app/prendas/formulario.jsx
// Alta / Edición de Prenda con tema DINÁMICO (useTheme + crearEstilos).
// - Categorías estrictas: Superior / Inferior / Calzado / Accesorio.
// - Botones de foto siempre visibles (cambian de texto si ya hay imagen).
// - Modo edición (hay id): precarga datos y muestra "Eliminar prenda".
import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, TextInput, Pressable, Image, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  agregarPrenda, actualizarPrenda, obtenerPrendaPorId, eliminarPrenda,
} from '../../src/mocks/mockPrendas';
import { useTheme } from '../../src/hooks/useTheme';
import Cargando from '../../src/components/Cargando';
import { crearEstilos } from './formulario.styles';

const CATEGORIAS = ['Superior', 'Inferior', 'Calzado', 'Accesorio'];
const TEMPORADAS = ['Primavera / Verano', 'Otoño / Invierno', 'Transición', 'Todo el año'];

export default function FormularioPrenda() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const esEdicion = Boolean(id);

  // --- Tema dinámico ---
  const tema = useTheme();
  const { colores } = tema;
  const styles = useMemo(() => crearEstilos(tema), [tema]);

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
    if (!permiso.granted) return Alert.alert('Permiso necesario', 'Necesitamos acceso a la cámara.');
    const r = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [4, 5], quality: 0.7 });
    if (!r.canceled) setImagen(r.assets[0].uri);
  };

  const elegirDeGaleria = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) return Alert.alert('Permiso necesario', 'Necesitamos acceso a tu galería.');
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [4, 5], quality: 0.7 });
    if (!r.canceled) setImagen(r.assets[0].uri);
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
    Alert.alert('Eliminar prenda', '¿Seguro que querés eliminar esta prenda? No se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          try { await eliminarPrenda(id); router.replace('/prendas'); }
          catch (error) { console.error('Error al eliminar la prenda:', error); }
        },
      },
    ]);
  };

  if (cargando) return <Cargando mensaje="Cargando datos..." />;

  return (
    <KeyboardAvoidingView style={styles.contenedor} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
              <Pressable key={cat} onPress={() => setCategoria(cat)} style={[styles.pill, activa && styles.pillCategoriaActiva]}>
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
              <Pressable key={temp} onPress={() => setTemporada(temp)} style={[styles.pill, activa && styles.pillTemporadaActiva]}>
                <Text style={[styles.pillTexto, activa && styles.pillTextoActivo]}>{temp}</Text>
              </Pressable>
            );
          })}
        </View>
        {errores.temporada ? <Text style={styles.error}>{errores.temporada}</Text> : null}

        {/* Foto */}
        <Text style={styles.label}>Foto</Text>
        <View style={styles.botonesFoto}>
          <Pressable style={styles.botonFoto} onPress={tomarFoto}>
            <Ionicons name="camera-outline" size={20} color={colores.texto} />
            <Text style={styles.botonFotoTexto}>{imagen ? 'Tomar nueva foto' : 'Tomar Foto'}</Text>
          </Pressable>
          <Pressable style={styles.botonFoto} onPress={elegirDeGaleria}>
            <Ionicons name="images-outline" size={20} color={colores.texto} />
            <Text style={styles.botonFotoTexto}>{imagen ? 'Elegir otra' : 'Subir de Galería'}</Text>
          </Pressable>
        </View>

        {/* Previsualización */}
        {imagen && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.previewWrap}>
            <Image source={{ uri: imagen }} style={styles.preview} />
            <Pressable style={styles.quitarFoto} onPress={() => setImagen(null)}>
              <Ionicons name="close" size={18} color={colores.blancoPuro} />
            </Pressable>
          </Animated.View>
        )}

        {/* Guardar */}
        <Pressable style={[styles.botonGuardar, guardando && styles.botonDeshabilitado]} onPress={guardar} disabled={guardando}>
          <Text style={styles.botonGuardarTexto}>{guardando ? 'Guardando...' : 'Guardar prenda'}</Text>
        </Pressable>

        {/* Eliminar: solo en edición */}
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