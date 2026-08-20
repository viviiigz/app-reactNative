// app/prendas/[id].jsx
// Detalle de una prenda con tema dinámico. Lee el id de la ruta, busca en el
// mock y normaliza la fuente de imagen (require / uri / sin foto).
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { obtenerPrendaPorId } from '../../src/mocks/mockPrendas';
import { useTheme } from '../../src/hooks/useTheme';
import { normalizarFuente } from '../../src/utils/imagenes';
import Cargando from '../../src/components/Cargando';
import EstadoVacio from '../../src/components/EstadoVacio';
import { crearEstilos } from './[id].styles';

export default function DetallePrenda() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // --- Tema dinámico ---
  const tema = useTheme();
  const { colores } = tema;
  const styles = useMemo(() => crearEstilos(tema), [tema]);

  const [prenda, setPrenda] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      try {
        setCargando(true);
        const datos = await obtenerPrendaPorId(id);
        if (activo) setPrenda(datos);
      } catch (error) {
        console.error('Error al cargar la prenda:', error);
      } finally {
        if (activo) setCargando(false);
      }
    };
    cargar();
    return () => { activo = false; };
  }, [id]);

  if (cargando) return <Cargando mensaje="Cargando prenda..." />;

  if (!prenda) {
    return (
      <EstadoVacio
        titulo="Prenda no encontrada"
        mensaje="La prenda que buscás no existe o fue eliminada."
        textoBoton="Volver al listado"
        onAccion={() => router.replace('/prendas')}
      />
    );
  }

  const fuente = normalizarFuente(prenda.imagen);

  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={styles.contenido}>
      <Animated.View entering={FadeInDown.duration(400)}>
        {fuente ? (
          <Image source={fuente} style={styles.imagen} />
        ) : (
          <View style={[styles.imagen, styles.sinFoto]}>
            <Ionicons name="image-outline" size={56} color={colores.rosaFuerte} />
            <Text style={styles.sinFotoTexto}>Sin foto</Text>
          </View>
        )}
      </Animated.View>

      <Text style={styles.nombre}>{prenda.nombre}</Text>

      <View style={styles.fila}>
        <Text style={styles.etiqueta}>Categoría</Text>
        <Text style={styles.valor}>{prenda.categoria}</Text>
      </View>
      <View style={styles.fila}>
        <Text style={styles.etiqueta}>Temporada</Text>
        <Text style={styles.valor}>{prenda.temporada}</Text>
      </View>

      <Pressable
        style={styles.botonEditar}
        onPress={() => router.push({ pathname: '/prendas/formulario', params: { id: prenda.id } })}
      >
        <Ionicons name="create-outline" size={20} color={colores.blancoPuro} />
        <Text style={styles.textoBotonEditar}>Editar prenda</Text>
      </Pressable>
    </ScrollView>
  );
}