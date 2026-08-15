// app/_layout.jsx
// Layout raíz de la app. Define el Stack de navegación de expo-router y los
// títulos en español de cada pantalla. Sin modales: todas son pantallas
// estándar dentro del mismo Stack.
import React from 'react';
import { Stack } from 'expo-router';
import { colores } from '../src/theme/tema';

export default function LayoutRaiz() {
  return (
    <Stack
      // Opciones comunes a TODAS las pantallas: header con la identidad visual
      // que definimos en el tema (así no hardcodeamos colores sueltos).
      screenOptions={{
        headerStyle: { backgroundColor: colores.primario },
        headerTintColor: colores.superficie, // color del título y la flecha "atrás"
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: colores.fondo },
      }}
    >
      {/* Pantalla 1: Inicio → app/index.jsx */}
      <Stack.Screen name="index" options={{ title: 'Closet' }} />

      {/* Pantalla 2: Listado → app/prendas/index.jsx */}
      <Stack.Screen name="prendas/index" options={{ title: 'Mis Prendas' }} />

      {/* Pantalla 3: Detalle → app/prendas/[id].jsx */}
      <Stack.Screen name="prendas/[id]" options={{ title: 'Detalle de Prenda' }} />

      {/* Pantalla 4: Alta / Edición → app/prendas/formulario.jsx */}
      <Stack.Screen name="prendas/formulario" options={{ title: 'Agregar / Editar' }} />
    </Stack>
  );
}