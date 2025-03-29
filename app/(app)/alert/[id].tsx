import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MapPin, Clock, CheckCircle } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import { useAlertStore } from '@/store/alert-store';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { ResponseItem } from '@/components/ResponseItem';
import { StatusBadge } from '@/components/StatusBadge';
import colors from '@/constants/colors';

export default function AlertDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const { 
    alerts, 
    responses, 
    fetchResponses, 
    addResponse, 
    updateAlertStatus, 
    isLoading 
  } = useAlertStore();
  
  const [responseText, setResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const alert = alerts.find(a => a.id === id);
  const alertResponses = responses.filter(r => r.alertId === id)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  
  useEffect(() => {
    if (id) {
      fetchResponses(id);
    }
  }, [id]);
  
  const handleSubmitResponse = async () => {
    if (!responseText.trim() || !user) return;
    
    setIsSubmitting(true);
    
    try {
      await addResponse({
        alertId: id,
        text: responseText,
        createdBy: user.id,
      });
      
      setResponseText('');
    } catch (error) {
      console.error('Failed to submit response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleMarkAsResolved = async () => {
    if (!alert) return;
    
    try {
      await updateAlertStatus(alert.id, 'resolved');
    } catch (error) {
      console.error('Failed to mark as resolved:', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const getCategoryName = () => {
    switch (alert?.category) {
      case 'police':
        return 'Police';
      case 'fire_department':
        return 'Fire Department';
      case 'civil_defense':
        return 'Civil Defense';
      default:
        return 'Unknown';
    }
  };
  
  const getCategoryColor = () => {
    switch (alert?.category) {
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
  
  // Check if user can mark as resolved (admin or department member)
  const canMarkAsResolved = () => {
    if (!user || !alert) return false;
    
    if (user.role === 'admin') return true;
    
    if (alert.category === 'police' && user.role === 'police') return true;
    if (alert.category === 'fire_department' && user.role === 'fire_department') return true;
    if (alert.category === 'civil_defense' && user.role === 'civil_defense') return true;
    
    return false;
  };
  
  if (!alert) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen 
        options={{ 
          title: alert.title,
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: getCategoryColor(),
          },
        }} 
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView style={styles.container}>
          <View style={styles.alertHeader}>
            <View style={styles.alertMeta}>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor() }]}>
                <Text style={styles.categoryText}>{getCategoryName()}</Text>
              </View>
              
              <StatusBadge status={alert.status} size="medium" />
            </View>
            
            <Text style={styles.alertTitle}>{alert.title}</Text>
            
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Clock size={16} color={colors.textSecondary} />
                <Text style={styles.metaText}>{formatDate(alert.createdAt)}</Text>
              </View>
              
              {alert.location?.address && (
                <View style={styles.metaItem}>
                  <MapPin size={16} color={colors.textSecondary} />
                  <Text style={styles.metaText}>{alert.location.address}</Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{alert.description}</Text>
          </View>
          
          <View style={styles.responsesContainer}>
            <Text style={styles.responsesTitle}>Responses</Text>
            
            {alertResponses.length > 0 ? (
              alertResponses.map((response) => (
                <ResponseItem key={response.id} response={response} />
              ))
            ) : (
              <View style={styles.emptyResponsesContainer}>
                <Text style={styles.emptyResponsesText}>No responses yet</Text>
              </View>
            )}
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          {alert.status !== 'resolved' && (
            <>
              <View style={styles.responseInputContainer}>
                <Input
                  placeholder="Write a response..."
                  value={responseText}
                  onChangeText={setResponseText}
                  multiline
                  containerStyle={styles.responseInput}
                />
                
                <Button
                  title="Send"
                  onPress={handleSubmitResponse}
                  isLoading={isSubmitting}
                  disabled={!responseText.trim()}
                  size="small"
                  style={styles.sendButton}
                />
              </View>
              
              {canMarkAsResolved() && (
                <Button
                  title="Mark as Resolved"
                  onPress={handleMarkAsResolved}
                  variant="outline"
                  style={styles.resolveButton}
                  textStyle={{ color: colors.success }}
                />
              )}
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  alertHeader: {
    padding: 16,
    backgroundColor: colors.card,
  },
  alertMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  descriptionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  responsesContainer: {
    padding: 16,
    paddingBottom: 100, // Extra space for the input
  },
  responsesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  emptyResponsesContainer: {
    padding: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyResponsesText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  responseInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  responseInput: {
    flex: 1,
    marginBottom: 0,
  },
  sendButton: {
    marginLeft: 8,
  },
  resolveButton: {
    marginTop: 12,
    borderColor: colors.success,
  },
});
