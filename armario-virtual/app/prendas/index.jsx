// app/prendas/index.jsx
// Catálogo de Prendas con tema dinámico. Pestañas: Todos / Superior / Inferior
// / Calzado / Accesorio. "Todos" por defecto. Buscador en tiempo real.
import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { obtenerPrendas } from '../../src/mocks/mockPrendas';
import PrendaCard from '../../src/features/prendas/components/PrendaCard';
import { useTheme } from '../../src/hooks/useTheme';
import Cargando from '../../src/components/Cargando';
import EstadoVacio from '../../src/components/EstadoVacio';
import { crearEstilos } from './index.styles';

const PESTANAS = ['Todos', 'Superior', 'Inferior', 'Calzado', 'Accesorio'];

export default function Catalogo() {
  const router = useRouter();

  // --- Tema dinámico ---
  const tema = useTheme();
  const { colores } = tema;
  const styles = useMemo(() => crearEstilos(tema), [tema]);

  const [prendas, setPrendas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [pestana, setPestana] = useState('Todos');

  useFocusEffect(
    useCallback(() => {
      let activo = true;
      const cargar = async () => {
        try {
          setCargando(true);
          const datos = await obtenerPrendas();
          if (activo) setPrendas(datos);
        } catch (error) {
          console.error('Error al cargar prendas:', error);
        } finally {
          if (activo) setCargando(false);
        }
      };
      cargar();
      return () => { activo = false; };
    }, [])
  );

  // Filtro por pestaña + búsqueda (blindado ante campos faltantes).
  const prendasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return prendas.filter((p) => {
      const enCategoria = pestana === 'Todos' || p?.categoria === pestana;
      const coincideNombre = (p?.nombre ?? '').toLowerCase().includes(texto);
      return enCategoria && coincideNombre;
    });
  }, [prendas, pestana, busqueda]);

  return (
    <View style={styles.contenedor}>
      {/* Buscador */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.buscador}>
        <Ionicons name="search" size={20} color={colores.textoSuave} />
        <TextInput
          style={styles.buscadorInput}
          placeholder="Buscar prenda..."
          placeholderTextColor={colores.textoSuave}
          value={busqueda}
          onChangeText={setBusqueda}
        />
        {busqueda.length > 0 && (
          <Pressable onPress={() => setBusqueda('')}>
            <Ionicons name="close-circle" size={20} color={colores.textoSuave} />
          </Pressable>
        )}
      </Animated.View>

      {/* Pestañas en scroll horizontal */}
      <Animated.View entering={FadeInDown.delay(80).duration(400)}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pestanas}>
          {PESTANAS.map((item) => {
            const activa = item === pestana;
            return (
              <Pressable key={item} onPress={() => setPestana(item)} style={[styles.pestana, activa && styles.pestanaActiva]}>
                <Text style={[styles.pestanaTexto, activa && styles.pestanaTextoActivo]}>{item}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </Animated.View>

      {/* Carga / vacío / lista */}
      {cargando ? (
        <Cargando mensaje="Cargando prendas..." />
      ) : prendasFiltradas.length === 0 ? (
        <EstadoVacio
          titulo="Nada por acá"
          mensaje={
            busqueda
              ? 'No encontramos prendas con ese nombre.'
              : pestana === 'Todos'
              ? 'Tu armario está vacío. Agregá tu primera prenda.'
              : `Todavía no tenés prendas en "${pestana}".`
          }
          textoBoton="Agregar prenda"
          onAccion={() => router.push('/prendas/formulario')}
        />
      ) : (
        <FlatList
          data={prendasFiltradas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 60).duration(400)}>
              <PrendaCard prenda={item} onPress={() => router.push(`/prendas/${item.id}`)} />
            </Animated.View>
          )}
        />
      )}

      <Pressable style={styles.fab} onPress={() => router.push('/prendas/formulario')}>
        <Ionicons name="add" size={28} color={colores.blancoPuro} />
      </Pressable>
    </View>
  );
}