// app/outfits/index.jsx
// Grilla de álbumes CON portada + modal para crear (con foto opcional).
// Tema dinámico (useTheme + crearEstilos) y datos vía useOutfits.
import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, Image, Pressable, FlatList, Modal, TextInput, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useOutfits } from '../../src/features/outfits/hooks/useOutfits';
import { useTheme } from '../../src/hooks/useTheme';
import { normalizarFuente } from '../../src/utils/imagenes';
import Cargando from '../../src/components/Cargando';
import EstadoVacio from '../../src/components/EstadoVacio';
import { crearEstilos } from './index.styles';

export default function MisOutfits() {
  const router = useRouter();

  // --- Tema dinámico ---
  const tema = useTheme();
  const { colores } = tema;
  const styles = useMemo(() => crearEstilos(tema), [tema]);

  // --- Datos ---
  const { albumes, looks, mapaPrendas, cargando, cargarInicio, crearNuevoAlbum } = useOutfits();
  useFocusEffect(useCallback(() => { cargarInicio(); }, [cargarInicio]));

  // --- Estado del modal ---
  const [modalVisible, setModalVisible] = useState(false);
  const [nombreNuevo, setNombreNuevo] = useState('');
  const [portadaNueva, setPortadaNueva] = useState(null);
  const [creando, setCreando] = useState(false);

  // Primer look por álbum (para el fallback de portada).
  const primerLookPorAlbum = useMemo(() => {
    const mapa = {};
    for (const l of looks) if (!mapa[l.albumId]) mapa[l.albumId] = l;
    return mapa;
  }, [looks]);

  // Portada: imagenPortada propia → primera prenda del 1er look → null.
  const fuentePortada = (album) => {
    const propia = normalizarFuente(album.imagenPortada);
    if (propia) return propia;
    const look = primerLookPorAlbum[album.id];
    return normalizarFuente(mapaPrendas[look?.prendasIds?.[0]]);
  };

  const tomarPortada = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) return Alert.alert('Permiso necesario', 'Necesitamos la cámara.');
    const r = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [16, 9], quality: 0.7 });
    if (!r.canceled) setPortadaNueva(r.assets[0].uri);
  };
  const elegirPortada = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) return Alert.alert('Permiso necesario', 'Necesitamos la galería.');
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [16, 9], quality: 0.7 });
    if (!r.canceled) setPortadaNueva(r.assets[0].uri);
  };

  const cerrarModal = () => { setNombreNuevo(''); setPortadaNueva(null); setModalVisible(false); };

  const confirmarCrear = async () => {
    const nombre = nombreNuevo.trim();
    if (!nombre) return;
    try {
      setCreando(true);
      await crearNuevoAlbum(nombre, portadaNueva ?? null);
      cerrarModal();
    } catch (e) {
      console.error('Error al crear la sección:', e);
    } finally {
      setCreando(false);
    }
  };

  if (cargando) return <Cargando mensaje="Cargando tus outfits..." />;

  return (
    <View style={styles.contenedor}>
      {albumes.length === 0 ? (
        <EstadoVacio
          titulo="Sin secciones"
          icono="folder-open-outline"
          mensaje="Creá tu primera sección para organizar tus looks."
          textoBoton="Nueva sección"
          onAccion={() => setModalVisible(true)}
        />
      ) : (
        <FlatList
          data={albumes}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.fila}
          contentContainerStyle={styles.lista}
          ListHeaderComponent={<Text style={styles.encabezado}>Mis Outfits</Text>}
          renderItem={({ item, index }) => {
            const portada = fuentePortada(item);
            return (
              <Animated.View entering={FadeInDown.delay(index * 70).duration(400)} style={styles.tarjetaWrap}>
                <Pressable style={styles.tarjeta} onPress={() => router.push(`/outfits/album/${item.id}`)}>
                  <View style={styles.portada}>
                    {portada ? (
                      <Image source={portada} style={styles.portadaImg} />
                    ) : (
                      <View style={[styles.portadaImg, styles.portadaVacia]}>
                        <Ionicons name="folder" size={36} color={colores.rosaFuerte} />
                      </View>
                    )}
                  </View>
                  <Text style={styles.nombre} numberOfLines={1}>{item.nombre}</Text>
                </Pressable>
              </Animated.View>
            );
          }}
        />
      )}

      <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color={colores.blancoPuro} />
      </Pressable>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={cerrarModal}>
        <View style={styles.overlay}>
          <Animated.View entering={FadeInDown.duration(300)} style={styles.modalCard}>
            <Text style={styles.modalTitulo}>Nueva sección de outfits</Text>

            {portadaNueva ? (
              <View style={styles.previewWrap}>
                <Image source={{ uri: portadaNueva }} style={styles.preview} />
                <Pressable style={styles.quitar} onPress={() => setPortadaNueva(null)}>
                  <Ionicons name="close" size={16} color={colores.blancoPuro} />
                </Pressable>
              </View>
            ) : (
              <View style={[styles.preview, styles.previewVacia]}>
                <Ionicons name="image-outline" size={30} color={colores.rosaFuerte} />
                <Text style={styles.previewTexto}>Portada (opcional)</Text>
              </View>
            )}

            <View style={styles.pickerBotones}>
              <Pressable style={styles.pickerBtn} onPress={tomarPortada}>
                <Ionicons name="camera-outline" size={18} color={colores.texto} />
                <Text style={styles.pickerBtnTexto}>Cámara</Text>
              </Pressable>
              <Pressable style={styles.pickerBtn} onPress={elegirPortada}>
                <Ionicons name="images-outline" size={18} color={colores.texto} />
                <Text style={styles.pickerBtnTexto}>Galería</Text>
              </Pressable>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Nombre (ej: Gym, Facultad...)"
              placeholderTextColor={colores.textoSuave}
              value={nombreNuevo}
              onChangeText={setNombreNuevo}
            />

            <View style={styles.modalBotones}>
              <Pressable style={styles.modalCancelar} onPress={cerrarModal}>
                <Text style={styles.modalCancelarTexto}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalCrear, (!nombreNuevo.trim() || creando) && styles.botonApagado]}
                onPress={confirmarCrear}
                disabled={!nombreNuevo.trim() || creando}
              >
                <Text style={styles.modalCrearTexto}>{creando ? 'Creando...' : 'Crear'}</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}