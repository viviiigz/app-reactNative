// src/features/outfits/hooks/useOutfits.js
// Custom hook "service": concentra TODA la comunicación de datos de outfits.
// Las vistas no hablan con los mocks directamente; hablan con este hook.
// El día que migremos a AsyncStorage, solo cambia el interior de los mocks:
// este hook y las vistas quedan intactos.
import { useState, useCallback, useMemo } from 'react';
import {
  obtenerAlbumes, obtenerAlbumPorId, obtenerLooks, obtenerLooksPorAlbum,
  crearAlbum, eliminarAlbum, crearLook, eliminarLook,
} from '../../../mocks/mockOutfits';
import { obtenerPrendas } from '../../../mocks/mockPrendas';

// Helper puro para ordenar por fecha (más nuevo primero).
const ordenarNuevoAViejo = (lista) =>
  [...lista].sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());

export function useOutfits() {
  const [albumes, setAlbumes] = useState([]);
  const [looks, setLooks] = useState([]);
  const [album, setAlbum] = useState(null);   // álbum actual (vista de carpeta)
  const [prendas, setPrendas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // --- CARGA ---
  // Pantalla principal: todos los álbumes + looks (para portadas) + prendas.
  const cargarInicio = useCallback(async () => {
    try {
      setCargando(true); setError(null);
      const [alb, lks, prd] = await Promise.all([obtenerAlbumes(), obtenerLooks(), obtenerPrendas()]);
      setAlbumes(alb); setLooks(lks); setPrendas(prd);
    } catch (e) {
      console.error(e); setError('No pudimos cargar tus outfits.');
    } finally {
      setCargando(false);
    }
  }, []);

  // Vista de una carpeta: el álbum + sus looks + prendas (para miniaturas).
  const cargarAlbum = useCallback(async (albumId) => {
    try {
      setCargando(true); setError(null);
      const [alb, lks, prd] = await Promise.all([
        obtenerAlbumPorId(albumId), obtenerLooksPorAlbum(albumId), obtenerPrendas(),
      ]);
      setAlbum(alb); setLooks(lks); setPrendas(prd);
    } catch (e) {
      console.error(e); setError('No pudimos cargar la sección.');
    } finally {
      setCargando(false);
    }
  }, []);

  // Solo prendas (para el creador de looks).
  const cargarPrendas = useCallback(async () => {
    try {
      setCargando(true); setError(null);
      setPrendas(await obtenerPrendas());
    } catch (e) {
      console.error(e); setError('No pudimos cargar las prendas.');
    } finally {
      setCargando(false);
    }
  }, []);

  // --- MUTACIONES (useCallback: referencia estable → no re-renderiza de más) ---
  const crearNuevoAlbum = useCallback(async (nombre, imagenPortada = null) => {
    const nuevo = await crearAlbum(nombre, imagenPortada);
    setAlbumes((prev) => [...prev, nuevo]); // actualiza el estado local al instante
    return nuevo;
  }, []);

  const borrarAlbum = useCallback(async (albumId) => {
    await eliminarAlbum(albumId);
    setAlbumes((prev) => prev.filter((a) => a.id !== albumId));
    setLooks((prev) => prev.filter((l) => l.albumId !== albumId));
  }, []);

  const crearNuevoLook = useCallback(async ({ albumId, nombre, prendasIds }) => {
    const nuevo = await crearLook({ albumId, nombre, prendasIds });
    setLooks((prev) => [...prev, nuevo]);
    return nuevo;
  }, []);

  const borrarLook = useCallback(async (lookId) => {
    await eliminarLook(lookId);
    setLooks((prev) => prev.filter((l) => l.id !== lookId));
  }, []);

  // --- DERIVADOS (useMemo: no recalcula orden/mapa en cada render) ---
  const albumesOrdenados = useMemo(() => ordenarNuevoAViejo(albumes), [albumes]);
  const looksOrdenados = useMemo(() => ordenarNuevoAViejo(looks), [looks]);
  // Mapa id de prenda -> imagen, para resolver miniaturas sin recorrer el array.
  const mapaPrendas = useMemo(
    () => Object.fromEntries(prendas.map((p) => [p.id, p.imagen])),
    [prendas]
  );

  return {
    // estado
    albumes: albumesOrdenados,
    looks: looksOrdenados,
    album, prendas, mapaPrendas,
    cargando, error,
    // cargas
    cargarInicio, cargarAlbum, cargarPrendas,
    // mutaciones optimizadas
    crearNuevoAlbum, borrarAlbum, crearNuevoLook, borrarLook,
  };
}