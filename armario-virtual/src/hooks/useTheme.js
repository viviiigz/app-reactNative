// src/hooks/useTheme.js
// Hook global para consumir el tema activo desde cualquier componente.
import { useContext } from 'react';
import { TemaContext } from '../theme/ThemeContext';

export const useTheme = () => useContext(TemaContext);