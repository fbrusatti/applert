import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useRouter, useRootNavigationState } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import colors from '@/constants/colors';

import Login from './(auth)/login'; 
import Dashboard from './(app)/dashboard'; 

// export default function Index() {
//   const router = useRouter();
//   const { isAuthenticated, isLoading } = useAuthStore();
//   // const rootNavigationState = useRootNavigationState();
//   // const navigatorReady = rootNavigationState?.key != null;
  
  
//   useEffect(() => {
//     // Si ya no estamos en el estado de carga
//     if (!isLoading) {
//       // Redirigir según el estado de autenticación
//       if (isAuthenticated) {
//         router.replace('/(app)/dashboard');
//       } else {
//         router.replace('/(auth)/login');
//       }
//     }
//   }, [isLoading, isAuthenticated, navigatorReady]); // Dependencias del

//   // Show a loading indicator while checking auth
//   return (
//     <View style={styles.container}>
//       <ActivityIndicator size="large" color={colors.primary} />
//     </View>
//   );
// }

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Mostrar un mensaje mientras se verifica el estado de la autenticación
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.message}>Verificando autenticación...</Text>
      </View>
    );
  }

  // Mostrar un mensaje dependiendo del estado de autenticación
  return (
    <View style={styles.container}>
      {isAuthenticated ? <Dashboard /> : <Login />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  message: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginTop: 10,
  },
});
