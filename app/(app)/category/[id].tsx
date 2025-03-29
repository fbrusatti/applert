import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Filter } from 'lucide-react-native';
import { useAlertStore } from '@/store/alert-store';
import { AlertItem } from '@/components/AlertItem';
import { FloatingButton } from '@/components/FloatingButton';
import colors from '@/constants/colors';
import { Alert, AlertCategory, AlertStatus } from '@/types/alert';

export default function CategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { alerts, fetchAlerts, isLoading } = useAlertStore();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<AlertStatus | 'all'>('all');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  };

  const handleAlertPress = (alertId: string) => {
    router.push(`/alert/${alertId}`);
  };

  const handleCreateAlert = () => {
    router.push({
      pathname: '/create-alert',
      params: { category: id }
    });
  };

  const getCategoryTitle = () => {
    switch (id as AlertCategory) {
      case 'police':
        return 'Police';
      case 'fire_department':
        return 'Fire Department';
      case 'civil_defense':
        return 'Civil Defense';
      default:
        return 'Category';
    }
  };

  const getCategoryColor = () => {
    switch (id as AlertCategory) {
      case 'police':
        return colors.police;
      case 'fire_department':
        return colors.fireDepartment;
      case 'civil_defense':
        return colors.civilDefense;
      default:
        return colors.primary;
    }
  };

  // Filter alerts by category and status
  const filteredAlerts = alerts
    .filter(alert => alert.category === id)
    .filter(alert => filter === 'all' || alert.status === filter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen 
        options={{ 
          title: getCategoryTitle(),
          headerStyle: {
            backgroundColor: getCategoryColor(),
          },
          headerTintColor: 'white',
        }} 
      />
      
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              filter === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setFilter('all')}
          >
            <Text style={[
              styles.filterText,
              filter === 'all' && styles.filterTextActive
            ]}>All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              filter === 'pending' && styles.filterButtonActive
            ]}
            onPress={() => setFilter('pending')}
          >
            <Text style={[
              styles.filterText,
              filter === 'pending' && styles.filterTextActive
            ]}>Pending</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              filter === 'in_progress' && styles.filterButtonActive
            ]}
            onPress={() => setFilter('in_progress')}
          >
            <Text style={[
              styles.filterText,
              filter === 'in_progress' && styles.filterTextActive
            ]}>In Progress</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              filter === 'resolved' && styles.filterButtonActive
            ]}
            onPress={() => setFilter('resolved')}
          >
            <Text style={[
              styles.filterText,
              filter === 'resolved' && styles.filterTextActive
            ]}>Resolved</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={filteredAlerts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AlertItem
              alert={item}
              onPress={() => handleAlertPress(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No alerts found</Text>
            </View>
          }
        />
        
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
  filterContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding for the floating button
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});
