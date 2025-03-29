import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack, Redirect } from 'expo-router';
import { Shield, AlertTriangle, Flame, X } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import { useAlertStore } from '@/store/alert-store';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import colors from '@/constants/colors';
import { AlertCategory } from '@/types/alert';

export default function CreateAlertScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const { user } = useAuthStore();
  const { createAlert, isLoading } = useAlertStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AlertCategory | null>(
    params.category as AlertCategory || null
  );
  const [location, setLocation] = useState('');
  
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  
  const validateForm = () => {
    let isValid = true;
    
    if (!title.trim()) {
      setTitleError('Title is required');
      isValid = false;
    } else {
      setTitleError('');
    }
    
    if (!description.trim()) {
      setDescriptionError('Description is required');
      isValid = false;
    } else {
      setDescriptionError('');
    }
    
    if (!category) {
      setCategoryError('Please select a category');
      isValid = false;
    } else {
      setCategoryError('');
    }
    
    return isValid;
  };
  
  const handleSubmit = async () => {
    if (!validateForm() || !user || !category) return;
    
    try {
      await createAlert({
        title,
        description,
        category,
        createdBy: user.id,
        ...(location ? {
          location: {
            latitude: 0,
            longitude: 0,
            address: location,
          }
        } : {}),
      });
      
      // router.push('/(app)/dashboard');
      <Redirect href="/(app)/dashboard" />;
    } catch (error) {
      console.error('Failed to create alert:', error);
    }
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen 
        options={{ 
          title: 'Create Alert',
          headerRight: () => (
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionTitle}>Select Category</Text>
          
          {categoryError ? (
            <Text style={styles.errorText}>{categoryError}</Text>
          ) : null}
          
          <View style={styles.categoriesContainer}>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                category === 'police' && styles.categoryButtonActive,
                { borderColor: colors.police },
              ]}
              onPress={() => setCategory('police')}
            >
              <Shield 
                size={24} 
                color={category === 'police' ? 'white' : colors.police} 
              />
              <Text 
                style={[
                  styles.categoryText,
                  category === 'police' && styles.categoryTextActive,
                ]}
              >
                Police
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.categoryButton,
                category === 'fire_department' && styles.categoryButtonActive,
                { borderColor: colors.fireDepartment },
              ]}
              onPress={() => setCategory('fire_department')}
            >
              <Flame 
                size={24} 
                color={category === 'fire_department' ? 'white' : colors.fireDepartment} 
              />
              <Text 
                style={[
                  styles.categoryText,
                  category === 'fire_department' && styles.categoryTextActive,
                ]}
              >
                Fire Dept.
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.categoryButton,
                category === 'civil_defense' && styles.categoryButtonActive,
                { borderColor: colors.civilDefense },
              ]}
              onPress={() => setCategory('civil_defense')}
            >
              <AlertTriangle 
                size={24} 
                color={category === 'civil_defense' ? 'white' : colors.civilDefense} 
              />
              <Text 
                style={[
                  styles.categoryText,
                  category === 'civil_defense' && styles.categoryTextActive,
                ]}
              >
                Civil Defense
              </Text>
            </TouchableOpacity>
          </View>
          
          <Input
            label="Title"
            placeholder="Brief title of the alert"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (titleError) setTitleError('');
            }}
            error={titleError}
            containerStyle={styles.inputContainer}
          />
          
          <Input
            label="Description"
            placeholder="Detailed description of the situation"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (descriptionError) setDescriptionError('');
            }}
            error={descriptionError}
            multiline
            numberOfLines={4}
            containerStyle={styles.inputContainer}
            style={styles.textArea}
          />
          
          <Input
            label="Location (Optional)"
            placeholder="Address or location description"
            value={location}
            onChangeText={setLocation}
            containerStyle={styles.inputContainer}
          />
          
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={handleCancel}
              variant="outline"
              style={styles.cancelButton}
            />
            
            <Button
              title="Submit Alert"
              onPress={handleSubmit}
              isLoading={isLoading}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
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
  contentContainer: {
    padding: 16,
  },
  closeButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  categoryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  inputContainer: {
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 2,
    marginLeft: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginBottom: 8,
  },
});
