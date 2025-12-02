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

interface OnboardingScreen4Props {
  onNext: (data: any) => void;
  onSkip: () => void;
  onBack: () => void;
  language: string;
}

export function OnboardingScreen4({ onNext, onSkip, onBack, language }: OnboardingScreen4Props) {
  const [selectedOils, setSelectedOils] = useState<string[]>([]);
  const [otherOil, setOtherOil] = useState('');
  const [monthlyUsage, setMonthlyUsage] = useState('');
  const [familyMembers, setFamilyMembers] = useState('');

  const oilTypes = [
    { id: 'sunflower', label: 'Sunflower Oil' },
    { id: 'rice-bran', label: 'Rice Bran Oil' },
    { id: 'groundnut', label: 'Groundnut Oil' },
    { id: 'mustard', label: 'Mustard Oil' },
    { id: 'soybean', label: 'Soybean Oil' },
    { id: 'olive', label: 'Olive Oil' },
    { id: 'coconut', label: 'Coconut Oil' },
    { id: 'ghee', label: 'Desi Ghee' },
    { id: 'mixed', label: 'Mixed/Blended Oil' },
    { id: 'other', label: 'Other' },
  ];

  const toggleOil = (id: string) => {
    if (selectedOils.includes(id)) {
      setSelectedOils(selectedOils.filter(o => o !== id));
    } else {
      setSelectedOils([...selectedOils, id]);
    }
  };

  const handleContinue = () => {
    onNext({ 
      oilTypes: selectedOils, 
      otherOil: selectedOils.includes('other') ? otherOil : '',
      monthlyUsage, 
      familyMembers 
    });
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
          <Text style={styles.stepText}>Step 4 of 5</Text>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: '80%' }]} />
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Your Oil at Home</Text>
        <Text style={styles.subtitle}>Tell us about the oil used in your kitchen</Text>

        <View style={styles.formContainer}>
          {/* Oil Type Selection */}
          <View style={styles.oilsContainer}>
            {oilTypes.map((oil) => {
              const isSelected = selectedOils.includes(oil.id);
              return (
                <TouchableOpacity
                  key={oil.id}
                  onPress={() => toggleOil(oil.id)}
                  style={[
                    styles.oilButton,
                    isSelected && styles.oilButtonSelected
                  ]}
                >
                  <Text style={styles.oilLabel}>{oil.label}</Text>
                  <View style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected
                  ]}>
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Other Oil Input */}
          {selectedOils.includes('other') && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Please specify</Text>
              <TextInput
                style={styles.input}
                value={otherOil}
                onChangeText={setOtherOil}
                placeholder="Enter oil type"
                placeholderTextColor="#999"
              />
            </View>
          )}

          {/* Monthly Usage */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Monthly oil usage (ml/L)</Text>
            <TextInput
              style={styles.input}
              value={monthlyUsage}
              onChangeText={setMonthlyUsage}
              placeholder="e.g., 3L or 3000ml"
              placeholderTextColor="#999"
            />
          </View>

          {/* Family Members */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Family members count</Text>
            <TextInput
              style={styles.input}
              value={familyMembers}
              onChangeText={setFamilyMembers}
              placeholder="Enter number of family members"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
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
  oilsContainer: {
    gap: 12,
  },
  oilButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E7F2F1',
  },
  oilButtonSelected: {
    backgroundColor: '#E7F2F1',
    borderColor: '#1b4a5a',
  },
  oilLabel: {
    fontSize: 15,
    color: '#040707',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#5B5B5B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#1b4a5a',
    borderColor: '#1b4a5a',
  },
  inputGroup: {
    marginTop: 20,
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
