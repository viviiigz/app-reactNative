// app/_layout.jsx
// Envuelve toda la navegación en el ProveedorTema. La navegación se separa en
// un componente interno para poder consumir useTheme (que necesita estar DENTRO
// del Provider).
import React from 'react';
import { Stack } from 'expo-router';
import { ProveedorTema } from '../src/theme/ThemeContext';
import { useTheme } from '../src/hooks/useTheme';

function Navegacion() {
  const { colores } = useTheme(); // ahora el header reacciona al tema

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colores.rosaFuerte },
        headerTintColor: colores.blancoPuro,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: colores.base },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="prendas/index" options={{ title: 'Mis Prendas' }} />
      <Stack.Screen name="prendas/[id]" options={{ title: 'Detalle de Prenda' }} />
      <Stack.Screen name="prendas/formulario" options={{ title: 'Agregar / Editar' }} />
      <Stack.Screen name="outfits/index" options={{ title: 'Mis Outfits' }} />
      <Stack.Screen name="outfits/crear" options={{ title: 'Nuevo Look' }} />
    </Stack>
  );
}

export default function LayoutRaiz() {
  return (
    <ProveedorTema>
      <Navegacion />
    </ProveedorTema>
  );
}