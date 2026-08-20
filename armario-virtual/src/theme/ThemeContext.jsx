// src/theme/ThemeContext.jsx
// Provee el tema activo a toda la app y permite alternar claro/oscuro.
import React, { createContext, useState, useCallback, useMemo } from 'react';
import { temaClaro, temaOscuro } from './tema';

// El valor por defecto es el tema claro (por si algún consumidor queda fuera del Provider).
export const TemaContext = createContext(temaClaro);

export function ProveedorTema({ children }) {
  const [modo, setModo] = useState('claro'); // 'claro' | 'oscuro'

  const alternarModo = useCallback(() => {
    setModo((m) => (m === 'claro' ? 'oscuro' : 'claro'));
  }, []);

  // useMemo: el objeto de tema solo se recalcula cuando cambia el modo,
  // evitando que TODOS los consumidores se re-rendericen en cada render del Provider.
  const valor = useMemo(() => {
    const base = modo === 'oscuro' ? temaOscuro : temaClaro;
    return { ...base, alternarModo };
  }, [modo, alternarModo]);

  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>;
}