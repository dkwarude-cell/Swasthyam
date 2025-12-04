import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showArrow?: boolean;
  destructive?: boolean;
}

function SettingItem({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  rightElement, 
  showArrow = true,
  destructive = false 
}: SettingItemProps) {
  return (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress && !rightElement}
    >
      <View style={[styles.iconContainer, destructive && styles.destructiveIcon]}>
        <Ionicons 
          name={icon} 
          size={22} 
          color={destructive ? '#ef4444' : '#1b4a5a'} 
        />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, destructive && styles.destructiveText]}>
          {title}
        </Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement || (showArrow && onPress && (
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      ))}
    </TouchableOpacity>
  );
}

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

export function SettingsScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometrics, setBiometrics] = useState(false);

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear the app cache? This will not delete your data.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: () => Alert.alert('Success', 'Cache cleared successfully') },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Handle account deletion
          } 
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1b4a5a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Account Section */}
        <SettingSection title="Account">
          <SettingItem
            icon="person-outline"
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <SettingItem
            icon="shield-checkmark-outline"
            title="Privacy Settings"
            subtitle="Manage your privacy preferences"
            onPress={() => navigation.navigate('PrivacySettings')}
          />
          <SettingItem
            icon="lock-closed-outline"
            title="Change Password"
            subtitle="Update your password"
            onPress={() => {}}
          />
        </SettingSection>

        {/* Preferences Section */}
        <SettingSection title="Preferences">
          <SettingItem
            icon="notifications-outline"
            title="Push Notifications"
            subtitle="Receive daily reminders and updates"
            showArrow={false}
            rightElement={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#d1d5db', true: '#07A996' }}
                thumbColor="#ffffff"
              />
            }
          />
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            subtitle="Use dark theme"
            showArrow={false}
            rightElement={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#d1d5db', true: '#07A996' }}
                thumbColor="#ffffff"
              />
            }
          />
          <SettingItem
            icon="finger-print-outline"
            title="Biometric Login"
            subtitle="Use fingerprint or face ID"
            showArrow={false}
            rightElement={
              <Switch
                value={biometrics}
                onValueChange={setBiometrics}
                trackColor={{ false: '#d1d5db', true: '#07A996' }}
                thumbColor="#ffffff"
              />
            }
          />
          <SettingItem
            icon="language-outline"
            title="Language"
            subtitle="English"
            onPress={() => {}}
          />
        </SettingSection>

        {/* Goals Section */}
        <SettingSection title="Health Goals">
          <SettingItem
            icon="fitness-outline"
            title="My Goals"
            subtitle="View and manage your health goals"
            onPress={() => navigation.navigate('MyGoals')}
          />
          <SettingItem
            icon="analytics-outline"
            title="Goal Settings"
            subtitle="Configure goal tracking preferences"
            onPress={() => navigation.navigate('GoalSettings')}
          />
        </SettingSection>

        {/* Devices Section */}
        <SettingSection title="Connected Devices">
          <SettingItem
            icon="hardware-chip-outline"
            title="Device Management"
            subtitle="Manage your smart kitchen devices"
            onPress={() => navigation.navigate('DeviceManagement')}
          />
        </SettingSection>

        {/* Support Section */}
        <SettingSection title="Support">
          <SettingItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="FAQs and customer support"
            onPress={() => navigation.navigate('HelpSupport')}
          />
          <SettingItem
            icon="document-text-outline"
            title="Terms of Service"
            onPress={() => {}}
          />
          <SettingItem
            icon="shield-outline"
            title="Privacy Policy"
            onPress={() => {}}
          />
          <SettingItem
            icon="star-outline"
            title="Rate the App"
            onPress={() => {}}
          />
        </SettingSection>

        {/* Data Section */}
        <SettingSection title="Data">
          <SettingItem
            icon="cloud-download-outline"
            title="Export Data"
            subtitle="Download your health data"
            onPress={() => {}}
          />
          <SettingItem
            icon="trash-outline"
            title="Clear Cache"
            subtitle="Free up storage space"
            onPress={handleClearCache}
          />
        </SettingSection>

        {/* Danger Zone */}
        <SettingSection title="Danger Zone">
          <SettingItem
            icon="trash-outline"
            title="Delete Account"
            subtitle="Permanently delete your account"
            onPress={handleDeleteAccount}
            destructive
          />
        </SettingSection>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>SwasthTel v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2025 SwasthTel. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1b4a5a',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destructiveIcon: {
    backgroundColor: '#fef2f2',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  destructiveText: {
    color: '#ef4444',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appVersion: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
    color: '#d1d5db',
  },
});

export default SettingsScreen;
