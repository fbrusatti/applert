import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import colors from '@/constants/colors';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Check authentication status after component is mounted
    const checkAuth = async () => {
      if (!isLoading) {
        if (isAuthenticated) {
          router.replace('/(app)/dashboard');
        } else {
          router.replace('/(auth)/login');
        }
      }
    };

    // Use a small timeout to ensure the root layout is fully mounted
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, router]);

  // Show a loading indicator while checking auth
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
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
});