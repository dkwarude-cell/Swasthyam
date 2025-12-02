import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OnboardingScreen5Props {
  onComplete: () => void;
  onBack: () => void;
  language: string;
  userData: any;
}

export function OnboardingScreen5({ onComplete, onBack, language, userData }: OnboardingScreen5Props) {
  // Calculate daily oil consumption based on user data
  const calculateDailyConsumption = () => {
    const monthlyUsage = userData.screen4?.monthlyUsage || '3000';
    const familyMembers = userData.screen4?.familyMembers || '4';
    
    // Parse the monthly usage (handle both ml and L)
    let mlUsage = 0;
    if (monthlyUsage.toLowerCase().includes('l')) {
      mlUsage = parseFloat(monthlyUsage) * 1000;
    } else {
      mlUsage = parseFloat(monthlyUsage);
    }
    
    // Calculate daily per person
    const dailyPerPerson = mlUsage / 30 / parseInt(familyMembers);
    return Math.round(dailyPerPerson);
  };

  // Determine oil quality based on selected oils
  const getOilQuality = () => {
    const oils = userData.screen4?.oilTypes || [];
    
    // Good oils
    const goodOils = ['olive', 'rice-bran', 'mustard'];
    // Moderate oils
    const moderateOils = ['sunflower', 'groundnut', 'soybean', 'mixed'];
    // Needs improvement
    const needsImprovement = ['coconut', 'ghee'];
    
    const hasGoodOils = oils.some((oil: string) => goodOils.includes(oil));
    const hasNeedsImprovement = oils.some((oil: string) => needsImprovement.includes(oil));
    
    if (hasGoodOils && !hasNeedsImprovement) {
      return {
        rating: 'Good',
        color: '#1b4a5a',
        bgColor: '#E7F2F1',
        description: 'Your oil selection has positive health benefits. These oils are rich in healthy fats and nutrients.'
      };
    } else if (hasNeedsImprovement) {
      return {
        rating: 'Needs Improvement',
        color: '#fcaf56',
        bgColor: '#fff5e6',
        description: 'Consider reducing usage of saturated fat-rich oils. Try incorporating healthier alternatives like olive or rice bran oil.'
      };
    } else {
      return {
        rating: 'Moderate',
        color: '#5B5B5B',
        bgColor: '#f5f5f5',
        description: 'This oil has moderate health impact. Balanced usage and portion control can help improve your health outcomes.'
      };
    }
  };

  const dailyConsumption = calculateDailyConsumption();
  const oilQuality = getOilQuality();

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
          <Text style={styles.stepText}>Step 5 of 5</Text>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: '100%' }]} />
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Your Oil Insights</Text>
        <Text style={styles.subtitle}>Based on your inputs and household size</Text>

        <View style={styles.insightsContainer}>
          {/* Daily Consumption Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="trending-down" size={24} color="#1b4a5a" />
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardLabel}>Daily Oil Consumption</Text>
                <Text style={styles.cardSubLabel}>(Per Person)</Text>
              </View>
            </View>
            <View style={styles.consumptionBox}>
              <Text style={styles.consumptionValue}>{dailyConsumption}</Text>
              <Text style={styles.consumptionUnit}>ml per day</Text>
            </View>
          </View>

          {/* Oil Quality Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="checkmark-circle" size={24} color="#1b4a5a" />
              </View>
              <View>
                <Text style={styles.cardLabel}>Oil Quality Indicator</Text>
              </View>
            </View>
            <View style={[styles.qualityBox, { backgroundColor: oilQuality.bgColor }]}>
              <Text style={[styles.qualityRating, { color: oilQuality.color }]}>
                {oilQuality.rating}
              </Text>
            </View>
            <Text style={styles.qualityDescription}>
              {oilQuality.description}
            </Text>
          </View>

          {/* Motivational Message */}
          <View style={styles.motivationCard}>
            <View style={styles.motivationIconContainer}>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
            </View>
            <View style={styles.motivationContent}>
              <Text style={styles.motivationTitle}>Let's begin the journey!</Text>
              <Text style={styles.motivationText}>
                Let's begin the journey of SwasthTel — making India a healthier, lower-oil nation. Together, we can achieve better health outcomes for every household.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={onComplete}
        >
          <Text style={styles.continueButtonText}>Get Started</Text>
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
  insightsContainer: {
    gap: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E7F2F1',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E7F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 14,
    color: '#5B5B5B',
  },
  cardSubLabel: {
    fontSize: 14,
    color: '#040707',
  },
  consumptionBox: {
    backgroundColor: '#E7F2F1',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  consumptionValue: {
    fontSize: 48,
    color: '#1b4a5a',
    fontWeight: '600',
    marginBottom: 8,
  },
  consumptionUnit: {
    fontSize: 14,
    color: '#5B5B5B',
  },
  qualityBox: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  qualityRating: {
    fontSize: 24,
    fontWeight: '600',
  },
  qualityDescription: {
    fontSize: 14,
    color: '#5B5B5B',
    lineHeight: 20,
  },
  motivationCard: {
    backgroundColor: '#1b4a5a',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    gap: 12,
  },
  motivationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  motivationContent: {
    flex: 1,
  },
  motivationTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
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
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
