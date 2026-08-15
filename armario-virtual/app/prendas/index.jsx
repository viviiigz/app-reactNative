// app/prendas/index.jsx
// Pantalla 2: Listado de prendas. Consume el mock y renderiza PrendaCard.
// Maneja los tres estados: cargando, vacío y con datos.
import React, { useCallback, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { obtenerPrendas } from '../../src/mocks/mockPrendas';
import PrendaCard from '../../src/features/prendas/components/PrendaCard';
import Cargando from '../../src/components/Cargando';
// import EstadoVacio from '../../src/components/EstadoVacio';
import { colores, espaciado, radios, tipografia } from '../../src/theme/tema';

export default function ListadoPrendas() {
  const router = useRouter();
  const [prendas, setPrendas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Se recarga al enfocar la pantalla, así aparecen las prendas nuevas.
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
      return () => {
        activo = false;
      };
    }, [])
  );

  if (cargando) return <Cargando mensaje="Cargando prendas..." />;

  return (
    <View style={styles.contenedor}>
      {prendas.length === 0 ? (
        <EstadoVacio
          titulo="Tu armario está vacío"
          mensaje="Agregá tu primera prenda para empezar a organizarte."
          textoBoton="Agregar prenda"
          onAccion={() => router.push('/prendas/formulario')}
        />
      ) : (
        <FlatList
          data={prendas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <PrendaCard
              prenda={item}
              onPress={() => router.push(`/prendas/${item.id}`)}
            />
          )}
        />
      )}

      {/* Botón flotante para agregar una prenda nueva. */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/prendas/formulario')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  lista: {
    padding: espaciado.md,
  },
  fab: {
    position: 'absolute',
    right: espaciado.lg,
    bottom: espaciado.lg,
    width: 56,
    height: 56,
    borderRadius: radios.circular,
    backgroundColor: colores.primario,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabTexto: {
    color: colores.superficie,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '600',
  },
});