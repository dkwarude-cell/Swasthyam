import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Card, CardContent } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';

interface MobileProfileProps {
  language: string;
  onLogout: () => void;
}

const { width } = Dimensions.get('window');

const familyMembers = [
  { id: 1, name: 'Rajesh Sharma', relation: 'Self', consumption: 35, status: 'On Target' },
  { id: 2, name: 'Priya Sharma', relation: 'Spouse', consumption: 28, status: 'Excellent' },
  { id: 3, name: 'Aarav Sharma', relation: 'Son', consumption: 32, status: 'On Target' },
  { id: 4, name: 'Ananya Sharma', relation: 'Daughter', consumption: 25, status: 'Excellent' },
];

const achievements = [
  { id: 1, title: '10% Oil Reduction', icon: 'target', unlocked: true, points: 100 },
  { id: 2, title: '30-Day Streak', icon: 'flame', unlocked: true, points: 150 },
  { id: 3, title: 'Family Champion', icon: 'people', unlocked: true, points: 200 },
  { id: 4, title: 'Health Hero', icon: 'heart', unlocked: true, points: 120 },
  { id: 5, title: 'Community Leader', icon: 'trophy', unlocked: false, points: 300 },
  { id: 6, title: 'Recipe Master', icon: 'star', unlocked: false, points: 180 },
];

export function MobileProfile({ language, onLogout }: MobileProfileProps) {
  const navigation = useNavigation<any>();
  const [selectedTab, setSelectedTab] = useState('overview');

  const text = {
    en: {
      profile: 'Profile',
      subtitle: 'Track your progress',
      overview: 'Overview',
      family: 'Family',
      achievements: 'Achievements',
      settings: 'Settings',
      cpsScore: 'CPS Score',
      totalPoints: 'Total Points',
      currentStreak: 'Current Streak',
      days: 'days',
      members: 'members',
      consumption: 'Daily Consumption',
      ml: 'ml',
      edit: 'Edit Profile',
      logout: 'Logout',
      unlocked: 'Unlocked',
      locked: 'Locked',
      points: 'points',
    },
    hi: {
      profile: 'प्रोफ़ाइल',
      subtitle: 'अपनी प्रगति ट्रैक करें',
      overview: 'अवलोकन',
      family: 'परिवार',
      achievements: 'उपलब्धियाँ',
      settings: 'सेटिंग्स',
      cpsScore: 'CPS स्कोर',
      totalPoints: 'कुल अंक',
      currentStreak: 'वर्तमान स्ट्रीक',
      days: 'दिन',
      members: 'सदस्य',
      consumption: 'दैनिक खपत',
      ml: 'मिली',
      edit: 'प्रोफ़ाइल संपादित करें',
      logout: 'लॉगआउट',
      unlocked: 'अनलॉक',
      locked: 'लॉक',
      points: 'अंक',
    },
  };

  const t = text[language as keyof typeof text] || text.en;

  const totalPoints = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#ffffff" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Rajesh Sharma</Text>
            <Text style={styles.profileEmail}>rajesh@example.com</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>92</Text>
            <Text style={styles.statLabel}>{t.cpsScore}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalPoints}</Text>
            <Text style={styles.statLabel}>{t.totalPoints}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>{t.currentStreak} {t.days}</Text>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabs}
        >
          {['overview', 'family', 'achievements', 'settings'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.tabActive]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
                {t[tab as keyof typeof t]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'overview' && (
          <View>
            <Card style={styles.card}>
              <CardContent style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="analytics" size={24} color="#1b4a5a" />
                  <Text style={styles.sectionTitle}>Quick Stats</Text>
                </View>
                <View style={styles.quickStats}>
                  <View style={styles.quickStat}>
                    <Text style={styles.quickStatValue}>35 ml</Text>
                    <Text style={styles.quickStatLabel}>Today's Oil</Text>
                  </View>
                  <View style={styles.quickStat}>
                    <Text style={styles.quickStatValue}>-15%</Text>
                    <Text style={styles.quickStatLabel}>This Month</Text>
                  </View>
                  <View style={styles.quickStat}>
                    <Text style={styles.quickStatValue}>4</Text>
                    <Text style={styles.quickStatLabel}>Family</Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            <Button
              onPress={() => navigation.navigate('EditProfile')}
              style={styles.editButton}
            >
              {t.edit}
            </Button>
          </View>
        )}

        {selectedTab === 'family' && (
          <View>
            <Text style={styles.sectionTitleText}>Family Members</Text>
            {familyMembers.map((member) => (
              <Card key={member.id} style={styles.memberCard}>
                <CardContent style={styles.memberContent}>
                  <View style={styles.memberAvatar}>
                    <Ionicons name="person-circle" size={40} color="#1b4a5a" />
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberRelation}>{member.relation}</Text>
                    <Text style={styles.memberConsumption}>
                      {member.consumption} {t.ml} • {member.status}
                    </Text>
                  </View>
                  <Badge 
                    variant={member.status === 'Excellent' ? 'success' : 'default'}
                  >
                    <Text style={{color: member.status === 'Excellent' ? '#16a34a' : '#5B5B5B', fontSize: 10}}>{member.status}</Text>
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </View>
        )}

        {selectedTab === 'achievements' && (
          <View>
            <Text style={styles.sectionTitleText}>Your Achievements</Text>
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement) => (
                <View key={achievement.id} style={styles.achievementCard}>
                  <View style={[
                    styles.achievementIcon,
                    !achievement.unlocked && styles.achievementIconLocked
                  ]}>
                    <Ionicons 
                      name={achievement.icon as any} 
                      size={32} 
                      color={achievement.unlocked ? '#1b4a5a' : '#D3D3D3'} 
                    />
                  </View>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementPoints}>
                    {achievement.points} {t.points}
                  </Text>
                  <Badge variant={achievement.unlocked ? 'success' : 'default'}>
                    <Text style={{color: achievement.unlocked ? '#16a34a' : '#5B5B5B', fontSize: 10}}>{achievement.unlocked ? t.unlocked : t.locked}</Text>
                  </Badge>
                </View>
              ))}
            </View>
          </View>
        )}

        {selectedTab === 'settings' && (
          <View>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="person-outline" size={24} color="#1b4a5a" />
              <Text style={styles.settingText}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={20} color="#5B5B5B" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="notifications-outline" size={24} color="#1b4a5a" />
              <Text style={styles.settingText}>Notifications</Text>
              <Ionicons name="chevron-forward" size={20} color="#5B5B5B" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="lock-closed-outline" size={24} color="#1b4a5a" />
              <Text style={styles.settingText}>Privacy</Text>
              <Ionicons name="chevron-forward" size={20} color="#5B5B5B" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="help-circle-outline" size={24} color="#1b4a5a" />
              <Text style={styles.settingText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color="#5B5B5B" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingItem, styles.logoutItem]} onPress={onLogout}>
              <Ionicons name="log-out-outline" size={24} color="#EF4444" />
              <Text style={[styles.settingText, styles.logoutText]}>{t.logout}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfa',
  },
  header: {
    backgroundColor: '#1b4a5a',
    paddingTop: 60,
    paddingBottom: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  tabsScroll: {
    marginBottom: -1,
  },
  tabs: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tabActive: {
    backgroundColor: '#fafbfa',
  },
  tabText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  tabTextActive: {
    color: '#1b4a5a',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardContent: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#040707',
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#040707',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  quickStats: {
    flexDirection: 'row',
    gap: 12,
  },
  quickStat: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b4a5a',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#5B5B5B',
    textAlign: 'center',
  },
  editButton: {
    marginHorizontal: 0,
  },
  memberCard: {
    marginBottom: 12,
  },
  memberContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  memberAvatar: {
    width: 40,
    height: 40,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#040707',
    marginBottom: 2,
  },
  memberRelation: {
    fontSize: 13,
    color: '#5B5B5B',
    marginBottom: 4,
  },
  memberConsumption: {
    fontSize: 12,
    color: '#5B5B5B',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: (width - 44) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  achievementIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#E7F2F1',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIconLocked: {
    backgroundColor: '#f0f0f0',
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#040707',
    textAlign: 'center',
    marginBottom: 8,
  },
  achievementPoints: {
    fontSize: 12,
    color: '#5B5B5B',
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#040707',
  },
  logoutItem: {
    marginTop: 20,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '600',
  },
});
