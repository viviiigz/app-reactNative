// app/prendas/[id].jsx
// Pantalla 3: Detalle de una prenda. Lee el id de la ruta y lo busca en el mock.
// Maneja cargando, "no encontrada" (vacío) y datos.
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { obtenerPrendaPorId } from '../../src/mocks/mockPrendas';
import Cargando from '../../src/components/Cargando';
// import EstadoVacio from '../../src/components/EstadoVacio';
import { colores, espaciado, radios, tipografia } from '../../src/theme/tema';

export default function DetallePrenda() {
  const { id } = useLocalSearchParams(); // id dinámico de la ruta 
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
    return () => {
      activo = false;
    };
  }, [id]);

  if (cargando) return <Cargando mensaje="Cargando prenda..." />;

  // Estado "vacío" específico: la prenda no existe.
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

  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={styles.contenido}>
      <Image source={{ uri: prenda.imagen }} style={styles.imagen} />

      <Text style={styles.nombre}>{prenda.nombre}</Text>

      <View style={styles.fila}>
        <Text style={styles.etiqueta}>Categoría</Text>
        <Text style={styles.valor}>{prenda.categoria}</Text>
      </View>
      <View style={styles.fila}>
        <Text style={styles.etiqueta}>Temporada</Text>
        <Text style={styles.valor}>{prenda.temporada}</Text>
      </View>

      {/* Lleva al formulario en modo edición, pasando el id. */}
      <TouchableOpacity
        style={styles.botonEditar}
        onPress={() =>
          router.push({ pathname: '/prendas/formulario', params: { id: prenda.id } })
        }
        activeOpacity={0.85}
      >
        <Text style={styles.textoBotonEditar}>Editar prenda</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  contenido: {
    padding: espaciado.lg,
  },
  imagen: {
    width: '100%',
    height: 320,
    borderRadius: radios.lg,
    backgroundColor: colores.borde,
    marginBottom: espaciado.lg,
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
  etiqueta: {
    fontSize: tipografia.cuerpo.tamano,
    color: colores.textoSuave,
  },
  valor: {
    fontSize: tipografia.cuerpo.tamano,
    color: colores.texto,
    fontWeight: '600',
  },
  botonEditar: {
    backgroundColor: colores.primario,
    paddingVertical: espaciado.md,
    borderRadius: radios.md,
    alignItems: 'center',
    marginTop: espaciado.xl,
  },
  textoBotonEditar: {
    color: colores.superficie,
    fontSize: tipografia.subtitulo.tamano,
    fontWeight: '600',
  },
});