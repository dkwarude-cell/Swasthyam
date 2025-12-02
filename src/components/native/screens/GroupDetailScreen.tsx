import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Tabs, TabsList, TabsTrigger } from '../Tabs';

interface GroupDetailScreenProps {
  navigation: any;
  route: { params?: { groupName?: string } };
}

export function GroupDetailScreen({ navigation, route }: GroupDetailScreenProps) {
  const [selectedTab, setSelectedTab] = useState('questions');
  const groupName = route.params?.groupName || 'Cooking Community';

  const questions = [
    { id: 1, user: 'Meera Iyer', title: 'How to make crispy dosa with minimal oil?', answers: 12, upvotes: 45, hasExpert: true },
    { id: 2, user: 'Amit Patel', title: 'Best air fryer settings for samosas?', answers: 8, upvotes: 32, hasExpert: true },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{groupName}</Text>
            <Text style={styles.headerSubtitle}>342 members • 156 discussions</Text>
          </View>
          <Button onPress={() => {}} style={styles.joinButton}>Join</Button>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search questions..." placeholderTextColor="#9ca3af" />
        </View>
        <View style={styles.actions}>
          <Button onPress={() => {}} style={styles.askButton}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <Ionicons name="chatbubble-ellipses" size={16} color="#fff" />
              <Text style={{color: '#fff', fontSize: 14, fontWeight: '600'}}>Ask Question</Text>
            </View>
          </Button>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
        </Tabs>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
          {selectedTab === 'questions' && (
            <View style={styles.questionsList}>
              {questions.map(q => (
                <Card key={q.id} style={styles.questionCard}>
                  <Text style={styles.questionUser}>{q.user}</Text>
                  <Text style={styles.questionTitle}>{q.title}</Text>
                  <View style={styles.questionStats}>
                    <View style={styles.stat}>
                      <Ionicons name="chatbubble" size={14} color="#6b7280" />
                      <Text style={styles.statText}>{q.answers}</Text>
                    </View>
                    <View style={styles.stat}>
                      <Ionicons name="thumbs-up" size={14} color="#6b7280" />
                      <Text style={styles.statText}>{q.upvotes}</Text>
                    </View>
                    {q.hasExpert && (
                      <Badge variant="warning" style={styles.expertBadge}><Text style={{color: '#eab308', fontSize: 12}}>Expert Answer</Text></Badge>
                    )}
                  </View>
                </Card>
              ))}
            </View>
          )}
          {selectedTab === 'insights' && (
            <View style={styles.insightsContent}>
              <Card style={styles.insightCard}>
                <Text style={styles.insightText}>Expert insights coming soon...</Text>
              </Card>
            </View>
          )}
          {selectedTab === 'about' && (
            <View style={styles.aboutContent}>
              <Card>
                <Text style={styles.aboutTitle}>About This Group</Text>
                <Text style={styles.aboutText}>Welcome to {groupName}! This is a community dedicated to sharing and learning about low-oil cooking techniques.</Text>
              </Card>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafbfa' },
  header: { backgroundColor: '#1b4a5a', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, gap: 12 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton: { width: 32, height: 32, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  joinButton: { paddingHorizontal: 16, paddingVertical: 6, backgroundColor: '#fcaf56' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, height: 40 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#111827' },
  actions: { flexDirection: 'row', gap: 8 },
  askButton: { flex: 1 },
  filterButton: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, padding: 16 },
  tabContent: { flex: 1, marginTop: 16 },
  questionsList: { gap: 12 },
  questionCard: { marginBottom: 0 },
  questionUser: { fontSize: 14, fontWeight: '600', color: '#1b4a5a', marginBottom: 8 },
  questionTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 12 },
  questionStats: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 14, color: '#6b7280' },
  expertBadge: { marginLeft: 'auto' },
  insightsContent: { gap: 12 },
  insightCard: { alignItems: 'center', padding: 24 },
  insightText: { fontSize: 14, color: '#6b7280' },
  aboutContent: { gap: 12 },
  aboutTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 },
  aboutText: { fontSize: 14, color: '#6b7280', lineHeight: 20 },
});
