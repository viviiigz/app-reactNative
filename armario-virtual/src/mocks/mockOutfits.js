// src/mocks/mockOutfits.js
// Persistencia REAL con AsyncStorage. Misma interfaz de siempre (las vistas y
// useOutfits no cambian); lo que cambia es que ahora lee/escribe en el storage
// del dispositivo en vez de en un array en memoria. Arranca VACÍO (sin seed).
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE_ALBUMES = 'armario:albumes';
const CLAVE_LOOKS = 'armario:looks';

// Lee un array del storage. Si nunca se guardó nada, devuelve [] (arranque vacío).
const leerLista = async (clave) => {
  const crudo = await AsyncStorage.getItem(clave);
  return crudo ? JSON.parse(crudo) : []; // ← JSON.parse: el storage guarda solo texto
};
// Guarda un array como texto JSON.
const guardarLista = (clave, lista) => AsyncStorage.setItem(clave, JSON.stringify(lista));

const generarId = () => Date.now().toString();

// --- ÁLBUMES ---
export const obtenerAlbumes = () => leerLista(CLAVE_ALBUMES);

export const obtenerAlbumPorId = async (albumId) => {
  const albumes = await leerLista(CLAVE_ALBUMES);
  return albumes.find((a) => a.id === albumId) ?? null;
};

export const crearAlbum = async (nombre, imagenPortada = null) => {
  const albumes = await leerLista(CLAVE_ALBUMES);
  const nuevo = { id: generarId(), nombre, imagenPortada: imagenPortada ?? null, fechaCreacion: new Date().toISOString() };
  await guardarLista(CLAVE_ALBUMES, [...albumes, nuevo]);
  return nuevo;
};

export const eliminarAlbum = async (albumId) => {
  const [albumes, looks] = await Promise.all([leerLista(CLAVE_ALBUMES), leerLista(CLAVE_LOOKS)]);
  await Promise.all([
    guardarLista(CLAVE_ALBUMES, albumes.filter((a) => a.id !== albumId)),
    guardarLista(CLAVE_LOOKS, looks.filter((l) => l.albumId !== albumId)), // borra sus looks
  ]);
  return true;
};

// --- LOOKS ---
export const obtenerLooks = () => leerLista(CLAVE_LOOKS);

export const obtenerLooksPorAlbum = async (albumId) => {
  const looks = await leerLista(CLAVE_LOOKS);
  return looks.filter((l) => l.albumId === albumId);
};

export const obtenerLookPorId = async (lookId) => {
  const looks = await leerLista(CLAVE_LOOKS);
  return looks.find((l) => l.id === lookId) ?? null;
};

export const crearLook = async ({ albumId, nombre, prendasIds }) => {
  const looks = await leerLista(CLAVE_LOOKS);
  const nuevo = { id: generarId(), albumId, nombre, prendasIds: prendasIds ?? [], fechaCreacion: new Date().toISOString() };
  await guardarLista(CLAVE_LOOKS, [...looks, nuevo]);
  return nuevo;
};

export const eliminarLook = async (lookId) => {
  const looks = await leerLista(CLAVE_LOOKS);
  await guardarLista(CLAVE_LOOKS, looks.filter((l) => l.id !== lookId));
  return true;
};

// --- HERRAMIENTA DE DESARROLLO ---
// Borra álbumes y looks del storage para volver a cero. NO usar en producción.
export const resetearOutfitsDev = () => AsyncStorage.multiRemove([CLAVE_ALBUMES, CLAVE_LOOKS]);