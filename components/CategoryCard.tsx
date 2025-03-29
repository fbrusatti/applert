import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle,
  View
} from 'react-native';
import { AlertTriangle, Shield, Flame } from 'lucide-react-native';
import { AlertCategory } from '@/types/alert';
import colors from '@/constants/colors';

interface CategoryCardProps {
  category: AlertCategory;
  title: string;
  count?: number;
  onPress: () => void;
  style?: ViewStyle;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  title,
  count,
  onPress,
  style,
}) => {
  const getCardColor = () => {
    switch (category) {
      case 'police':
        return colors.police;
      case 'civil_defense':
        return colors.civilDefense;
      case 'fire_department':
        return colors.fireDepartment;
      default:
        return colors.primary;
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'police':
        return <Shield size={32} color="white" />;
      case 'civil_defense':
        return <AlertTriangle size={32} color="white" />;
      case 'fire_department':
        return <Flame size={32} color="white" />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: getCardColor() },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        {getCategoryIcon()}
      </View>
      <Text style={styles.title}>{title}</Text>
      {count !== undefined && (
        <View style={styles.countContainer}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 12,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  countContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  countText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

