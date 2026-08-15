// src/mocks/mockPrendas.js
// -----------------------------------------------------------------------------
// Mock de datos de prendas + funciones asíncronas simuladas.
// Simula un "backend" en memoria: cada operación devuelve una Promesa que
// resuelve tras 1.5s (setTimeout) para imitar la latencia de red y poder
// probar los estados de carga y vacío en la UI.
// -----------------------------------------------------------------------------

// Retardo (en ms) que simula la latencia de red.
const LATENCIA_MS = 1500;

// Helper: envuelve un valor en una Promesa que resuelve tras LATENCIA_MS.
const simularLatencia = (dato) =>
  new Promise((resolver) => {
    setTimeout(() => resolver(dato), LATENCIA_MS);
  });

// "Base de datos" en memoria. Se muta con las operaciones de escritura.
let prendas = [
  {
    id: '1',
    nombre: 'Campera de jean',
    categoria: 'Abrigo',
    temporada: 'Otoño',
    imagen: 'https://picsum.photos/seed/campera/400/500',
  },
  {
    id: '2',
    nombre: 'Remera blanca básica',
    categoria: 'Superior',
    temporada: 'Verano',
    imagen: 'https://picsum.photos/seed/remera/400/500',
  },
  {
    id: '3',
    nombre: 'Jean negro slim',
    categoria: 'Inferior',
    temporada: 'Todo el año',
    imagen: 'https://picsum.photos/seed/jean/400/500',
  },
  {
    id: '4',
    nombre: 'Zapatillas urbanas',
    categoria: 'Calzado',
    temporada: 'Todo el año',
    imagen: 'https://picsum.photos/seed/zapatillas/400/500',
  },
  {
    id: '5',
    nombre: 'Buzo con capucha',
    categoria: 'Abrigo',
    temporada: 'Invierno',
    imagen: 'https://picsum.photos/seed/buzo/400/500',
  },
];

// Genera un id único simple (suficiente para el prototipo sin backend).
const generarId = () => Date.now().toString();

// --- LECTURA -----------------------------------------------------------------

// Devuelve todas las prendas.
export const obtenerPrendas = () => {
  return simularLatencia(prendas.map((prenda) => ({ ...prenda })));
};

// Devuelve una prenda por su id, o null si no existe.
export const obtenerPrendaPorId = (id) => {
  const encontrada = prendas.find((prenda) => prenda.id === id);
  return simularLatencia(encontrada ? { ...encontrada } : null);
};

// --- ESCRITURA ---------------------------------------------------------------

// Agrega una prenda nueva. Recibe los datos (sin id) y devuelve la creada.
export const agregarPrenda = (datos) => {
  const nuevaPrenda = { id: generarId(), ...datos };
  prendas = [...prendas, nuevaPrenda];
  return simularLatencia({ ...nuevaPrenda });
};

// Actualiz 
export const actualizarPrenda = (id, datos) => {
  let actualizada = null;
  prendas = prendas.map((prenda) => {
    if (prenda.id === id) {
      actualizada = { ...prenda, ...datos, id };
      return actualizada;
    }
    return prenda;
  });
  return simularLatencia(actualizada ? { ...actualizada } : null);
};

// Elimina una prenda por id. Devuelve true si se eliminó, false si no existía.
export const eliminarPrenda = (id) => {
  const cantidadInicial = prendas.length;
  prendas = prendas.filter((prenda) => prenda.id !== id);
  const seElimino = prendas.length < cantidadInicial;
  return simularLatencia(seElimino);
};