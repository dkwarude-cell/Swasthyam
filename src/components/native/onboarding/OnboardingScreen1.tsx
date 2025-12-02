import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OnboardingScreen1Props {
  onNext: (data: any) => void;
  onSkip: () => void;
  onBack: () => void;
  language: string;
}

export function OnboardingScreen1({ onNext, onSkip, onBack, language }: OnboardingScreen1Props) {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showActivityPicker, setShowActivityPicker] = useState(false);

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' },
  ];

  const activityOptions = [
    { value: 'sedentary', label: 'Sedentary (Little or no exercise)' },
    { value: 'light', label: 'Light (Exercise 1-3 days/week)' },
    { value: 'moderate', label: 'Moderate (Exercise 3-5 days/week)' },
    { value: 'active', label: 'Active (Exercise 6-7 days/week)' },
    { value: 'very-active', label: 'Very Active (Physical job or intense exercise)' },
  ];

  const handleContinue = () => {
    onNext({ age, gender, weight, height, activityLevel });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={onBack}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={20} color="#5B5B5B" />
          </TouchableOpacity>
          <Text style={styles.stepText}>Step 1 of 5</Text>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: '20%' }]} />
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Basic Information</Text>
        <Text style={styles.subtitle}>Help us personalize your experience</Text>

        <View style={styles.formContainer}>
          {/* Age Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Enter your age"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          {/* Gender Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowGenderPicker(!showGenderPicker)}
            >
              <Text style={gender ? styles.inputText : styles.placeholder}>
                {gender ? genderOptions.find(g => g.value === gender)?.label : 'Select gender'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#5B5B5B" />
            </TouchableOpacity>
            
            {showGenderPicker && (
              <View style={styles.pickerContainer}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.pickerOption}
                    onPress={() => {
                      setGender(option.value);
                      setShowGenderPicker(false);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Weight Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="Enter your weight in kg"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          {/* Height Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              placeholder="Enter your height in cm"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          {/* Activity Level Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Activity Level</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowActivityPicker(!showActivityPicker)}
            >
              <Text style={activityLevel ? styles.inputText : styles.placeholder}>
                {activityLevel ? activityOptions.find(a => a.value === activityLevel)?.label : 'Select activity level'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#5B5B5B" />
            </TouchableOpacity>
            
            {showActivityPicker && (
              <View style={styles.pickerContainer}>
                {activityOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.pickerOption}
                    onPress={() => {
                      setActivityLevel(option.value);
                      setShowActivityPicker(false);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={onSkip}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfa',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E7F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    color: '#5B5B5B',
    fontSize: 14,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E7F2F1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1b4a5a',
    borderRadius: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    color: '#040707',
    marginBottom: 8,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#5B5B5B',
    marginBottom: 32,
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#040707',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E7F2F1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#040707',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    color: '#040707',
    fontSize: 15,
  },
  placeholder: {
    color: '#999',
    fontSize: 15,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E7F2F1',
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E7F2F1',
  },
  pickerOptionText: {
    fontSize: 15,
    color: '#040707',
  },
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E7F2F1',
  },
  continueButton: {
    backgroundColor: '#1b4a5a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#5B5B5B',
    fontSize: 14,
  },
});
