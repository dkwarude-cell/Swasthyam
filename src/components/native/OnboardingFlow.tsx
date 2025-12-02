import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AwarenessScreen } from './onboarding/AwarenessScreen';
import { BasicInfoScreen } from './onboarding/BasicInfoScreen';
import { MedicalHistoryScreen } from './onboarding/MedicalHistoryScreen';
import { EatingHabitsScreen } from './onboarding/EatingHabitsScreen';
import { YourOilScreen } from './onboarding/YourOilScreen';
import { OilInsightsScreen } from './onboarding/OilInsightsScreen';

interface OnboardingFlowProps {
  onComplete: () => void;
  language: string;
}

export function OnboardingFlow({ onComplete, language }: OnboardingFlowProps) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [userData, setUserData] = useState<any>({});

  const handleNext = (screenNumber: number, data: any) => {
    // Save data from current screen
    setUserData({
      ...userData,
      [`screen${screenNumber}`]: data
    });
    
    // Move to next screen
    if (screenNumber < 5) {
      setCurrentScreen(screenNumber + 1);
    } else {
      handleComplete();
    }
  };

  const handleStart = () => {
    setCurrentScreen(1);
  };

  const handleBack = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleSkip = () => {
    if (currentScreen < 5) {
      setCurrentScreen(currentScreen + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    console.log('Onboarding completed with data:', userData);
    onComplete();
  };

  return (
    <View style={styles.container}>
      {currentScreen === 0 && (
        <AwarenessScreen
          onStart={handleStart}
          language={language}
        />
      )}
      
      {currentScreen === 1 && (
        <BasicInfoScreen
          onNext={(data) => handleNext(1, data)}
          onSkip={handleSkip}
          onBack={handleBack}
          language={language}
        />
      )}
      
      {currentScreen === 2 && (
        <MedicalHistoryScreen
          onNext={(data) => handleNext(2, data)}
          onSkip={handleSkip}
          onBack={handleBack}
          language={language}
          userData={userData}
        />
      )}
      
      {currentScreen === 3 && (
        <EatingHabitsScreen
          onNext={(data) => handleNext(3, data)}
          onSkip={handleSkip}
          onBack={handleBack}
          language={language}
        />
      )}
      
      {currentScreen === 4 && (
        <YourOilScreen
          onNext={(data) => handleNext(4, data)}
          onSkip={handleSkip}
          onBack={handleBack}
          language={language}
        />
      )}
      
      {currentScreen === 5 && (
        <OilInsightsScreen
          onComplete={handleComplete}
          onBack={handleBack}
          language={language}
          userData={userData}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfa',
  },
});
