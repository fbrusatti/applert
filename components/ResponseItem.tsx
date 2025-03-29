import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Response } from '@/types/alert';
import colors from '@/constants/colors';

interface ResponseItemProps {
  response: Response;
}

export const ResponseItem: React.FC<ResponseItemProps> = ({ response }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getRoleColor = () => {
    switch (response.createdByRole) {
      case 'police':
        return colors.police;
      case 'civil_defense':
        return colors.civilDefense;
      case 'fire_department':
        return colors.fireDepartment;
      case 'admin':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  const getRoleName = () => {
    switch (response.createdByRole) {
      case 'police':
        return 'Police';
      case 'civil_defense':
        return 'Civil Defense';
      case 'fire_department':
        return 'Fire Department';
      case 'admin':
        return 'Administrator';
      case 'citizen':
        return 'Citizen';
      default:
        return 'User';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{response.createdByName}</Text>
        <View style={[styles.roleBadge, { backgroundColor: getRoleColor() }]}>
          <Text style={styles.roleText}>{getRoleName()}</Text>
        </View>
      </View>
      
      <Text style={styles.text}>{response.text}</Text>
      
      <Text style={styles.timestamp}>{formatDate(response.createdAt)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  roleText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  text: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
    alignSelf: 'flex-end',
  },
});
