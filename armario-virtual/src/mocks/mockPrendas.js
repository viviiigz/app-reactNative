// src/mocks/mockPrendas.js
// -----------------------------------------------------------------------------
// Mock de datos de prendas + funciones asíncronas simuladas (1.5s de latencia).
// Simula un "backend" en memoria. Las 5 prendas base usan imágenes LOCALES
// vía require() (no URLs de internet). Categorías del set estricto:
// Superior / Inferior / Calzado / Accesorio.
// -----------------------------------------------------------------------------

const LATENCIA_MS = 1500;

const simularLatencia = (dato) =>
  new Promise((resolver) => {
    setTimeout(() => resolver(dato), LATENCIA_MS);
  });

// "Base de datos" en memoria. Las imágenes base son assets locales (require).
let prendas = [
  { id: '1', nombre: 'Campera de jean',      categoria: 'Superior',  temporada: 'Otoño / Invierno',   imagen: require('../../assets/images/prendas/campera.jpg') },
  { id: '2', nombre: 'Remera blanca básica', categoria: 'Superior',  temporada: 'Primavera / Verano', imagen: require('../../assets/images/prendas/remera.jpg') },
  { id: '3', nombre: 'Jean negro slim',      categoria: 'Inferior',  temporada: 'Todo el año',        imagen: require('../../assets/images/prendas/pantalon.jpg') },
  { id: '4', nombre: 'Zapatillas urbanas',   categoria: 'Calzado',   temporada: 'Todo el año',        imagen: require('../../assets/images/prendas/zapatillass.jpg') },
  { id: '5', nombre: 'Cinturón de cuero',    categoria: 'Accesorio', temporada: 'Todo el año',        imagen: require('../../assets/images/prendas/cinturon.jpg') },
];

const generarId = () => Date.now().toString();

// --- LECTURA ---
export const obtenerPrendas = () => {
  return simularLatencia(prendas.map((prenda) => ({ ...prenda })));
};

export const obtenerPrendaPorId = (id) => {
  const encontrada = prendas.find((prenda) => prenda.id === id);
  return simularLatencia(encontrada ? { ...encontrada } : null);
};

// --- ESCRITURA ---
export const agregarPrenda = (datos) => {
  // Las prendas nuevas que cargue la usuaria traen su imagen como uri (o null).
  const nuevaPrenda = { id: generarId(), imagen: null, ...datos };
  prendas = [...prendas, nuevaPrenda];
  return simularLatencia({ ...nuevaPrenda });
};

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

export const eliminarPrenda = (id) => {
  const cantidadInicial = prendas.length;
  prendas = prendas.filter((prenda) => prenda.id !== id);
  const seElimino = prendas.length < cantidadInicial;
  return simularLatencia(seElimino);
};