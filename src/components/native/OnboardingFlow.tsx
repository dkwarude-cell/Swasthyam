import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { OnboardingScreen1 } from './onboarding/OnboardingScreen1';
import { OnboardingScreen2 } from './onboarding/OnboardingScreen2';
import { OnboardingScreen3 } from './onboarding/OnboardingScreen3';
import { OnboardingScreen4 } from './onboarding/OnboardingScreen4';
import { OnboardingScreen5 } from './onboarding/OnboardingScreen5';

interface OnboardingFlowProps {
  onComplete: () => void;
  language: string;
}

export function OnboardingFlow({ onComplete, language }: OnboardingFlowProps) {
  const [currentScreen, setCurrentScreen] = useState(1);
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
    }
  };

  const handleBack = () => {
    if (currentScreen > 1) {
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
      {currentScreen === 1 && (
        <OnboardingScreen1
          onNext={(data) => handleNext(1, data)}
          onSkip={handleSkip}
          onBack={handleBack}
          language={language}
        />
      )}
      
      {currentScreen === 2 && (
        <OnboardingScreen2
          onNext={(data) => handleNext(2, data)}
          onSkip={handleSkip}
          onBack={handleBack}
          language={language}
        />
      )}
      
      {currentScreen === 3 && (
        <OnboardingScreen3
          onNext={(data) => handleNext(3, data)}
          onSkip={handleSkip}
          onBack={handleBack}
          language={language}
        />
      )}
      
      {currentScreen === 4 && (
        <OnboardingScreen4
          onNext={(data) => handleNext(4, data)}
          onSkip={handleSkip}
          onBack={handleBack}
          language={language}
        />
      )}
      
      {currentScreen === 5 && (
        <OnboardingScreen5
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
