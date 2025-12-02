import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent } from './Card';
import { Badge } from './Badge';

interface MobileCommunityProps {
  language: string;
  navigation?: any;
}

const { width } = Dimensions.get('window');

const communityPosts = [
  {
    id: 1,
    user: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    time: '2 hours ago',
    content: 'Successfully reduced my family\'s oil consumption by 15% this month! The air fryer recipes are a game changer. 🎉',
    likes: 24,
    comments: 8,
    achievement: 'Oil Saver',
  },
  {
    id: 2,
    user: 'Rajesh Kumar',
    location: 'Delhi',
    time: '5 hours ago',
    content: 'Just completed the 30-day challenge! My cholesterol levels have improved significantly. Thank you SwasthTel! 💪',
    likes: 42,
    comments: 15,
    achievement: 'Challenge Champion',
  },
  {
    id: 3,
    user: 'Anita Patel',
    location: 'Ahmedabad, Gujarat',
    time: '1 day ago',
    content: 'Sharing my favorite low-oil gujarati dish - it tastes just as good with 70% less oil!',
    likes: 35,
    comments: 12,
  },
];

const groups = [
  { name: 'Health Warriors Mumbai', members: 342, discussions: 23 },
  { name: 'School Kitchen Innovators', members: 578, discussions: 45 },
  { name: 'Air Fryer Enthusiasts', members: 425, discussions: 34 },
  { name: 'Traditional Recipes Low-Oil', members: 612, discussions: 56 },
];

export function MobileCommunity({ language, navigation }: MobileCommunityProps) {
  const [selectedTab, setSelectedTab] = useState('feed');

  const text = {
    en: {
      community: 'Community',
      subtitle: 'Connect & share your journey',
      feed: 'Feed',
      groups: 'Groups',
      leaderboard: 'Leaderboard',
      likes: 'likes',
      comments: 'comments',
      members: 'members',
      discussions: 'discussions',
    },
    hi: {
      community: 'समुदाय',
      subtitle: 'जुड़ें और अपनी यात्रा साझा करें',
      feed: 'फ़ीड',
      groups: 'समूह',
      leaderboard: 'लीडरबोर्ड',
      likes: 'पसंद',
      comments: 'टिप्पणियाँ',
      members: 'सदस्य',
      discussions: 'चर्चाएँ',
    },
  };

  const t = text[language as keyof typeof text] || text.en;

  const renderPost = ({ item }: any) => (
    <Card style={styles.postCard}>
      <CardContent style={styles.postContent}>
        <View style={styles.postHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={40} color="#1b4a5a" />
          </View>
          <View style={styles.postUserInfo}>
            <Text style={styles.userName}>{item.user}</Text>
            <Text style={styles.location}>{item.location}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          {item.achievement && (
            <Badge variant="success" style={styles.achievementBadge}>
              <Text style={{color: '#16a34a', fontSize: 10}}>{item.achievement}</Text>
            </Badge>
          )}
        </View>

        <Text style={styles.postContent}>{item.content}</Text>

        <View style={styles.postActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart-outline" size={20} color="#5B5B5B" />
            <Text style={styles.actionText}>{item.likes} {t.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={20} color="#5B5B5B" />
            <Text style={styles.actionText}>{item.comments} {t.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={20} color="#5B5B5B" />
          </TouchableOpacity>
        </View>
      </CardContent>
    </Card>
  );

  const renderGroup = ({ item }: any) => (
    <TouchableOpacity style={styles.groupCard}>
      <View style={styles.groupIcon}>
        <Ionicons name="people" size={32} color="#1b4a5a" />
      </View>
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{item.name}</Text>
        <Text style={styles.groupStats}>
          {item.members} {t.members} • {item.discussions} {t.discussions}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#5B5B5B" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="people" size={24} color="#ffffff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>{t.community}</Text>
            <Text style={styles.headerSubtitle}>{t.subtitle}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {['feed', 'groups', 'leaderboard'].map((tab) => (
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
        </View>
      </View>

      {/* Content */}
      {selectedTab === 'feed' && (
        <FlatList
          data={communityPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {selectedTab === 'groups' && (
        <FlatList
          data={groups}
          renderItem={renderGroup}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {selectedTab === 'leaderboard' && (
        <ScrollView contentContainerStyle={styles.listContainer}>
          <Card style={styles.card}>
            <CardContent style={styles.cardContent}>
              <Text style={styles.comingSoon}>Leaderboard Coming Soon!</Text>
              <Text style={styles.comingSoonSubtitle}>
                Compete with other users and climb the ranks
              </Text>
            </CardContent>
          </Card>
        </ScrollView>
      )}
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
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tabTextActive: {
    color: '#1b4a5a',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  postCard: {
    marginBottom: 16,
  },
  postContent: {
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
  },
  postUserInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#040707',
  },
  location: {
    fontSize: 12,
    color: '#5B5B5B',
  },
  time: {
    fontSize: 11,
    color: '#5B5B5B',
  },
  achievementBadge: {
    alignSelf: 'flex-start',
  },
  postActions: {
    flexDirection: 'row',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#5B5B5B',
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
  },
  groupIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#E7F2F1',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#040707',
    marginBottom: 4,
  },
  groupStats: {
    fontSize: 13,
    color: '#5B5B5B',
  },
  card: {
    marginBottom: 16,
  },
  cardContent: {
    padding: 40,
    alignItems: 'center',
  },
  comingSoon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b4a5a',
    marginBottom: 8,
  },
  comingSoonSubtitle: {
    fontSize: 14,
    color: '#5B5B5B',
    textAlign: 'center',
  },
});
