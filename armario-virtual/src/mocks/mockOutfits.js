
// Álbumes (con imagenPortada) + Looks. Persistencia en memoria, latencia 1.5s.
const LATENCIA_MS = 1500;
const simular = (dato) =>
  new Promise((resolver) => setTimeout(() => resolver(dato), LATENCIA_MS));

const generarId = () => Date.now().toString();

let albumes = [
  { id: '1', nombre: 'Facultad', fechaCreacion: '2026-02-10T10:00:00.000Z', imagenPortada: null },
  { id: '2', nombre: 'Salidas',  fechaCreacion: '2026-03-05T10:00:00.000Z', imagenPortada: null },
];

let looks = [
  { id: '101', albumId: '1', nombre: 'Look lunes',    prendasIds: ['1', '3', '4'], fechaCreacion: '2026-02-11T10:00:00.000Z' },
  { id: '102', albumId: '1', nombre: 'Look martes',   prendasIds: ['2', '3', '5'], fechaCreacion: '2026-02-15T10:00:00.000Z' },
  { id: '103', albumId: '2', nombre: 'Viernes noche', prendasIds: ['1', '3', '5'], fechaCreacion: '2026-03-06T10:00:00.000Z' },
];

// --- ÁLBUMES ---
export const obtenerAlbumes = () => simular(albumes.map((a) => ({ ...a })));

export const obtenerAlbumPorId = (albumId) =>
  simular(albumes.find((a) => a.id === albumId) ?? null);

// Ahora recibe también la portada (uri string o null).
export const crearAlbum = (nombre, imagenPortada = null) => {
  const nuevo = {
    id: generarId(),
    nombre,
    imagenPortada: imagenPortada ?? null,
    fechaCreacion: new Date().toISOString(),
  };
  albumes = [...albumes, nuevo];
  return simular({ ...nuevo });
};

export const eliminarAlbum = (albumId) => {
  albumes = albumes.filter((a) => a.id !== albumId);
  looks = looks.filter((l) => l.albumId !== albumId);
  return simular(true);
};

// --- LOOKS ---
export const obtenerLooks = () => simular(looks.map((l) => ({ ...l }))); // todos (para portadas de álbum)

export const obtenerLooksPorAlbum = (albumId) =>
  simular(looks.filter((l) => l.albumId === albumId).map((l) => ({ ...l })));

export const obtenerLookPorId = (lookId) =>
  simular(looks.find((l) => l.id === lookId) ?? null);

export const crearLook = ({ albumId, nombre, prendasIds }) => {
  const nuevo = {
    id: generarId(),
    albumId,
    nombre,
    prendasIds: prendasIds ?? [],
    fechaCreacion: new Date().toISOString(),
  };
  looks = [...looks, nuevo];
  return simular({ ...nuevo });
};

export const eliminarLook = (lookId) => {
  looks = looks.filter((l) => l.id !== lookId);
  return simular(true);
};