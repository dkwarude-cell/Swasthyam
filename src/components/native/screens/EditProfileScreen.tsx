import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent } from '../Card';
import { Button } from '../Button';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';

interface EditProfileScreenProps {
  navigation: any;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 360;

const genderOptions = ['Male', 'Female', 'Other'];

export function EditProfileScreen({ navigation }: EditProfileScreenProps) {
  const { user, updateProfile } = useAuth();
  const { colors, isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
  });

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        age: user.age?.toString() || '',
        gender: user.gender || '',
        height: user.height?.toString() || '',
        weight: user.weight?.toString() || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Name is required');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Validation Error', 'Email is required');
      return;
    }

    // Validate numeric fields
    const age = formData.age ? parseInt(formData.age, 10) : undefined;
    const height = formData.height ? parseFloat(formData.height) : undefined;
    const weight = formData.weight ? parseFloat(formData.weight) : undefined;

    if (formData.age && (isNaN(age!) || age! < 1 || age! > 120)) {
      Alert.alert('Validation Error', 'Please enter a valid age (1-120)');
      return;
    }

    if (formData.height && (isNaN(height!) || height! < 50 || height! > 300)) {
      Alert.alert('Validation Error', 'Please enter a valid height (50-300 cm)');
      return;
    }

    if (formData.weight && (isNaN(weight!) || weight! < 10 || weight! > 500)) {
      Alert.alert('Validation Error', 'Please enter a valid weight (10-500 kg)');
      return;
    }

    setIsLoading(true);

    try {
      const updateData: any = {
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim() || undefined,
        gender: formData.gender || undefined,
      };

      // Only include numeric fields if they have valid values
      if (age) updateData.age = age;
      if (height) updateData.height = height;
      if (weight) updateData.weight = weight;

      const response = await updateProfile(updateData);

      if (response.success) {
        Alert.alert('Success', 'Profile updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', response.message || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating your profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenderSelect = (gender: string) => {
    setFormData({ ...formData, gender });
  };

  // Calculate BMI for display
  const calculateBMI = () => {
    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);
    if (height && weight && height > 0) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return '-';
  };

  const getBMICategory = (bmi: string) => {
    const bmiValue = parseFloat(bmi);
    if (isNaN(bmiValue)) return { text: '', color: '#666' };
    if (bmiValue < 18.5) return { text: 'Underweight', color: '#f59e0b' };
    if (bmiValue < 25) return { text: 'Normal', color: '#10b981' };
    if (bmiValue < 30) return { text: 'Overweight', color: '#f59e0b' };
    return { text: 'Obese', color: '#ef4444' };
  };

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
            <View style={styles.headerTop}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, isSmallScreen && styles.headerTitleSmall]}>
                Edit Profile
              </Text>
            </View>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: colors.surface }]}>
                <Ionicons name="person" size={48} color={colors.primary} />
              </View>
              <TouchableOpacity style={[styles.cameraButton, { backgroundColor: colors.secondary }]}>
                <Ionicons name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.content}>
            {/* Basic Information */}
            <Card style={[styles.card, { backgroundColor: colors.cardBackground }]}>
              <CardContent style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="person-circle-outline" size={24} color={colors.primary} />
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>
                </View>

                <View style={styles.field}>
                  <Text style={[styles.labelText, { color: colors.textSecondary }]}>Full Name *</Text>
                  <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                    <Ionicons name="person-outline" size={18} color={colors.textSecondary} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      value={formData.name}
                      onChangeText={(val) => setFormData({ ...formData, name: val })}
                      placeholder="Enter your name"
                      placeholderTextColor={colors.textTertiary}
                    />
                  </View>
                </View>

                <View style={styles.field}>
                  <Text style={[styles.labelText, { color: colors.textSecondary }]}>Email</Text>
                  <View style={[styles.inputContainer, styles.inputDisabled, { backgroundColor: colors.border, borderColor: colors.border }]}>
                    <Ionicons name="mail-outline" size={18} color={colors.textTertiary} />
                    <TextInput
                      style={[styles.input, styles.inputTextDisabled, { color: colors.textTertiary }]}
                      value={formData.email}
                      editable={false}
                      placeholder="Email"
                      placeholderTextColor={colors.textTertiary}
                    />
                    <Ionicons name="lock-closed" size={14} color={colors.textTertiary} />
                  </View>
                  <Text style={[styles.helperText, { color: colors.textTertiary }]}>Email cannot be changed</Text>
                </View>

                <View style={styles.field}>
                  <Text style={[styles.labelText, { color: colors.textSecondary }]}>Phone Number</Text>
                  <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                    <Ionicons name="call-outline" size={18} color={colors.textSecondary} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      value={formData.phoneNumber}
                      onChangeText={(val) => setFormData({ ...formData, phoneNumber: val })}
                      placeholder="+91 XXXXX XXXXX"
                      placeholderTextColor={colors.textTertiary}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
              </CardContent>
            </Card>

            {/* Personal Details */}
            <Card style={[styles.card, { backgroundColor: colors.cardBackground }]}>
              <CardContent style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="body-outline" size={24} color={colors.primary} />
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Details</Text>
                </View>

                <View style={styles.field}>
                  <Text style={[styles.labelText, { color: colors.textSecondary }]}>Age</Text>
                  <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                    <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      value={formData.age}
                      onChangeText={(val) => setFormData({ ...formData, age: val.replace(/[^0-9]/g, '') })}
                      placeholder="Your age"
                      placeholderTextColor={colors.textTertiary}
                      keyboardType="numeric"
                      maxLength={3}
                    />
                    <Text style={[styles.unitText, { color: colors.textSecondary }]}>years</Text>
                  </View>
                </View>

                <View style={styles.field}>
                  <Text style={[styles.labelText, { color: colors.textSecondary }]}>Gender</Text>
                  <View style={styles.genderContainer}>
                    {genderOptions.map((gender) => (
                      <TouchableOpacity
                        key={gender}
                        style={[
                          styles.genderOption,
                          { borderColor: colors.primary, backgroundColor: colors.surface },
                          formData.gender === gender && [styles.genderOptionSelected, { backgroundColor: colors.primary }]
                        ]}
                        onPress={() => handleGenderSelect(gender)}
                      >
                        <Ionicons
                          name={
                            gender === 'Male' ? 'male' :
                            gender === 'Female' ? 'female' : 'male-female'
                          }
                          size={18}
                          color={formData.gender === gender ? '#fff' : colors.primary}
                        />
                        <Text style={[
                          styles.genderOptionText,
                          { color: colors.primary },
                          formData.gender === gender && styles.genderOptionTextSelected
                        ]}>
                          {gender}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.rowFields}>
                  <View style={[styles.field, styles.halfField]}>
                    <Text style={[styles.labelText, { color: colors.textSecondary }]}>Height</Text>
                    <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                      <Ionicons name="resize-outline" size={18} color={colors.textSecondary} />
                      <TextInput
                        style={[styles.input, { color: colors.text }]}
                        value={formData.height}
                        onChangeText={(val) => setFormData({ ...formData, height: val.replace(/[^0-9.]/g, '') })}
                        placeholder="Height"
                        placeholderTextColor={colors.textTertiary}
                        keyboardType="numeric"
                        maxLength={5}
                      />
                      <Text style={[styles.unitText, { color: colors.textSecondary }]}>cm</Text>
                    </View>
                  </View>

                  <View style={[styles.field, styles.halfField]}>
                    <Text style={[styles.labelText, { color: colors.textSecondary }]}>Weight</Text>
                    <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
                      <Ionicons name="fitness-outline" size={18} color={colors.textSecondary} />
                      <TextInput
                        style={[styles.input, { color: colors.text }]}
                        value={formData.weight}
                        onChangeText={(val) => setFormData({ ...formData, weight: val.replace(/[^0-9.]/g, '') })}
                        placeholder="Weight"
                        placeholderTextColor={colors.textTertiary}
                        keyboardType="numeric"
                        maxLength={5}
                      />
                      <Text style={[styles.unitText, { color: colors.textSecondary }]}>kg</Text>
                    </View>
                  </View>
                </View>

                {/* BMI Display */}
                {formData.height && formData.weight && (
                  <View style={[styles.bmiContainer, { backgroundColor: colors.backgroundSecondary }]}>
                    <View style={styles.bmiHeader}>
                      <Text style={[styles.bmiLabel, { color: colors.textSecondary }]}>Your BMI</Text>
                      <View style={[styles.bmiBadge, { backgroundColor: bmiCategory.color + '20' }]}>
                        <Text style={[styles.bmiBadgeText, { color: bmiCategory.color }]}>
                          {bmiCategory.text}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.bmiValue, { color: bmiCategory.color }]}>{bmi}</Text>
                  </View>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <Button 
                onPress={handleSave} 
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <View style={styles.buttonContent}>
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </View>
                )}
              </Button>

              <TouchableOpacity 
                style={[styles.cancelButton, { borderColor: colors.border }]} 
                onPress={() => navigation.goBack()}
                disabled={isLoading}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfa',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    gap: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  headerTitleSmall: {
    fontSize: 18,
  },
  avatarContainer: {
    alignSelf: 'center',
    position: 'relative',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  content: {
    padding: 16,
    marginTop: -16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
  },
  cardContent: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#040707',
  },
  field: {
    marginBottom: 16,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 0,
  },
  inputTextDisabled: {
    color: '#999',
  },
  unitText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    marginLeft: 4,
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  genderOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1b4a5a',
    backgroundColor: '#fff',
    gap: 6,
  },
  genderOptionSelected: {
    backgroundColor: '#1b4a5a',
    borderColor: '#1b4a5a',
  },
  genderOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1b4a5a',
  },
  genderOptionTextSelected: {
    color: '#fff',
  },
  bmiContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  bmiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bmiLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  bmiBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bmiBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bmiValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  actions: {
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#1b4a5a',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});
