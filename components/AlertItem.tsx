import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Clock, MapPin } from 'lucide-react-native';
import { Alert } from '@/types/alert';
import colors from '@/constants/colors';

interface AlertItemProps {
  alert: Alert;
  onPress: () => void;
}

export const AlertItem: React.FC<AlertItemProps> = ({ alert, onPress }) => {
  const getStatusColor = () => {
    switch (alert.status) {
      case 'pending':
        return colors.statusPending;
      case 'in_progress':
        return colors.statusInProgress;
      case 'resolved':
        return colors.statusResolved;
      default:
        return colors.statusPending;
    }
  };

  const getStatusText = () => {
    switch (alert.status) {
      case 'pending':
        return 'Pending';
      case 'in_progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      default:
        return 'Pending';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {alert.title}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {alert.description}
      </Text>
      
      <View style={styles.footer}>
        <View style={styles.metaItem}>
          <Clock size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>{formatDate(alert.createdAt)}</Text>
        </View>
        
        {alert.location?.address && (
          <View style={styles.metaItem}>
            <MapPin size={14} color={colors.textSecondary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {alert.location.address}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});

