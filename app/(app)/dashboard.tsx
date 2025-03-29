import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, Bell, User } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import { useAlertStore } from '@/store/alert-store';
import { CategoryCard } from '@/components/CategoryCard';
import { AlertItem } from '@/components/AlertItem';
import { FloatingButton } from '@/components/FloatingButton';
import colors from '@/constants/colors';
import { Alert, AlertCategory } from '@/types/alert';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { alerts, fetchAlerts, isLoading } = useAlertStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  };

  const handleCategoryPress = (category: AlertCategory) => {
    router.push(`/category/${category}`);
  };

  const handleAlertPress = (alertId: string) => {
    router.push(`/alert/${alertId}`);
  };

  const handleCreateAlert = () => {
    router.push('/create-alert');
  };

  const handleLogout = () => {
    logout();
    router.push('/(auth)/login');
  };

  // Count alerts by category and filter for recent ones
  const policeCounts = alerts.filter(a => a.category === 'police' && a.status !== 'resolved').length;
  const fireCounts = alerts.filter(a => a.category === 'fire_department' && a.status !== 'resolved').length;
  const defenseCounts = alerts.filter(a => a.category === 'civil_defense' && a.status !== 'resolved').length;
  
  const recentAlerts = [...alerts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Civil Alert</Text>
            <Text style={styles.headerSubtitle}>Welcome, {user?.name}</Text>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <Bell size={24} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleLogout}
            >
              <LogOut size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.sectionTitle}>Emergency Services</Text>
          
          <View style={styles.categoriesContainer}>
            <CategoryCard
              category="police"
              title="Police"
              count={policeCounts}
              onPress={() => handleCategoryPress('police')}
              style={styles.categoryCard}
            />
            
            <CategoryCard
              category="fire_department"
              title="Fire Department"
              count={fireCounts}
              onPress={() => handleCategoryPress('fire_department')}
              style={styles.categoryCard}
            />
            
            <CategoryCard
              category="civil_defense"
              title="Civil Defense"
              count={defenseCounts}
              onPress={() => handleCategoryPress('civil_defense')}
              style={styles.categoryCard}
            />
          </View>
          
          <View style={styles.recentAlertsHeader}>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {recentAlerts.length > 0 ? (
            recentAlerts.map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                onPress={() => handleAlertPress(alert.id)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No recent alerts</Text>
            </View>
          )}
        </ScrollView>
        
        <FloatingButton onPress={handleCreateAlert} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding for the floating button
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  categoryCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  recentAlertsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});
