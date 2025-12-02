import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Card, CardContent } from './Card';
import { Badge } from './Badge';
import { Progress } from './Progress';
import Svg, { Path, Circle, Line, Text as SvgText, G, Defs, LinearGradient, Stop } from 'react-native-svg';

interface MobileHomeProps {
  language: string;
}

const { width } = Dimensions.get('window');

export function MobileHome({ language }: MobileHomeProps) {
  const navigation = useNavigation<any>();
  const [selectedDate, setSelectedDate] = useState(15);
  const [hasNotification, setHasNotification] = useState(true);

  const userName = "Priya";
  const currentDate = "29 November, 2025";
  const healthRiskLevel = 25;

  const weekDates = [
    { day: 'Mon', date: 12 },
    { day: 'Tue', date: 13 },
    { day: 'Wed', date: 14 },
    { day: 'Thu', date: 15 },
    { day: 'Fri', date: 16 },
    { day: 'Sat', date: 17 },
    { day: 'Sun', date: 18 },
  ];

  const dailyConsumption = 48; // ml
  const dailyLimit = 50; // ml

  // Chart data points for daily oil consumption
  const chartData = [
    { time: '8am', value: 7 },
    { time: '10am', value: 9 },
    { time: '12pm', value: 16 },
    { time: '2pm', value: 11 },
    { time: '4pm', value: 3 },
    { time: '6pm', value: 1 },
  ];

  const text = {
    en: {
      welcome: 'Welcome',
      today: 'Today',
      oilConsumption: 'Oil Consumption',
      dailyOilConsumption: 'Daily Oil Consumption',
      dailyLimit: 'Daily Limit',
      healthRisk: 'Health Risk Level',
      lowRisk: 'Low Risk',
      scanFood: 'Scan Food',
      quickActions: 'Quick Actions',
      oilTracker: 'Oil Tracker',
      recipes: 'Recipes',
      challenges: 'Challenges',
      education: 'Education',
      savesOil: 'Saves oil',
      servings: 'servings',
    },
    hi: {
      welcome: 'स्वागत है',
      today: 'आज',
      oilConsumption: 'तेल की खपत',
      dailyOilConsumption: 'दैनिक तेल की खपत',
      dailyLimit: 'दैनिक सीमा',
      healthRisk: 'स्वास्थ्य जोखिम स्तर',
      lowRisk: 'कम जोखिम',
      scanFood: 'भोजन स्कैन करें',
      quickActions: 'त्वरित कार्रवाई',
      oilTracker: 'तेल ट्रैकर',
      recipes: 'व्यंजन',
      challenges: 'चुनौतियां',
      education: 'शिक्षा',
      savesOil: 'तेल बचाता है',
      servings: 'सर्विंग्स',
    },
  };

  const t = text[language as keyof typeof text] || text.en;

  const handleScanFood = () => {
    console.log('Open camera for food scanning');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Daily Oil Consumption Chart Section */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>{t.dailyOilConsumption}</Text>
        
        <View style={styles.chartContainer}>
          {/* Chart */}
          <View style={styles.chartWrapper}>
            <Svg width={width * 0.65} height={150} viewBox="0 0 280 140">
              {/* Grid lines */}
              <Line x1="20" y1="20" x2="20" y2="110" stroke="#3d6b7a" strokeWidth="1" strokeDasharray="2,2" />
              <Line x1="20" y1="110" x2="270" y2="110" stroke="#3d6b7a" strokeWidth="1" />
              
              {/* Y-axis labels */}
              <SvgText x="15" y="25" fill="#7fb5c5" fontSize="10" textAnchor="end">16</SvgText>
              <SvgText x="15" y="65" fill="#7fb5c5" fontSize="10" textAnchor="end">8</SvgText>
              <SvgText x="15" y="110" fill="#7fb5c5" fontSize="10" textAnchor="end">0</SvgText>
              
              {/* Dotted rectangle (safe zone) */}
              <Path
                d="M25,35 L260,35 L260,75 L25,75 Z"
                fill="none"
                stroke="#3d6b7a"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              
              {/* Line chart path - extended with 8pm and 10pm */}
              <Path
                d="M25,75 L55,65 L85,20 L115,50 L145,95 L175,100 L205,102 L235,105"
                fill="none"
                stroke="#f5a623"
                strokeWidth="2.5"
              />
              
              {/* Data points */}
              <Circle cx="25" cy="75" r="4" fill="#f5a623" />
              <Circle cx="55" cy="65" r="4" fill="#f5a623" />
              <Circle cx="85" cy="20" r="4" fill="#f5a623" />
              <Circle cx="115" cy="50" r="4" fill="#f5a623" />
              <Circle cx="145" cy="95" r="4" fill="#f5a623" />
              <Circle cx="175" cy="100" r="4" fill="#f5a623" />
              <Circle cx="205" cy="102" r="4" fill="#f5a623" />
              <Circle cx="235" cy="105" r="4" fill="#f5a623" />
              
              {/* X-axis labels */}
              <SvgText x="25" y="125" fill="#7fb5c5" fontSize="8" textAnchor="middle">8am</SvgText>
              <SvgText x="55" y="125" fill="#7fb5c5" fontSize="8" textAnchor="middle">10am</SvgText>
              <SvgText x="85" y="125" fill="#7fb5c5" fontSize="8" textAnchor="middle">12pm</SvgText>
              <SvgText x="115" y="125" fill="#7fb5c5" fontSize="8" textAnchor="middle">2pm</SvgText>
              <SvgText x="145" y="125" fill="#7fb5c5" fontSize="8" textAnchor="middle">4pm</SvgText>
              <SvgText x="175" y="125" fill="#7fb5c5" fontSize="8" textAnchor="middle">6pm</SvgText>
              <SvgText x="205" y="125" fill="#7fb5c5" fontSize="8" textAnchor="middle">8pm</SvgText>
              <SvgText x="235" y="125" fill="#7fb5c5" fontSize="8" textAnchor="middle">10pm</SvgText>
            </Svg>
          </View>
          
          {/* Super Nani Character */}
          <View style={styles.naniContainer}>
            <Image
              source={require('../../assets/mascot_home.png')}
              style={styles.naniImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      {/* Info Card with Calendar */}
      <View style={styles.infoCard}>
        <View style={styles.infoLeft}>
          <Text style={styles.infoText}>{t.savesOil} • 8 {t.servings}</Text>
        </View>
        <View style={styles.infoRight}>
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={16} color="#1b4a5a" />
          </TouchableOpacity>
          <Text style={styles.monthText}>November 2025</Text>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={16} color="#1b4a5a" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Week Calendar */}
      <View style={styles.calendarCard}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarContent}
        >
          {weekDates.map((item) => (
            <TouchableOpacity
              key={item.date}
              style={[
                styles.dateCard,
                selectedDate === item.date && styles.dateCardActive,
              ]}
              onPress={() => setSelectedDate(item.date)}
            >
              <Text
                style={[
                  styles.dayText,
                  selectedDate === item.date && styles.dayTextActive,
                ]}
              >
                {item.day}
              </Text>
              <Text
                style={[
                  styles.dateNumber,
                  selectedDate === item.date && styles.dateNumberActive,
                ]}
              >
                {item.date}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Oil Consumption Card */}
      <Card style={styles.card}>
        <CardContent style={styles.cardContent}>
          <View style={styles.consumptionHeader}>
            <Ionicons name="water" size={24} color="#1b4a5a" />
            <Text style={styles.cardTitle}>{t.oilConsumption}</Text>
          </View>
          
          <View style={styles.consumptionStats}>
            <Text style={styles.consumptionValue}>{dailyConsumption} ml</Text>
            <Text style={styles.consumptionLimit}>/ {dailyLimit} ml</Text>
          </View>

          <Progress
            value={(dailyConsumption / dailyLimit) * 100}
            style={styles.progress}
          />

          <View style={styles.riskContainer}>
            <Text style={styles.riskLabel}>{t.healthRisk}</Text>
            <Badge variant="success" style={styles.riskBadge}>
              {t.lowRisk} ({healthRiskLevel}%)
            </Badge>
          </View>
        </CardContent>
      </Card>

      {/* Scan Food Button */}
      <TouchableOpacity style={styles.scanButton} onPress={handleScanFood}>
        <Ionicons name="camera" size={24} color="#ffffff" />
        <Text style={styles.scanButtonText}>{t.scanFood}</Text>
      </TouchableOpacity>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>{t.quickActions}</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('OilTracker')}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="analytics" size={28} color="#1b4a5a" />
          </View>
          <Text style={styles.actionText}>{t.oilTracker}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Recipes')}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="restaurant" size={28} color="#1b4a5a" />
          </View>
          <Text style={styles.actionText}>{t.recipes}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Challenges')}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="trophy" size={28} color="#1b4a5a" />
          </View>
          <Text style={styles.actionText}>{t.challenges}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Education')}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="book" size={28} color="#1b4a5a" />
          </View>
          <Text style={styles.actionText}>{t.education}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#040707',
  },
  dateText: {
    fontSize: 14,
    color: '#5B5B5B',
    marginTop: 4,
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    backgroundColor: '#FF6B6B',
    borderRadius: 5,
  },
  calendar: {
    marginVertical: 16,
  },
  calendarContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  dateCard: {
    width: 60,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    marginRight: 8,
  },
  dateCardActive: {
    backgroundColor: '#1b4a5a',
  },
  dayText: {
    fontSize: 12,
    color: '#5B5B5B',
    marginBottom: 4,
  },
  dayTextActive: {
    color: '#ffffff',
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#040707',
  },
  dateNumberActive: {
    color: '#ffffff',
  },
  card: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  cardContent: {
    padding: 20,
  },
  consumptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#040707',
    marginLeft: 8,
  },
  consumptionStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  consumptionValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1b4a5a',
  },
  consumptionLimit: {
    fontSize: 18,
    color: '#5B5B5B',
    marginLeft: 4,
  },
  progress: {
    marginBottom: 16,
  },
  riskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskLabel: {
    fontSize: 14,
    color: '#5B5B5B',
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#07A996',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#040707',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    width: (width - 52) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  actionIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#E7F2F1',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#040707',
    textAlign: 'center',
  },
  // Chart Section Styles
  chartSection: {
    backgroundColor: '#1b4a5a',
    paddingTop: 10,
    paddingLeft: -10,
    paddingRight: 10,
    paddingBottom: 30,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: -15,
    paddingLeft: 30,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  chartWrapper: {
    width: '65%',
    marginLeft: -10,
  },
  naniContainer: {
    width: '35%',
    height: 190,
    marginLeft: -10,
    marginBottom: 5,
  },
  naniImage: {
    width: '110%',
    height: '110%',
  },
  // Info Card Styles
  infoCard: {
    backgroundColor: '#c8dde3',
    marginHorizontal: 20,
    marginTop: -25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLeft: {
    flex: 1,
  },
  infoText: {
    fontSize: 15,
    color: '#1b4a5a',
    fontWeight: '500',
  },
  infoRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  monthText: {
    fontSize: 14,
    color: '#1b4a5a',
    fontWeight: '600',
  },
  // Calendar Card Styles
  calendarCard: {
    backgroundColor: '#c8dde3',
    marginHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
});
