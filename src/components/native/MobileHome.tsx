import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
  Animated,
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

  // Speech bubble text animation
  const speechText = "Good job, Priya! You've stayed within your oil limit today";
  const scrollX = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const animateText = () => {
      scrollX.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.delay(2000),
          Animated.timing(scrollX, {
            toValue: -100,
            duration: 5000,
            useNativeDriver: true,
          }),
          Animated.delay(1000),
          Animated.timing(scrollX, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    animateText();
  }, []);

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
      todaysOilUsage: "Today's Oil Usage",
      oilConsumption: 'Oil Consumption',
      dailyOilConsumption: 'Daily Oil Consumption',
      dailyLimit: 'Daily Limit',
      healthRisk: 'Health Risk Level',
      healthRiskLevel: 'Health Risk Level',
      lowRisk: 'Low Risk',
      scanFood: 'Scan Food',
      oilMonitoring: 'Oil Monitoring',
      logOil: 'Log Oil',
      trackYourUsage: 'Track your usage',
      oilScan: 'Oil Scan',
      scanMealOrProduct: 'Scan meal or product',
      nationalCampaign: 'National Campaign',
      viewAll: 'View All',
      official: 'Official',
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
      todaysOilUsage: 'आज का तेल उपयोग',
      oilConsumption: 'तेल की खपत',
      dailyOilConsumption: 'दैनिक तेल की खपत',
      dailyLimit: 'दैनिक सीमा',
      healthRisk: 'स्वास्थ्य जोखिम स्तर',
      healthRiskLevel: 'स्वास्थ्य जोखिम स्तर',
      lowRisk: 'कम जोखिम',
      scanFood: 'भोजन स्कैन करें',
      oilMonitoring: 'तेल निगरानी',
      logOil: 'तेल लॉग करें',
      trackYourUsage: 'अपना उपयोग ट्रैक करें',
      oilScan: 'तेल स्कैन',
      scanMealOrProduct: 'भोजन या उत्पाद स्कैन करें',
      nationalCampaign: 'राष्ट्रीय अभियान',
      viewAll: 'सभी देखें',
      official: 'आधिकारिक',
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Daily Oil Consumption Chart Section */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>{t.dailyOilConsumption}</Text>
        
        <View style={styles.chartContainer}>
          {/* Chart */}
          <View style={styles.chartWrapper}>
            <Svg width={width * 0.58} height={150} viewBox="0 0 280 90">
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
            <View style={styles.naniBox}>
              <Image
                source={require('../../assets/mascot_home.png')}
                style={styles.naniImage}
                resizeMode="contain"
              />
            </View>
          </View>
          
          {/* Speech Bubble - Absolute positioned */}
          <View style={styles.naniSpeechBubble}>
            <View style={styles.naniSpeechTextContainer}>
              <Animated.Text 
                style={[
                  styles.naniSpeechText,
                  { transform: [{ translateX: scrollX }] }
                ]}
                numberOfLines={1}
              >
                {speechText}
              </Animated.Text>
            </View>
            <View style={styles.naniSpeechArrow} />
          </View>
        </View>
      {/* Combined Calendar Container */}
      <View style={styles.calendarContainer}>
        {/* Info Card with Calendar */}
        <View style={styles.infoCard}>
          <View style={styles.infoLeft}>
            <Text style={styles.infoText}>{t.savesOil} • 8 {t.servings}</Text>
          </View>
          <View style={styles.infoRight}>
            <TouchableOpacity>
              <Ionicons name="chevron-back" size={16} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.monthText}>November 2025</Text>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={16} color="#ffffff" />
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
      </View>
      </View>


      {/* Today's Oil Usage Card with Action Buttons */}
      <View style={styles.usageCardWrapper}>
        <View style={styles.usageCard}>
          <View style={styles.usageHeader}>
            <Text style={styles.usageTitle}>{t.todaysOilUsage}</Text>
            <Text style={styles.usageValue}>{dailyConsumption}ml / {dailyLimit}ml</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${(dailyConsumption / dailyLimit) * 100}%` }]} />
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="search" size={22} color="#1b4a5a" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="notifications" size={22} color="#1b4a5a" />
            {hasNotification && <View style={styles.notificationBadge} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Health Risk Level Card */}
      <View style={styles.riskCard}>
        <Text style={styles.riskTitle}>{t.healthRiskLevel}</Text>
        <View style={styles.riskProgressContainer}>
          <Svg width="100%" height={10} style={styles.riskProgressBar}>
            <Defs>
              <LinearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#7ed321" />
                <Stop offset="50%" stopColor="#f5a623" />
                <Stop offset="100%" stopColor="#ff6b6b" />
              </LinearGradient>
            </Defs>
            {/* Background bar */}
            <Path
              d={`M5,0 L${width - 85},0 Q${width - 80},0 ${width - 80},5 L${width - 80},5 Q${width - 80},10 ${width - 85},10 L5,10 Q0,10 0,5 L0,5 Q0,0 5,0 Z`}
              fill="#e8e8e8"
            />
            {/* Gradient fill */}
            <Path
              d={`M5,0 L${((width - 80) * healthRiskLevel) / 100 - 5},0 Q${((width - 80) * healthRiskLevel) / 100},0 ${((width - 80) * healthRiskLevel) / 100},5 L${((width - 80) * healthRiskLevel) / 100},5 Q${((width - 80) * healthRiskLevel) / 100},10 ${((width - 80) * healthRiskLevel) / 100 - 5},10 L5,10 Q0,10 0,5 L0,5 Q0,0 5,0 Z`}
              fill="url(#riskGradient)"
            />
          </Svg>
        </View>
      </View>

      {/* Oil Monitoring Section */}
      <View style={styles.monitoringSection}>
        <View style={styles.monitoringHeader}>
          <Text style={styles.monitoringTitle}>{t.oilMonitoring}</Text>
          <View style={styles.monitoringIcons}>
            <TouchableOpacity>
              <Ionicons name="shuffle" size={20} color="#1b4a5a" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={20} color="#1b4a5a" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.monitoringCards}>
          {/* Log Oil Card */}
          <TouchableOpacity style={styles.monitoringCard} onPress={handleScanFood}>
            <View style={styles.monitoringIconContainer}>
              <Ionicons name="add" size={32} color="#ffffff" />
            </View>
            <Text style={styles.monitoringCardTitle}>{t.logOil}</Text>
            <Text style={styles.monitoringCardSubtitle}>{t.trackYourUsage}</Text>
          </TouchableOpacity>
          
          {/* Oil Scan Card */}
          <TouchableOpacity style={styles.monitoringCard} onPress={handleScanFood}>
            <View style={[styles.monitoringIconContainer, styles.cameraIconContainer]}>
              <Ionicons name="camera" size={28} color="#07A996" />
            </View>
            <Text style={styles.monitoringCardTitle}>{t.oilScan}</Text>
            <Text style={styles.monitoringCardSubtitle}>{t.scanMealOrProduct}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* National Campaign */}
      <View style={styles.campaignSection}>
        <View style={styles.campaignHeader}>
          <Text style={styles.campaignTitle}>{t.nationalCampaign}</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>{t.viewAll}</Text>
            <Ionicons name="chevron-forward" size={16} color="#07A996" />
          </TouchableOpacity>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.campaignCarousel}
        >
          {/* Campaign Card 1 - Mann ki Baat */}
          <TouchableOpacity style={styles.campaignCard}>
            <Image
              source={require('../../assets/carousel1.png')}
              style={styles.campaignImage}
              resizeMode="cover"
            />
            <View style={styles.campaignOverlay}>
              <View style={styles.officialBadge}>
                <Text style={styles.officialText}>{t.official}</Text>
              </View>
              <View style={styles.campaignContent}>
                <Text style={styles.campaignCardTitle}>Mann ki Baat</Text>
                <Text style={styles.campaignCardSubtitle}>PM Modi's Health Message - 23 Feb, 2025</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          {/* Campaign Card 2 - Placeholder */}
          <TouchableOpacity style={styles.campaignCard}>
            <Image
              source={require('../../assets/carousel2.png')}
              style={styles.campaignImage}
              resizeMode="cover"
            />
            <View style={styles.campaignOverlay}>
              <View style={styles.officialBadge}>
                <Text style={styles.officialText}>{t.official}</Text>
              </View>
              <View style={styles.campaignContent}>
                <Text style={styles.campaignCardTitle}>Cutting Edge</Text>
                <Text style={styles.campaignCardSubtitle}>PM Modi's Oil Consumption Initiative</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          {/* Campaign Card 3 - Placeholder */}
          <TouchableOpacity style={styles.campaignCard}>
            <Image
              source={require('../../assets/carousel3.png')}
              style={styles.campaignImage}
              resizeMode="cover"
            />
            <View style={styles.campaignOverlay}>
              <View style={styles.officialBadge}>
                <Text style={styles.officialText}>{t.official}</Text>
              </View>
              <View style={styles.campaignContent}>
                <Text style={styles.campaignCardTitle}>Health India</Text>
                <Text style={styles.campaignCardSubtitle}>National Health Campaign 2025</Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1b4a5a',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
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
    //backgroundColor: '#000000ff',
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
    paddingHorizontal: 10,
    gap: 0,
  },
  dateCard: {
    width: 58,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    marginRight: 8,
  },
  dateCardActive: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
  },
  dayText: {
    fontSize: 12,
    color: '#ffffff',
    marginBottom: 4,
    fontWeight: '500',
  },
  dayTextActive: {
    color: '#07A996',
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  dateNumberActive: {
    color: '#07A996',
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
  // Oil Monitoring Section Styles
  monitoringSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  monitoringHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monitoringTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#040707',
  },
  monitoringIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  monitoringCards: {
    flexDirection: 'row',
    gap: 12,
  },
  monitoringCard: {
    flex: 1,
    backgroundColor: '#1b4a5a',
    borderRadius: 20,
    padding: 20,
    minHeight: 180,
  },
  monitoringIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cameraIconContainer: {
    backgroundColor: '#ffffff',
  },
  monitoringCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  monitoringCardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  // National Campaign Styles
  campaignSection: {
    marginBottom: 24,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  campaignTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#040707',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#07A996',
    fontWeight: '600',
  },
  campaignCarousel: {
    paddingLeft: 20,
    paddingRight: 20,
    gap: 16,
  },
  campaignCard: {
    width: width * 0.75,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1b4a5a',
  },
  campaignImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  campaignOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
    justifyContent: 'space-between',
  },
  officialBadge: {
    alignSelf: 'flex-end',
    backgroundColor: '#07A996',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  officialText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  campaignContent: {
    gap: 4,
  },
  campaignCardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  campaignCardSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  // Chart Section Styles
  chartSection: {
    backgroundColor: '#1b4a5a',
    paddingTop: 5,
    paddingLeft: 0,
    paddingRight: 10,
    paddingBottom: 5,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: -10,
    paddingLeft: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: width * 0.025,
    paddingRight: width * 0.05,
    minHeight: 150,
    position: 'relative',
  },
  chartWrapper: {
    flex: 0.6,
  },
  naniContainer: {
    flex: 0.4,
    height: 160,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginRight: 0,
    marginTop: -10,
  },
  naniSpeechBubble: {
    position: 'absolute',
    right: width * 0.35,
    top: 20,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.25,
    zIndex: 100,
    overflow: 'hidden',
  },
  naniSpeechTextContainer: {
    overflow: 'hidden',
  },
  naniSpeechText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#1b4a5a',
    textAlign: 'left',
    width: 200,
  },
  naniSpeechArrow: {
    position: 'absolute',
    right: -6,
    top: '50%',
    marginTop: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: '#ffffff',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  naniBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 5,
    width: width * 0.35,
    maxWidth: 140,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  naniImage: {
    width: width * 0.38,
    maxWidth: 150,
    height: 150,
  },
  // Calendar Container Styles
  calendarContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 20,
    marginTop: 0,
    borderRadius: 20,
    marginBottom: 15,
  },
  // Info Card Styles
  infoCard: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(27, 74, 90, 0.6)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  infoLeft: {
    flex: 1,
  },
  infoText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
  },
  infoRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  monthText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  // Calendar Card Styles
  calendarCard: {
    paddingVertical: 10,
    paddingHorizontal: 8,

  },
  // Usage Card Styles
  usageCardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 16,
    gap: 12,
  },
  usageCard: {
    flex: 1,
    backgroundColor: '#fef5e7',
    padding: 20,
    borderRadius: 20,
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#040707',
  },
  usageValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#040707',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#f5a623',
    borderRadius: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 48,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: '#ff6b6b',
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  // Risk Card Styles
  riskCard: {
    backgroundColor: '#fef5e7',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#040707',
    marginBottom: 12,
  },
  riskProgressContainer: {
    position: 'relative',
  },
  riskProgressBar: {
    borderRadius: 10,
  },
});
