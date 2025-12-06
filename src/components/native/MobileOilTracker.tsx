import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { Progress } from './Progress';

interface MobileOilTrackerProps {
  language: string;
  navigation?: any;
}

const recentEntries = [
  { id: 1, dish: 'Dal Tadka', amount: 12, oil: 'Mustard Oil', time: '1:15 PM', verified: true },
  { id: 2, dish: 'Aloo Paratha', amount: 8, oil: 'Ghee', time: '8:30 AM', verified: true },
  { id: 3, dish: 'Vegetable Curry', amount: 10, oil: 'Sunflower Oil', time: 'Yesterday', verified: true },
];

const familyMembersList = ['Deepak', 'Aditya', 'Vasundhara', 'Rutuja', 'Jeet', 'Ankit'];

export function MobileOilTracker({ language, navigation }: MobileOilTrackerProps) {
  const [showLogEntry, setShowLogEntry] = useState(false);
  const [amount, setAmount] = useState('');
  const [oilType, setOilType] = useState('');
  const [dishName, setDishName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showMemberModal, setShowMemberModal] = useState(false);

  const todayTotal = 30;
  const todayTarget = 40;
  const percentage = (todayTotal / todayTarget) * 100;

  const toggleMember = (member: string) => {
    setSelectedMembers(prev =>
      prev.includes(member)
        ? prev.filter(m => m !== member)
        : [...prev, member]
    );
  };

  const handleLog = () => {
    if (!amount || !oilType || !dishName || !selectedMembers.length) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    Alert.alert('Success', 'Oil consumption logged successfully!');
    setAmount('');
    setOilType('');
    setDishName('');
    setSelectedMembers([]);
    setShowLogEntry(false);
  };

  const text = {
    en: {
      title: 'Oil Tracker',
      subtitle: 'Track your daily consumption',
      todayUsage: "Today's Usage",
      remaining: 'remaining',
      logButton: 'Log Oil Usage',
      logTitle: 'Log Consumption',
      dishLabel: 'Dish Prepared',
      dishPlaceholder: 'e.g., Aloo Paratha',
      oilLabel: 'Oil Type',
      oilPlaceholder: 'e.g., Mustard Oil',
      amountLabel: 'Amount (ml)',
      amountPlaceholder: 'e.g., 15',
      membersLabel: 'Family Members',
      selectMembers: 'Select Members',
      cancel: 'Cancel',
      save: 'Save Entry',
      recentEntries: 'Recent Entries',
      verified: 'Verified',
    },
    hi: {
      title: 'तेल ट्रैकर',
      subtitle: 'अपनी दैनिक खपत ट्रैक करें',
      todayUsage: 'आज का उपयोग',
      remaining: 'शेष',
      logButton: 'तेल उपयोग लॉग करें',
      logTitle: 'खपत लॉग करें',
      dishLabel: 'व्यंजन तैयार',
      dishPlaceholder: 'उदा., आलू पराठा',
      oilLabel: 'तेल प्रकार',
      oilPlaceholder: 'उदा., सरसों का तेल',
      amountLabel: 'मात्रा (मिली)',
      amountPlaceholder: 'उदा., 15',
      membersLabel: 'परिवार के सदस्य',
      selectMembers: 'सदस्य चुनें',
      cancel: 'रद्द करें',
      save: 'प्रविष्टि सहेजें',
      recentEntries: 'हाल की प्रविष्टियां',
      verified: 'सत्यापित',
    },
  };

  const t = text[language as keyof typeof text] || text.en;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#1b4a5a', '#0f3a47']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity 
            onPress={() => navigation?.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="water" size={24} color="#ffffff" />
            </View>
            <View>
              <Text style={styles.title}>{t.title}</Text>
              <Text style={styles.subtitle}>{t.subtitle}</Text>
            </View>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Today's Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressLabel}>{t.todayUsage}</Text>
          <View style={styles.progressValues}>
            <Text style={styles.progressCurrent}>{todayTotal}g</Text>
            <Text style={styles.progressTarget}>/ {todayTarget}g</Text>
          </View>
          <Progress value={percentage} style={styles.progressBar} />
          <Text style={styles.progressRemaining}>
            {todayTarget - todayTotal}g {t.remaining}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Log Button */}
        {!showLogEntry && (
          <Button
            onPress={() => setShowLogEntry(true)}
            style={styles.logButton}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="add" size={20} color="#ffffff" />
              <Text style={styles.logButtonText}>{t.logButton}</Text>
            </View>
          </Button>
        )}

        {/* Log Entry Form */}
        {showLogEntry && (
          <Card style={styles.logCard}>
            <CardContent style={styles.logContent}>
              <View style={styles.logHeader}>
                <Text style={styles.logTitle}>{t.logTitle}</Text>
                <TouchableOpacity onPress={() => setShowLogEntry(false)}>
                  <Ionicons name="close" size={24} color="#5B5B5B" />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t.dishLabel}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.dishPlaceholder}
                  value={dishName}
                  onChangeText={setDishName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t.oilLabel}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.oilPlaceholder}
                  value={oilType}
                  onChangeText={setOilType}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t.amountLabel}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.amountPlaceholder}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>{t.membersLabel}</Text>
                <TouchableOpacity
                  style={styles.memberSelector}
                  onPress={() => setShowMemberModal(true)}
                >
                  <Text style={styles.memberText}>
                    {selectedMembers.length > 0
                      ? selectedMembers.join(', ')
                      : t.selectMembers}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#5B5B5B" />
                </TouchableOpacity>
              </View>

              <View style={styles.buttonRow}>
                <Button
                  variant="outline"
                  onPress={() => setShowLogEntry(false)}
                  style={styles.cancelButton}
                >
                  {t.cancel}
                </Button>
                <Button onPress={handleLog} style={styles.saveButton}>
                  {t.save}
                </Button>
              </View>
            </CardContent>
          </Card>
        )}

        {/* Recent Entries */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.recentEntries}</Text>
          {recentEntries.map((entry) => (
            <Card key={entry.id} style={styles.entryCard}>
              <CardContent style={styles.entryContent}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryDish}>{entry.dish}</Text>
                  {entry.verified && (
                    <Badge variant="success">
                      <View style={styles.badgeContent}>
                        <Ionicons name="checkmark-circle" size={12} color="#16a34a" />
                        <Text style={styles.badgeText}>{t.verified}</Text>
                      </View>
                    </Badge>
                  )}
                </View>
                <View style={styles.entryDetails}>
                  <Text style={styles.entryDetail}>{entry.amount}ml • {entry.oil}</Text>
                  <Text style={styles.entryTime}>{entry.time}</Text>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Member Selection Modal */}
      <Modal
        visible={showMemberModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMemberModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.membersLabel}</Text>
            {familyMembersList.map((member) => (
              <TouchableOpacity
                key={member}
                style={styles.memberOption}
                onPress={() => toggleMember(member)}
              >
                <Text style={styles.memberName}>{member}</Text>
                {selectedMembers.includes(member) && (
                  <Ionicons name="checkmark" size={24} color="#07A996" />
                )}
              </TouchableOpacity>
            ))}
            <Button onPress={() => setShowMemberModal(false)} style={styles.doneButton}>
              Done
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfa',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
  },
  progressLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  progressValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 12,
  },
  progressCurrent: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  progressTarget: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressBar: {
    marginBottom: 8,
  },
  progressRemaining: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  logButton: {
    marginBottom: 20,
    backgroundColor: '#fcaf56',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  logCard: {
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ffffffff',
    backgroundColor: '#ffffffff',
  },
  logContent: {
    padding: 16,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#040707',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#5B5B5B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  memberSelector: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberText: {
    fontSize: 16,
    color: '#040707',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#040707',
    marginBottom: 12,
  },
  entryCard: {
    marginBottom: 12,
  },
  entryContent: {
    padding: 16,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryDish: {
    fontSize: 16,
    fontWeight: '600',
    color: '#040707',
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    color: '#16a34a',
  },
  entryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  entryDetail: {
    fontSize: 14,
    color: '#5B5B5B',
  },
  entryTime: {
    fontSize: 12,
    color: '#5B5B5B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#040707',
    marginBottom: 16,
  },
  memberOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E7F2F1',
  },
  memberName: {
    fontSize: 16,
    color: '#040707',
  },
  doneButton: {
    marginTop: 16,
  },
});
