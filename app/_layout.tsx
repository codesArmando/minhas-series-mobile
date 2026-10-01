import '../global.css';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#4f46e5' },
        headerTintColor: '#ffffff',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Minhas Series' }} />
      <Stack.Screen name="form" options={{ title: 'Atualizar/Cadastrar Série' }} />
      <Stack.Screen name="detalhe" options={{ title: 'Detalhes da Série' }} />

    </Stack>
  );
}