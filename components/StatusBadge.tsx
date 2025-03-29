import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertStatus } from '@/types/alert';
import colors from '@/constants/colors';

interface StatusBadgeProps {
  status: AlertStatus;
  size?: 'small' | 'medium' | 'large';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'medium',
}) => {
  const getStatusColor = () => {
    switch (status) {
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
    switch (status) {
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

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallBadge;
      case 'medium':
        return styles.mediumBadge;
      case 'large':
        return styles.largeBadge;
      default:
        return styles.mediumBadge;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'medium':
        return styles.mediumText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  return (
    <View style={[
      styles.badge,
      getSizeStyle(),
      { backgroundColor: getStatusColor() }
    ]}>
      <Text style={[styles.text, getTextSizeStyle()]}>
        {getStatusText()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  mediumBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  largeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  text: {
    color: 'white',
    fontWeight: '600',
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
});
