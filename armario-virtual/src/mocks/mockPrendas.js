// src/mocks/mockPrendas.js
// Persistencia REAL con AsyncStorage. Misma interfaz de siempre. Arranca VACÍO:
// la usuaria carga sus prendas (con uri de cámara/galería, que sí se guarda).
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE_PRENDAS = 'armario:prendas';

const leerLista = async (clave) => {
  const crudo = await AsyncStorage.getItem(clave);
  return crudo ? JSON.parse(crudo) : [];
};
const guardarLista = (clave, lista) => AsyncStorage.setItem(clave, JSON.stringify(lista));

const generarId = () => Date.now().toString();

// --- LECTURA ---
export const obtenerPrendas = () => leerLista(CLAVE_PRENDAS);

export const obtenerPrendaPorId = async (id) => {
  const prendas = await leerLista(CLAVE_PRENDAS);
  return prendas.find((p) => p.id === id) ?? null;
};

// --- ESCRITURA ---
export const agregarPrenda = async (datos) => {
  const prendas = await leerLista(CLAVE_PRENDAS);
  const nueva = { id: generarId(), imagen: null, ...datos }; // imagen null si no vino
  await guardarLista(CLAVE_PRENDAS, [...prendas, nueva]);
  return nueva;
};

export const actualizarPrenda = async (id, datos) => {
  const prendas = await leerLista(CLAVE_PRENDAS);
  let actualizada = null;
  const nuevas = prendas.map((p) => {
    if (p.id === id) { actualizada = { ...p, ...datos, id }; return actualizada; }
    return p;
  });
  await guardarLista(CLAVE_PRENDAS, nuevas);
  return actualizada;
};

export const eliminarPrenda = async (id) => {
  const prendas = await leerLista(CLAVE_PRENDAS);
  const nuevas = prendas.filter((p) => p.id !== id);
  await guardarLista(CLAVE_PRENDAS, nuevas);
  return nuevas.length < prendas.length;
};

// --- HERRAMIENTA DE DESARROLLO ---
export const resetearPrendasDev = () => AsyncStorage.removeItem(CLAVE_PRENDAS);