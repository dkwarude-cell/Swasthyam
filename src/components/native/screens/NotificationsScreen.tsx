import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../Card';
import { Badge } from '../Badge';

interface NotificationsScreenProps {
  navigation: any;
}

const getIconName = (type: string): keyof typeof Ionicons.glyphMap => {
  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    'ai-tip': 'sparkles',
    'challenge': 'trophy',
    'recipe': 'restaurant',
    'milestone': 'heart',
    'group': 'people',
    'reminder': 'alert-circle',
  };
  return iconMap[type] || 'notifications';
};

const getGradientColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    'ai-tip': '#a855f7',
    'challenge': '#f97316',
    'recipe': '#16a34a',
    'milestone': '#3b82f6',
    'group': '#eab308',
    'reminder': '#6b7280',
  };
  return colorMap[type] || '#6b7280';
};

export function NotificationsScreen({ navigation }: NotificationsScreenProps) {
  const notifications = [
    {
      id: 1,
      type: 'ai-tip',
      title: 'New AI Tip Available',
      message: 'Try steaming vegetables instead of sautéing to reduce oil by 60%',
      time: '5 min ago',
      unread: true,
    },
    {
      id: 2,
      type: 'challenge',
      title: 'Challenge Update',
      message: "You're now #3 in the Family Cooking Quest! Keep going!",
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 3,
      type: 'recipe',
      title: 'New Recipe Recommendation',
      message: 'Air-Fried Paneer Tikka - 75% less oil than traditional recipe',
      time: '3 hours ago',
      unread: false,
    },
    {
      id: 4,
      type: 'milestone',
      title: 'Milestone Achieved!',
      message: "You've saved 2L of oil this month! That's ₹600 in savings",
      time: '1 day ago',
      unread: false,
    },
    {
      id: 5,
      type: 'group',
      title: 'Group Activity',
      message: 'Your family completed the weekly challenge! +500 points',
      time: '2 days ago',
      unread: false,
    },
    {
      id: 6,
      type: 'reminder',
      title: 'Daily Log Reminder',
      message: "Don't forget to log your oil usage for today",
      time: '3 days ago',
      unread: false,
    },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Notifications</Text>
              <Text style={styles.headerSubtitle}>{unreadCount} new updates</Text>
            </View>
          </View>
        </View>

        {/* Notifications List */}
        <View style={styles.content}>
          {notifications.map((notification) => (
            <Card 
              key={notification.id}
              style={[
                styles.notificationCard,
                notification.unread ? styles.notificationCardUnread : undefined
              ]}
            >
              <View style={styles.notificationContent}>
                <View style={[
                  styles.notificationIcon,
                  { backgroundColor: getGradientColor(notification.type) }
                ]}>
                  <Ionicons 
                    name={getIconName(notification.type)} 
                    size={24} 
                    color="#fff" 
                  />
                </View>
                <View style={styles.notificationText}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle} numberOfLines={1}>
                      {notification.title}
                    </Text>
                    {notification.unread && (
                      <Badge variant="success" style={styles.newBadge}>
                        <Text style={{color: '#16a34a', fontSize: 12}}>New</Text>
                      </Badge>
                    )}
                  </View>
                  <Text style={styles.notificationMessage} numberOfLines={2}>
                    {notification.message}
                  </Text>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Mark All as Read */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.markReadButton} activeOpacity={0.7}>
            <Text style={styles.markReadText}>Mark All as Read</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#dcfce7',
    marginTop: 2,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  notificationCard: {
    marginBottom: 0,
  },
  notificationCardUnread: {
    backgroundColor: '#f0fdf4',
  },
  notificationContent: {
    flexDirection: 'row',
    gap: 12,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    flex: 1,
    gap: 4,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  notificationTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  newBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  footer: {
    padding: 16,
    paddingTop: 8,
  },
  markReadButton: {
    backgroundColor: '#dcfce7',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  markReadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#15803d',
  },
});
