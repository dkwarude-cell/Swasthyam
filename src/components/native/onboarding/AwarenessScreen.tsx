import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface AwarenessScreenProps {
  onStart: () => void;
  language: string;
}

const { width } = Dimensions.get('window');

export function AwarenessScreen({ onStart, language }: AwarenessScreenProps) {
  const features = [
    {
      icon: 'heart' as const,
      title: 'Smart Tracking',
      subtitle: 'Monitor your daily oil consumption',
    },
    {
      icon: 'trophy' as const,
      title: 'AI Recommendations',
      subtitle: 'Personalized recipe optimization',
    },
    {
      icon: 'people' as const,
      title: 'Community Engagement',
      subtitle: 'Join India\'s health movement',
    },
    {
      icon: 'shield-checkmark' as const,
      title: 'Healthy Kitchen Verified',
      subtitle: 'Blockchain-verified restaurants',
    },
  ];

  return (
    <LinearGradient
      colors={['#1b4a5a', '#2a5a6a']}
      style={styles.container}
    >
      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo/Icon */}
        <View style={styles.logoContainer}>
          <Ionicons name="water" size={56} color="#ffffff" />
        </View>

        {/* Title */}
        <Text style={styles.title}>Welcome to SwasthTel</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Your journey to healthier oil consumption starts here
        </Text>

        {/* Feature Cards */}
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon} size={24} color="#ffffff" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>National Goal</Text>
          <Text style={styles.statsValue}>10% Oil Reduction</Text>
          <Text style={styles.statsSubtext}>
            Join thousands in making India healthier
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.startButton} onPress={onStart}>
          <Text style={styles.startButtonText}>Start Your Journey</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    alignItems: 'center',
  },
  logoContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#fcaf56',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    color: '#ffeedd',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 16,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 48,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#fcaf56',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureSubtitle: {
    color: '#ffeedd',
    fontSize: 14,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  statsLabel: {
    color: '#fcaf56',
    fontSize: 14,
    marginBottom: 8,
  },
  statsValue: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsSubtext: {
    color: '#ffeedd',
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  startButton: {
    backgroundColor: '#fcaf56',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
