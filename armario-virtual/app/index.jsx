// app/index.jsx
// Pantalla 1: Inicio / Resumen del armario.
// Muestra cuántas prendas hay (consultando el mock) y da acceso al listado y al alta.
import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { obtenerPrendas } from '../src/mocks/mockPrendas';
import Cargando from '../src/components/Cargando';
import { colores, espaciado, radios, tipografia } from '../src/theme/tema';

export default function Inicio() {
  const router = useRouter();
  const [cargando, setCargando] = useState(true);
  const [totalPrendas, setTotalPrendas] = useState(0);

  // Recargamos el resumen cada vez que la pantalla toma foco.
  useFocusEffect(
    useCallback(() => {
      let activo = true;
      const cargarResumen = async () => {
        try {
          setCargando(true);
          const prendas = await obtenerPrendas();
          if (activo) setTotalPrendas(prendas.length);
        } catch (error) {
          console.error('Error al cargar el resumen:', error);
        } finally {
          if (activo) setCargando(false);
        }
      };
      cargarResumen();
      return () => {
        activo = false;
      };
    }, [])
  );

  if (cargando) return <Cargando mensaje="Preparando tu armario..." />;

  return (
    <ImageBackground source={require('../assets/images/descarga.jpg')} style={styles.contenedor}>
      {/* <Text style={styles.titulo}>Mi Closet</Text> */}
    <View style={{ flex: 9, justifyContent: 'space-between', alignItems: 'center' }}>
      <MaterialCommunityIcons name="hanger" size={70} color="pink"/>
       </View>
      {/* <View style={styles.tarjetaResumen}>
        <Text style={styles.numero}>{totalPrendas}</Text>
        <Text style={styles.etiqueta}>
          {totalPrendas === 1 ? 'prenda guardada' : 'prendas guardadas'}
        </Text>
      </View> */}
    <TouchableOpacity
        style={styles.botonPrimario}
        onPress={() => router.push('/prendas')}
        activeOpacity={0.85}
      >
        <Text style={styles.textoBotonPrimario}>Ver mis Outfits</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.botonPrimario}
        onPress={() => router.push('/prendas')}
        activeOpacity={0.85}
      >
        <Text style={styles.textoBotonPrimario}>Ver mis Prendas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botonSecundario}
        onPress={() => router.push('/prendas/formulario')}
        activeOpacity={0.85}
      >
        <Text style={styles.textoBotonSecundario}>+ Agregar prenda</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 4,
    backgroundColor: colores.fondo,
    padding: espaciado.lg,
    justifyContent: 'flex-start',
  },
  titulo: {
    fontSize: tipografia.titulo.tamano, 
    fontWeight: tipografia.titulo.grosor,
    color: colores.texto,
    marginBottom: espaciado.xl,
    textAlign: 'center',
  },
  tarjetaResumen: {
    backgroundColor: colores.superficie,
    borderRadius: radios.lg,
    paddingVertical: espaciado.xl,
    alignItems: 'center',
    marginBottom: espaciado.xl,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  numero: {
    fontSize: 48,
    fontWeight: '700',
    color: colores.primario,
  },
  etiqueta: {
    fontSize: tipografia.cuerpo.tamano,
    color: colores.textoSuave,
    marginTop: espaciado.xs,
  },
  botonPrimario: {
    backgroundColor: colores.primario,
    paddingVertical: espaciado.md,
    borderRadius: radios.md,
    alignItems: 'center',
    marginBottom: espaciado.md,
  },
  textoBotonPrimario: {
    color: colores.superficie,
    fontSize: tipografia.subtitulo.tamano,
    fontWeight: '600',
  },
  botonSecundario: {
    paddingVertical: espaciado.md,
    borderRadius: radios.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colores.primario,
  },
  textoBotonSecundario: {
    color: colores.primario,
    fontSize: tipografia.subtitulo.tamano,
    fontWeight: '600',
  },
});