// app/prendas/[id].jsx
// Pantalla 3: Detalle de una prenda (Soft/Glow UI).
// Lee el id de la ruta, busca en el mock y normaliza la fuente de imagen.
import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { obtenerPrendaPorId } from '../../src/mocks/mockPrendas';
import { normalizarFuente } from '../../src/features/prendas/components/PrendaCard';
import Cargando from '../../src/components/Cargando';
import EstadoVacio from '../../src/components/EstadoVacio';
import { colores, espaciado, radios, tipografia, crearGlow } from '../../src/theme/tema';

export default function DetallePrenda() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
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
          // Placeholder "Sin foto" a lo grande para el detalle.
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
        onPress={() =>
          router.push({ pathname: '/prendas/formulario', params: { id: prenda.id } })
        }
      >
        <Ionicons name="create-outline" size={20} color={colores.blancoPuro} />
        <Text style={styles.textoBotonEditar}>Editar prenda</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.base },
  contenido: { padding: espaciado.lg },
  imagen: {
    width: '100%',
    height: 340,
    borderRadius: radios.xl,
    backgroundColor: colores.borde,
    marginBottom: espaciado.lg,
  },
  sinFoto: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colores.rosaPastel,
  },
  sinFotoTexto: {
    marginTop: espaciado.sm,
    color: colores.rosaFuerte,
    fontSize: tipografia.cuerpo.tamano,
    fontWeight: '600',
  },
  nombre: {
    fontSize: tipografia.titulo.tamano,
    fontWeight: tipografia.titulo.grosor,
    color: colores.texto,
    marginBottom: espaciado.lg,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: espaciado.md,
    borderBottomWidth: 1,
    borderBottomColor: colores.borde,
  },
  etiqueta: { fontSize: tipografia.cuerpo.tamano, color: colores.textoSuave },
  valor: { fontSize: tipografia.cuerpo.tamano, color: colores.texto, fontWeight: '600' },
  botonEditar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.sm,
    backgroundColor: colores.rosaFuerte,
    paddingVertical: espaciado.md,
    borderRadius: radios.lg,
    alignItems: 'center',
    marginTop: espaciado.xl,
    ...crearGlow(colores.rosaFuerte),
  },
  textoBotonEditar: {
    color: colores.blancoPuro,
    fontSize: tipografia.subtitulo.tamano,
    fontWeight: '600',
  },
});