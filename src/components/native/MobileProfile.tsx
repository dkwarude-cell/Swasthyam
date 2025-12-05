import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Card, CardContent } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import apiService, { FamilyMember } from '../../services/api';

interface MobileProfileProps {
  language: string;
  onLogout: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Responsive breakpoints
const isSmallScreen = SCREEN_WIDTH < 360;

const achievements = [
  { id: 1, title: '10% Oil Reduction', icon: 'analytics', unlocked: true, points: 100 },
  { id: 2, title: '30-Day Streak', icon: 'flame', unlocked: true, points: 150 },
  { id: 3, title: 'Family Champion', icon: 'people', unlocked: true, points: 200 },
  { id: 4, title: 'Health Hero', icon: 'heart', unlocked: true, points: 120 },
  { id: 5, title: 'Community Leader', icon: 'trophy', unlocked: false, points: 300 },
  { id: 6, title: 'Recipe Master', icon: 'star', unlocked: false, points: 180 },
];

const relationOptions = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'parent', label: 'Parent' },
  { value: 'child', label: 'Child' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'other', label: 'Other' },
];

export function MobileProfile({ language, onLogout }: MobileProfileProps) {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { colors, isDark } = useTheme();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Add family member modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ _id: string; email: string; name: string; avatar?: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ _id: string; email: string; name: string } | null>(null);
  const [selectedRelation, setSelectedRelation] = useState('');

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
      currentStreak: 'Streak',
      days: 'days',
      members: 'members',
      consumption: 'Daily Consumption',
      ml: 'ml',
      edit: 'Edit Profile',
      logout: 'Logout',
      unlocked: 'Unlocked',
      locked: 'Locked',
      points: 'points',
      addFamily: 'Add Family Member',
      searchUsers: 'Search by email or name...',
      selectRelation: 'Select Relation',
      add: 'Add',
      cancel: 'Cancel',
      noResults: 'No users found',
      remove: 'Remove',
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
      currentStreak: 'स्ट्रीक',
      days: 'दिन',
      members: 'सदस्य',
      consumption: 'दैनिक खपत',
      ml: 'मिली',
      edit: 'प्रोफ़ाइल संपादित करें',
      logout: 'लॉगआउट',
      unlocked: 'अनलॉक',
      locked: 'लॉक',
      points: 'अंक',
      addFamily: 'परिवार का सदस्य जोड़ें',
      searchUsers: 'ईमेल या नाम से खोजें...',
      selectRelation: 'संबंध चुनें',
      add: 'जोड़ें',
      cancel: 'रद्द करें',
      noResults: 'कोई उपयोगकर्ता नहीं मिला',
      remove: 'हटाएं',
    },
  };

  const t = text[language as keyof typeof text] || text.en;

  const totalPoints = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);

  // Load family members
  const loadFamilyMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getFamilyMembers();
      if (response.success && response.data) {
        setFamilyMembers(response.data);
      } else if ((response as any).familyMembers) {
        setFamilyMembers((response as any).familyMembers as FamilyMember[]);
      }
    } catch (error) {
      console.error('Failed to load family members:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedTab === 'family') {
      loadFamilyMembers();
    }
  }, [selectedTab, loadFamilyMembers]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFamilyMembers();
    setRefreshing(false);
  }, [loadFamilyMembers]);

  // Search users
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    try {
      setIsSearching(true);
      const response = await apiService.searchUsers(query);
      if (response.success && (response as any).users) {
        setSearchResults((response as any).users);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Add family member
  const handleAddFamilyMember = async () => {
    if (!selectedUser || !selectedRelation) {
      Alert.alert('Error', 'Please select a user and relation');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await apiService.addFamilyMember(selectedUser._id, selectedRelation);
      if (response.success) {
        Alert.alert('Success', 'Family member added successfully');
        setShowAddModal(false);
        setSelectedUser(null);
        setSelectedRelation('');
        setSearchQuery('');
        setSearchResults([]);
        loadFamilyMembers();
      } else {
        Alert.alert('Error', response.message || 'Failed to add family member');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add family member');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove family member
  const handleRemoveFamilyMember = async (userId: string, name: string) => {
    Alert.alert(
      'Remove Family Member',
      `Are you sure you want to remove ${name} from your family?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await apiService.removeFamilyMember(userId);
              if (response.success) {
                loadFamilyMembers();
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to remove family member');
            }
          },
        },
      ]
    );
  };

  // Get display name
  const displayName = user?.name || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || '';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, isSmallScreen && styles.avatarSmall, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.2)' }]}>
            <Ionicons name="person" size={isSmallScreen ? 30 : 40} color="#ffffff" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, isSmallScreen && styles.profileNameSmall]} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={[styles.profileEmail, isSmallScreen && styles.profileEmailSmall]} numberOfLines={1}>
              {displayEmail}
            </Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, isSmallScreen && styles.statCardSmall, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.1)' }]}>
            <Text style={[styles.statValue, isSmallScreen && styles.statValueSmall]}>
              {user?.healthRiskLevel ? 100 - user.healthRiskLevel : 92}
            </Text>
            <Text style={[styles.statLabel, isSmallScreen && styles.statLabelSmall]}>{t.cpsScore}</Text>
          </View>
          <View style={[styles.statCard, isSmallScreen && styles.statCardSmall, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.1)' }]}>
            <Text style={[styles.statValue, isSmallScreen && styles.statValueSmall]}>{totalPoints}</Text>
            <Text style={[styles.statLabel, isSmallScreen && styles.statLabelSmall]}>{t.totalPoints}</Text>
          </View>
          <View style={[styles.statCard, isSmallScreen && styles.statCardSmall, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.1)' }]}>
            <Text style={[styles.statValue, isSmallScreen && styles.statValueSmall]}>45</Text>
            <Text style={[styles.statLabel, isSmallScreen && styles.statLabelSmall]}>{t.currentStreak}</Text>
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
              style={[styles.tab, selectedTab === tab && [styles.tabActive, { backgroundColor: colors.background }]]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[
                styles.tabText, 
                selectedTab === tab && [styles.tabTextActive, { color: colors.primary }],
                isSmallScreen && styles.tabTextSmall
              ]}>
                {t[tab as keyof typeof t]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {selectedTab === 'overview' && (
          <View>
            <Card style={[styles.card, { backgroundColor: colors.cardBackground }]}>
              <CardContent style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="analytics" size={24} color={colors.primary} />
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Stats</Text>
                </View>
                <View style={styles.quickStats}>
                  <View style={styles.quickStat}>
                    <Text style={[styles.quickStatValue, isSmallScreen && styles.quickStatValueSmall, { color: colors.primary }]}>
                      {user?.dailyOilLimit || 35} ml
                    </Text>
                    <Text style={[styles.quickStatLabel, { color: colors.textSecondary }]}>Daily Limit</Text>
                  </View>
                  <View style={styles.quickStat}>
                    <Text style={[styles.quickStatValue, isSmallScreen && styles.quickStatValueSmall, { color: colors.primary }]}>
                      {user?.bmi?.toFixed(1) || '-'}
                    </Text>
                    <Text style={[styles.quickStatLabel, { color: colors.textSecondary }]}>BMI</Text>
                  </View>
                  <View style={styles.quickStat}>
                    <Text style={[styles.quickStatValue, isSmallScreen && styles.quickStatValueSmall, { color: colors.primary }]}>
                      {familyMembers.length + 1}
                    </Text>
                    <Text style={[styles.quickStatLabel, { color: colors.textSecondary }]}>Family</Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            {/* User Details Card */}
            <Card style={[styles.card, { backgroundColor: colors.cardBackground }]}>
              <CardContent style={styles.cardContent}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="person" size={24} color={colors.primary} />
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Details</Text>
                </View>
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Age</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{user?.age || '-'}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Gender</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{user?.gender || '-'}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Height</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{user?.height ? `${user.height} cm` : '-'}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Weight</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{user?.weight ? `${user.weight} kg` : '-'}</Text>
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

            {/* Logout Button */}
            <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.error }]} onPress={onLogout}>
              <Ionicons name="log-out-outline" size={20} color="#ffffff" />
              <Text style={styles.logoutButtonText}>{t.logout}</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedTab === 'family' && (
          <View>
            <View style={styles.familyHeader}>
              <Text style={[styles.sectionTitleText, { color: colors.text }]}>Family Members</Text>
              <TouchableOpacity 
                style={styles.addFamilyButton}
                onPress={() => setShowAddModal(true)}
              >
                <Ionicons name="add-circle" size={24} color={colors.primary} />
                <Text style={[styles.addFamilyText, { color: colors.primary }]}>{t.addFamily}</Text>
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
            ) : familyMembers.length === 0 ? (
              <Card style={[styles.emptyCard, { backgroundColor: colors.cardBackground }]}>
                <CardContent style={styles.emptyContent}>
                  <Ionicons name="people-outline" size={48} color={colors.textTertiary} />
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No family members yet</Text>
                  <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>Add family members to track their health together</Text>
                </CardContent>
              </Card>
            ) : (
              familyMembers.map((member) => (
                <Card key={member._id} style={[styles.memberCard, { backgroundColor: colors.cardBackground }]}>
                  <CardContent style={styles.memberContent}>
                    <View style={styles.memberAvatar}>
                      <Ionicons name="person-circle" size={40} color={colors.primary} />
                    </View>
                    <View style={styles.memberInfo}>
                      <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
                      <Text style={[styles.memberRelation, { color: colors.primary }]}>
                        {member.relation.charAt(0).toUpperCase() + member.relation.slice(1)}
                      </Text>
                      <Text style={[styles.memberEmail, { color: colors.textSecondary }]}>{member.email}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => handleRemoveFamilyMember(member._id, member.name)}
                    >
                      <Ionicons name="close-circle" size={24} color={colors.error} />
                    </TouchableOpacity>
                  </CardContent>
                </Card>
              ))
            )}
          </View>
        )}

        {selectedTab === 'achievements' && (
          <View>
            <Text style={[styles.sectionTitleText, { color: colors.text }]}>Your Achievements</Text>
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement) => (
                <View key={achievement.id} style={[
                  styles.achievementCard,
                  { width: (SCREEN_WIDTH - 48) / 2, backgroundColor: colors.cardBackground }
                ]}>
                  <View style={[
                    styles.achievementIcon,
                    { backgroundColor: colors.primary + '15' },
                    !achievement.unlocked && [styles.achievementIconLocked, { backgroundColor: colors.border }]
                  ]}>
                    <Ionicons 
                      name={achievement.icon as any} 
                      size={isSmallScreen ? 28 : 32} 
                      color={achievement.unlocked ? colors.primary : colors.textTertiary} 
                    />
                  </View>
                  <Text style={[styles.achievementTitle, isSmallScreen && styles.achievementTitleSmall, { color: colors.text }]}>
                    {achievement.title}
                  </Text>
                  <Text style={[styles.achievementPoints, { color: colors.textSecondary }]}>
                    {achievement.points} {t.points}
                  </Text>
                  <Badge variant={achievement.unlocked ? 'success' : 'default'}>
                    <Text style={{
                      color: achievement.unlocked ? colors.success : colors.textSecondary, 
                      fontSize: isSmallScreen ? 9 : 10
                    }}>
                      {achievement.unlocked ? t.unlocked : t.locked}
                    </Text>
                  </Badge>
                </View>
              ))}
            </View>
          </View>
        )}

        {selectedTab === 'settings' && (
          <View>
            <TouchableOpacity 
              style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Ionicons name="person-outline" size={24} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={24} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>Notifications</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}
              onPress={() => navigation.navigate('GoalSettings')}
            >
              <Ionicons name="flag-outline" size={24} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>Goal Settings</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}
              onPress={() => navigation.navigate('PrivacySettings')}
            >
              <Ionicons name="lock-closed-outline" size={24} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>Privacy</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}
              onPress={() => navigation.navigate('HelpSupport')}
            >
              <Ionicons name="help-circle-outline" size={24} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}
              onPress={() => navigation.navigate('Settings')}
            >
              <Ionicons name="settings-outline" size={24} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>App Settings</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingItem, styles.logoutItem, { backgroundColor: colors.cardBackground }]} onPress={onLogout}>
              <Ionicons name="log-out-outline" size={24} color={colors.error} />
              <Text style={[styles.settingText, { color: colors.error, fontWeight: '600' }]}>{t.logout}</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Family Member Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{t.addFamily}</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground }]}>
              <Ionicons name="search" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder={t.searchUsers}
                placeholderTextColor={colors.textTertiary}
                value={searchQuery}
                onChangeText={handleSearch}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {isSearching && <ActivityIndicator size="small" color={colors.primary} />}
            </View>

            {/* Search Results */}
            {searchResults.length > 0 && !selectedUser && (
              <ScrollView style={styles.searchResults}>
                {searchResults.map((result) => (
                  <TouchableOpacity
                    key={result._id}
                    style={[styles.searchResultItem, { borderBottomColor: colors.border }]}
                    onPress={() => {
                      setSelectedUser(result);
                      setSearchResults([]);
                    }}
                  >
                    <View style={styles.searchResultAvatar}>
                      <Ionicons name="person-circle" size={36} color={colors.primary} />
                    </View>
                    <View style={styles.searchResultInfo}>
                      <Text style={[styles.searchResultName, { color: colors.text }]}>{result.name}</Text>
                      <Text style={[styles.searchResultEmail, { color: colors.textSecondary }]}>{result.email}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && !selectedUser && (
              <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>{t.noResults}</Text>
            )}

            {/* Selected User */}
            {selectedUser && (
              <View style={styles.selectedUserContainer}>
                <View style={[styles.selectedUser, { backgroundColor: colors.primary + '15' }]}>
                  <Ionicons name="person-circle" size={40} color={colors.primary} />
                  <View style={styles.selectedUserInfo}>
                    <Text style={[styles.selectedUserName, { color: colors.primary }]}>{selectedUser.name}</Text>
                    <Text style={[styles.selectedUserEmail, { color: colors.textSecondary }]}>{selectedUser.email}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedUser(null)}>
                    <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* Relation Selection */}
                <Text style={[styles.relationLabel, { color: colors.text }]}>{t.selectRelation}</Text>
                <View style={styles.relationGrid}>
                  {relationOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.relationOption,
                        { borderColor: colors.border, backgroundColor: colors.surface },
                        selectedRelation === option.value && [styles.relationOptionSelected, { backgroundColor: colors.primary, borderColor: colors.primary }]
                      ]}
                      onPress={() => setSelectedRelation(option.value)}
                    >
                      <Text style={[
                        styles.relationOptionText,
                        { color: colors.text },
                        selectedRelation === option.value && styles.relationOptionTextSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => {
                  setShowAddModal(false);
                  setSelectedUser(null);
                  setSelectedRelation('');
                  setSearchQuery('');
                  setSearchResults([]);
                }}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>{t.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.addMemberButton,
                  { backgroundColor: colors.primary },
                  (!selectedUser || !selectedRelation) && styles.addMemberButtonDisabled
                ]}
                onPress={handleAddFamilyMember}
                disabled={!selectedUser || !selectedRelation || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.addMemberButtonText}>{t.add}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSmall: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
  profileNameSmall: {
    fontSize: 18,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  profileEmailSmall: {
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statCardSmall: {
    padding: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  statValueSmall: {
    fontSize: 18,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  statLabelSmall: {
    fontSize: 9,
  },
  tabsScroll: {
    marginBottom: -1,
  },
  tabs: {
    paddingHorizontal: 12,
    gap: 4,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
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
  tabTextSmall: {
    fontSize: 12,
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
  quickStatValueSmall: {
    fontSize: 16,
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#5B5B5B',
    textAlign: 'center',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailItem: {
    width: '45%',
  },
  detailLabel: {
    fontSize: 12,
    color: '#5B5B5B',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#040707',
  },
  editButton: {
    marginHorizontal: 0,
  },
  familyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addFamilyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addFamilyText: {
    color: '#1b4a5a',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyCard: {
    marginTop: 20,
  },
  emptyContent: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  memberCard: {
    marginBottom: 12,
  },
  memberContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
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
    color: '#1b4a5a',
    fontWeight: '500',
    marginBottom: 2,
  },
  memberEmail: {
    fontSize: 12,
    color: '#5B5B5B',
  },
  removeButton: {
    padding: 4,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  achievementCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  achievementIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#E7F2F1',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIconLocked: {
    backgroundColor: '#f0f0f0',
  },
  achievementTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#040707',
    textAlign: 'center',
    marginBottom: 6,
  },
  achievementTitleSmall: {
    fontSize: 11,
  },
  achievementPoints: {
    fontSize: 11,
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchResults: {
    maxHeight: 200,
    marginBottom: 16,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
  },
  searchResultAvatar: {
    width: 36,
    height: 36,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  searchResultEmail: {
    fontSize: 13,
    color: '#666',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
  },
  selectedUserContainer: {
    marginBottom: 20,
  },
  selectedUser: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7F2F1',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  selectedUserInfo: {
    flex: 1,
  },
  selectedUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1b4a5a',
  },
  selectedUserEmail: {
    fontSize: 13,
    color: '#666',
  },
  relationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  relationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  relationOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  relationOptionSelected: {
    borderColor: '#1b4a5a',
    backgroundColor: '#1b4a5a',
  },
  relationOptionText: {
    fontSize: 14,
    color: '#333',
  },
  relationOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  addMemberButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#1b4a5a',
    alignItems: 'center',
  },
  addMemberButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addMemberButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
