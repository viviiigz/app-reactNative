// app/prendas/formulario.jsx
// Pantalla 4: Alta / Edición de prenda, con validación simple de campos.
// Si recibe un id por params, funciona en modo edición (precarga y actualiza);
// si no, funciona en modo alta (crea una prenda nueva).
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  agregarPrenda, actualizarPrenda, obtenerPrendaPorId,
} from '../../src/mocks/mockPrendas';
import Cargando from '../../src/components/Cargando';
import { colores, espaciado, radios, tipografia } from '../../src/theme/tema';

export default function FormularioPrenda() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const esEdicion = Boolean(id);

  // Estado de los campos del formulario.
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [temporada, setTemporada] = useState('');
  const [imagen, setImagen] = useState('');

  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  // Solo mostramos "cargando" al inicio si venimos a editar.
  const [cargando, setCargando] = useState(esEdicion);

  // En modo edición, traemos la prenda y precargamos los campos.
  useEffect(() => {
    if (!esEdicion) return;
    let activo = true;
    const precargar = async () => {
      try {
        const prenda = await obtenerPrendaPorId(id);
        if (activo && prenda) {
          setNombre(prenda.nombre);
          setCategoria(prenda.categoria);
          setTemporada(prenda.temporada);
          setImagen(prenda.imagen ?? '');
        }
      } catch (error) {
        console.error('Error al precargar la prenda:', error);
      } finally {
        if (activo) setCargando(false);
      }
    };
    precargar();
    return () => {
      activo = false;
    };
  }, [id, esEdicion]);

  // Validación simple: los tres campos de texto son obligatorios.
  const validar = () => {
    const nuevosErrores = {};
    if (!nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio.';
    if (!categoria.trim()) nuevosErrores.categoria = 'La categoría es obligatoria.';
    if (!temporada.trim()) nuevosErrores.temporada = 'La temporada es obligatoria.';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardar = async () => {
    if (!validar()) return;

    const datos = {
      nombre: nombre.trim(),
      categoria: categoria.trim(),
      temporada: temporada.trim(),
      // Si no cargaron URL de imagen, usamos una simulada por defecto.
      imagen: imagen.trim() || 'https://picsum.photos/seed/nueva/400/500',
    };

    try {
      setGuardando(true);
      if (esEdicion) {
        await actualizarPrenda(id, datos);
      } else {
        await agregarPrenda(datos);
      }
      router.back(); // volvemos; el listado se recarga solo al tomar foco.
    } catch (error) {
      console.error('Error al guardar la prenda:', error);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <Cargando mensaje="Cargando datos..." />;

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.contenido}>
        <Text style={styles.titulo}>
          {esEdicion ? 'Editar prenda' : 'Nueva prenda'}
        </Text>

        {/* Campo: Nombre */}
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={[styles.input, errores.nombre && styles.inputError]}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ej: Campera de jean"
          placeholderTextColor={colores.textoSuave}
        />
        {errores.nombre ? <Text style={styles.error}>{errores.nombre}</Text> : null}

        {/* Campo: Categoría */}
        <Text style={styles.label}>Categoría</Text>
        <TextInput
          style={[styles.input, errores.categoria && styles.inputError]}
          value={categoria}
          onChangeText={setCategoria}
          placeholder="Ej: Abrigo, Superior, Calzado"
          placeholderTextColor={colores.textoSuave}
        />
        {errores.categoria ? <Text style={styles.error}>{errores.categoria}</Text> : null}

        {/* Campo: Temporada */}
        <Text style={styles.label}>Temporada</Text>
        <TextInput
          style={[styles.input, errores.temporada && styles.inputError]}
          value={temporada}
          onChangeText={setTemporada}
          placeholder="Ej: Verano, Invierno, Todo el año"
          placeholderTextColor={colores.textoSuave}
        />
        {errores.temporada ? <Text style={styles.error}>{errores.temporada}</Text> : null}

        {/* Campo: Imagen (opcional) */}
        <Text style={styles.label}>URL de imagen (opcional)</Text>
        <TextInput
          style={styles.input}
          value={imagen}
          onChangeText={setImagen}
          placeholder="https://..."
          placeholderTextColor={colores.textoSuave}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.boton, guardando && styles.botonDeshabilitado]}
          onPress={guardar}
          disabled={guardando}
          activeOpacity={0.85}
        >
          <Text style={styles.textoBoton}>
            {guardando ? 'Guardando...' : 'Guardar prenda'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  titulo: {
    fontSize: tipografia.titulo.tamano,
    fontWeight: tipografia.titulo.grosor,
    color: colores.texto,
    marginBottom: espaciado.lg,
  },
  label: {
    fontSize: tipografia.etiqueta.tamano,
    fontWeight: tipografia.etiqueta.grosor,
    color: colores.texto,
    marginBottom: espaciado.xs,
    marginTop: espaciado.md,
  },
  input: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radios.md,
    paddingHorizontal: espaciado.md,
    paddingVertical: espaciado.sm,
    fontSize: tipografia.cuerpo.tamano,
    color: colores.texto,
  },
  inputError: {
    borderColor: colores.error,
  },
  error: {
    color: colores.error,
    fontSize: tipografia.etiqueta.tamano,
    marginTop: espaciado.xs,
  },
  boton: {
    backgroundColor: colores.primario,
    paddingVertical: espaciado.md,
    borderRadius: radios.md,
    alignItems: 'center',
    marginTop: espaciado.xl,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  textoBoton: {
    color: colores.superficie,
    fontSize: tipografia.subtitulo.tamano,
    fontWeight: '600',
  },
});