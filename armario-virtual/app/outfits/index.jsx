// app/outfits/index.jsx
// Grilla de álbumes CON portada + modal para crear (con foto opcional).
// Portada: imagenPortada del álbum; si es null, primera prenda del primer look;
// si tampoco hay, placeholder. Navega a /outfits/album/[albumId].
import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, Image, Pressable, FlatList, Modal, TextInput, Alert, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { obtenerAlbumes, obtenerLooks, crearAlbum } from '../../src/mocks/mockOutfits';
import { obtenerPrendas } from '../../src/mocks/mockPrendas';
import { normalizarFuente } from '../../src/features/prendas/components/PrendaCard';
import Cargando from '../../src/components/Cargando';
import EstadoVacio from '../../src/components/EstadoVacio';
import { colores, espaciado, radios, tipografia, crearGlow } from '../../src/theme/tema';

const ordenarNuevoAViejo = (lista) =>
  [...lista].sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());

export default function MisOutfits() {
  const router = useRouter();
  const [albumes, setAlbumes] = useState([]);
  const [looks, setLooks] = useState([]);
  const [mapaPrendas, setMapaPrendas] = useState({});
  const [cargando, setCargando] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [nombreNuevo, setNombreNuevo] = useState('');
  const [portadaNueva, setPortadaNueva] = useState(null);
  const [creando, setCreando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let activo = true;
      (async () => {
        try {
          setCargando(true);
          const [alb, todosLooks, prendas] = await Promise.all([
            obtenerAlbumes(), obtenerLooks(), obtenerPrendas(),
          ]);
          if (!activo) return;
          setAlbumes(ordenarNuevoAViejo(alb));
          setLooks(todosLooks);
          setMapaPrendas(Object.fromEntries(prendas.map((p) => [p.id, p.imagen])));
        } catch (e) {
          console.error('Error al cargar secciones:', e);
        } finally {
          if (activo) setCargando(false);
        }
      })();
      return () => { activo = false; };
    }, [])
  );

  const primerLookPorAlbum = useMemo(() => {
    const mapa = {};
    for (const l of looks) if (!mapa[l.albumId]) mapa[l.albumId] = l;
    return mapa;
  }, [looks]);

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
      const nuevo = await crearAlbum(nombre, portadaNueva ?? null);
      setAlbumes((prev) => ordenarNuevoAViejo([...prev, nuevo]));
      cerrarModal();
    } catch (e) {
      console.error('Error al crear la sección:', e);
    } finally {
      setCreando(false);
    }
  };

  return (
    <View style={styles.contenedor}>
      {cargando ? (
        <Cargando mensaje="Cargando tus outfits..." />
      ) : albumes.length === 0 ? (
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

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.base },
  lista: { padding: espaciado.md, paddingBottom: 110 },
  encabezado: { fontSize: tipografia.titulo.tamano, fontWeight: tipografia.titulo.grosor, color: colores.texto, marginVertical: espaciado.md, marginLeft: espaciado.xs },
  fila: { gap: espaciado.md },
  tarjetaWrap: { flex: 1, marginBottom: espaciado.md },
  tarjeta: { backgroundColor: colores.superficie, borderRadius: radios.lg, overflow: 'hidden', ...crearGlow(colores.rosaFuerte) },
  portada: { width: '100%', height: 110, backgroundColor: colores.borde },
  portadaImg: { width: '100%', height: '100%' },
  portadaVacia: { justifyContent: 'center', alignItems: 'center', backgroundColor: colores.rosaPastel },
  nombre: { fontSize: tipografia.cuerpo.tamano, fontWeight: '700', color: colores.texto, textAlign: 'center', padding: espaciado.md },
  fab: { position: 'absolute', right: espaciado.lg, bottom: espaciado.lg, width: 58, height: 58, borderRadius: radios.circular, backgroundColor: colores.rosaFuerte, justifyContent: 'center', alignItems: 'center', ...crearGlow(colores.rosaFuerte) },
  overlay: { flex: 1, backgroundColor: 'rgba(74,68,88,0.4)', justifyContent: 'center', padding: espaciado.lg },
  modalCard: { backgroundColor: colores.superficie, borderRadius: radios.xl, padding: espaciado.lg, ...crearGlow(colores.lavandaFuerte) },
  modalTitulo: { fontSize: tipografia.subtitulo.tamano, fontWeight: '700', color: colores.texto, marginBottom: espaciado.md },
  previewWrap: { position: 'relative', marginBottom: espaciado.md },
  preview: { width: '100%', height: 120, borderRadius: radios.lg, backgroundColor: colores.borde },
  previewVacia: { justifyContent: 'center', alignItems: 'center', backgroundColor: colores.rosaPastel, marginBottom: espaciado.md },
  previewTexto: { color: colores.rosaFuerte, fontWeight: '600', marginTop: espaciado.xs, fontSize: tipografia.etiqueta.tamano },
  quitar: { position: 'absolute', top: espaciado.sm, right: espaciado.sm, width: 28, height: 28, borderRadius: radios.circular, backgroundColor: 'rgba(74,68,88,0.7)', justifyContent: 'center', alignItems: 'center' },
  pickerBotones: { flexDirection: 'row', gap: espaciado.md, marginBottom: espaciado.md },
  pickerBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: espaciado.sm, backgroundColor: colores.rosaPastel, paddingVertical: espaciado.sm, borderRadius: radios.md },
  pickerBtnTexto: { color: colores.texto, fontWeight: '600', fontSize: tipografia.etiqueta.tamano },
  modalInput: { backgroundColor: colores.base, borderWidth: 1, borderColor: colores.borde, borderRadius: radios.md, paddingHorizontal: espaciado.md, paddingVertical: espaciado.md, fontSize: tipografia.cuerpo.tamano, color: colores.texto },
  modalBotones: { flexDirection: 'row', gap: espaciado.md, marginTop: espaciado.lg },
  modalCancelar: { flex: 1, paddingVertical: espaciado.md, borderRadius: radios.lg, alignItems: 'center', borderWidth: 1, borderColor: colores.borde },
  modalCancelarTexto: { color: colores.textoSuave, fontWeight: '700' },
  modalCrear: { flex: 1, paddingVertical: espaciado.md, borderRadius: radios.lg, alignItems: 'center', backgroundColor: colores.rosaFuerte, ...crearGlow(colores.rosaFuerte) },
  modalCrearTexto: { color: colores.blancoPuro, fontWeight: '700' },
  botonApagado: { backgroundColor: colores.borde, shadowOpacity: 0, elevation: 0 },
});