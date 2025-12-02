import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OnboardingScreen2Props {
  onNext: (data: any) => void;
  onSkip: () => void;
  onBack: () => void;
  language: string;
}

export function OnboardingScreen2({ onNext, onSkip, onBack, language }: OnboardingScreen2Props) {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const conditions = [
    { id: 'diabetes', label: 'Diabetes' },
    { id: 'hypertension', label: 'Hypertension' },
    { id: 'heart-disease', label: 'Heart Disease' },
    { id: 'arthritis', label: 'Arthritis' },
    { id: 'back-pain', label: 'Back Pain' },
    { id: 'knee-pain', label: 'Knee Pain' },
    { id: 'chronic-pain', label: 'Chronic Pain' },
    { id: 'none', label: 'None' },
  ];

  const toggleCondition = (id: string) => {
    if (id === 'none') {
      setSelectedConditions(selectedConditions.includes('none') ? [] : ['none']);
    } else {
      const filtered = selectedConditions.filter(c => c !== 'none');
      if (selectedConditions.includes(id)) {
        setSelectedConditions(filtered.filter(c => c !== id));
      } else {
        setSelectedConditions([...filtered, id]);
      }
    }
  };

  const handleContinue = () => {
    onNext({ medicalHistory: selectedConditions });
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
          <Text style={styles.stepText}>Step 2 of 5</Text>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: '40%' }]} />
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Medical History</Text>
        <Text style={styles.subtitle}>Share your health information</Text>

        <View style={styles.conditionsContainer}>
          {conditions.map((condition) => {
            const isSelected = selectedConditions.includes(condition.id);
            return (
              <TouchableOpacity
                key={condition.id}
                onPress={() => toggleCondition(condition.id)}
                style={[
                  styles.conditionButton,
                  isSelected && styles.conditionButtonSelected
                ]}
              >
                <Text style={styles.conditionLabel}>{condition.label}</Text>
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
  conditionsContainer: {
    gap: 12,
  },
  conditionButton: {
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
  conditionButtonSelected: {
    backgroundColor: '#E7F2F1',
    borderColor: '#1b4a5a',
  },
  conditionLabel: {
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
