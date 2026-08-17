// app/prendas/index.jsx
// TAREA 5 — Catálogo de Prendas.
// Pestañas estrictas: Todos / Superior / Inferior / Calzado / Accesorio.
// "Todos" viene seleccionado por defecto y muestra el catálogo completo.
import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { obtenerPrendas } from '../../src/mocks/mockPrendas';
import PrendaCard from '../../src/features/prendas/components/PrendaCard';
import Cargando from '../../src/components/Cargando';
import EstadoVacio from '../../src/components/EstadoVacio';
import { colores, espaciado, radios, tipografia, crearGlow } from '../../src/theme/tema';

// Pestañas de filtrado. "Todos" es un caso especial (no filtra por categoría).
const PESTANAS = ['Todos', 'Superior', 'Inferior', 'Calzado', 'Accesorio'];

export default function Catalogo() {
  const router = useRouter();
  const [prendas, setPrendas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [pestana, setPestana] = useState('Todos'); // seleccionada por defecto

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

  // Filtro blindado: "Todos" no filtra por categoría; el resto compara directo.
  // El uso de p?.categoria y (p?.nombre ?? '') evita crashes si falta un campo.
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

      {/* Pestañas: en scroll horizontal para que las 5 entren cómodas. */}
      <Animated.View entering={FadeInDown.delay(80).duration(400)}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pestanas}
        >
          {PESTANAS.map((item) => {
            const activa = item === pestana;
            return (
              <Pressable
                key={item}
                onPress={() => setPestana(item)}
                style={[styles.pestana, activa && styles.pestanaActiva]}
              >
                <Text style={[styles.pestanaTexto, activa && styles.pestanaTextoActivo]}>
                  {item}
                </Text>
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

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.base },
  buscador: {
    flexDirection: 'row', alignItems: 'center', gap: espaciado.sm,
    backgroundColor: colores.superficie, marginHorizontal: espaciado.md,
    marginTop: espaciado.md, paddingHorizontal: espaciado.md,
    paddingVertical: espaciado.sm, borderRadius: radios.lg,
    ...crearGlow(colores.rosaFuerte),
  },
  buscadorInput: { flex: 1, fontSize: tipografia.cuerpo.tamano, color: colores.texto },
  // paddingHorizontal en el content para que la primera/última píldora respiren.
  pestanas: {
    flexDirection: 'row', gap: espaciado.sm,
    paddingHorizontal: espaciado.md, paddingVertical: espaciado.md,
  },
  pestana: {
    paddingVertical: espaciado.sm, paddingHorizontal: espaciado.lg,
    borderRadius: radios.circular, backgroundColor: colores.superficie,
    alignItems: 'center', borderWidth: 1, borderColor: colores.borde,
  },
  pestanaActiva: { backgroundColor: colores.rosaFuerte, borderColor: colores.rosaFuerte },
  pestanaTexto: { fontSize: tipografia.etiqueta.tamano, fontWeight: '600', color: colores.texto },
  pestanaTextoActivo: { color: colores.blancoPuro },
  lista: { padding: espaciado.md, paddingBottom: 96 },
  fab: {
    position: 'absolute', right: espaciado.lg, bottom: espaciado.lg,
    width: 58, height: 58, borderRadius: radios.circular,
    backgroundColor: colores.rosaFuerte, justifyContent: 'center',
    alignItems: 'center', ...crearGlow(colores.rosaFuerte),
  },
});