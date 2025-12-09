import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Card, CardContent } from './Card';
import { Badge } from './Badge';
import { Progress } from './Progress';
import Svg, { Path, Circle, Line, Text as SvgText, G, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import apiService from '../../services/api';
import { t } from '../../i18n';

interface MobileHomeProps {
  language?: string;
}

const { width } = Dimensions.get('window');

export function MobileHome({ language = 'en' }: MobileHomeProps) {
  const navigation = useNavigation<any>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekOffset, setWeekOffset] = useState(0);
  const [hasNotification, setHasNotification] = useState(true);

  // Speech bubble text animation
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

  const weekDates = useMemo(() => {
    const today = new Date();
    const base = new Date(today);
    base.setDate(today.getDate() + weekOffset * 7);
    // Start week on Sunday
    const startOfWeek = new Date(base);
    const day = base.getDay();
    // Sunday = 0, so no offset needed. For other days, go back to Sunday
    const diff = -day;
    startOfWeek.setDate(base.getDate() + diff);

    // Map language codes to locale strings
    const localeMap: Record<string, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      mr: 'mr-IN',
      or: 'or-IN',
    };
    const locale = localeMap[language] || 'en-US';

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return {
        day: d.toLocaleDateString(locale, { weekday: 'short' }),
        date: d.getDate(),
        fullDate: d,
      };
    });
  }, [weekOffset]);

  useEffect(() => {
    // When changing week, default select the first day of that week
    if (weekDates.length > 0) {
      setSelectedDate(weekDates[0].fullDate);
    }
  }, [weekDates]);

  const [dailyConsumption, setDailyConsumption] = useState(0); // ml
  const [dailyLimit, setDailyLimit] = useState(40); // ml fallback
  const [dailyLimitCal, setDailyLimitCal] = useState(360); // cal fallback
  const [weeklyData, setWeeklyData] = useState<Array<{ date: string; calories: number }>>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDayCalories, setSelectedDayCalories] = useState(0);
  
  // Progress tracking state
  const [totalOilSaved, setTotalOilSaved] = useState(0);
  const [avgDailyReduction, setAvgDailyReduction] = useState(0);
  const [beforeAvg, setBeforeAvg] = useState(0);
  const [currentAvg, setCurrentAvg] = useState(0);

  // Calculate consumption percentage and determine mascot state
  // Check if selected day exceeded limit
  const isOverLimit = selectedDayCalories > dailyLimitCal;
  const mascotImage = isOverLimit 
    ? require('../../assets/Angry.png')
    : require('../../assets/mascot_home.png');
  
  const speechText = isOverLimit
    ? `Oh no! You consumed ${Math.round(selectedDayCalories)}cal on this day. That's over your ${dailyLimitCal}cal limit!`
    : selectedDayCalories > 0 
      ? `Great job! You stayed within your limit on this day with ${Math.round(selectedDayCalories)}cal`
      : "Select a day to see your oil consumption";

  const fetchDaily = async () => {
    try {
      const dateOnly = selectedDate.toISOString().split('T')[0];
      
      // Fetch personalized oil status
      const statusRes = await apiService.getUserOilStatus(dateOnly);
      if (statusRes.success && statusRes.data) {
        setDailyLimit(statusRes.data.goalMl || 40);
        // Use old formula for limit: goalMl * 9
        const limitCal = Math.round((statusRes.data.goalMl || 40) * 9);
        setDailyLimitCal(limitCal);
      }
      
      // Fetch today's consumption
      const res = await apiService.getTodayOilConsumption(dateOnly);
      const dailyTotal = (res.success && res.data) ? res.data.dailyTotal : 0;
      setDailyConsumption(dailyTotal);
      
      // Calculate calories for the selected day
      const calories = Math.round(dailyTotal * 9 * (6.25 / 100));
      setSelectedDayCalories(calories);
    } catch (e) {
      console.log('Failed to load daily oil', e);
      setDailyConsumption(0);
      setSelectedDayCalories(0);
    }
  };
  
  const fetchWeeklyData = async () => {
    try {
      const data: Array<{ date: string; calories: number }> = [];
      const today = new Date();
      
      // Get current day of week (0 = Sunday, 6 = Saturday)
      const currentDay = today.getDay();
      
      // Calculate Sunday of current week
      const sunday = new Date(today);
      sunday.setDate(today.getDate() - currentDay);
      
      // Fetch data from Sunday to Saturday (current week)
      for (let i = 0; i < 7; i++) {
        const date = new Date(sunday);
        date.setDate(sunday.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        const res = await apiService.getTodayOilConsumption(dateStr);
        const calories = res.success && res.data ? Math.round((res.data.dailyTotal || 0) * 9 * (6.25 / 100)) : 0;
        
        data.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          calories
        });
      }
      
      setWeeklyData(data);
    } catch (e) {
      console.log('Failed to load weekly data', e);
    }
  };

  const fetch30DayProgress = async () => {
    try {
      const today = new Date();
      let total30Days = 0;
      let total15DaysAgo = 0;
      let totalRecent15Days = 0;
      
      // Fetch last 30 days data
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const res = await apiService.getTodayOilConsumption(dateStr);
        const ml = res.success && res.data ? res.data.dailyTotal : 0;
        
        total30Days += ml;
        
        // First 15 days (15-30 days ago)
        if (i >= 15) {
          total15DaysAgo += ml;
        }
        // Recent 15 days (0-15 days ago)
        if (i < 15) {
          totalRecent15Days += ml;
        }
      }
      
      const avg15DaysAgo = total15DaysAgo / 15;
      const avgRecent15Days = totalRecent15Days / 15;
      const saved = total15DaysAgo - totalRecent15Days;
      const dailyReduction = avg15DaysAgo - avgRecent15Days;
      
      setTotalOilSaved(Math.round(saved));
      setAvgDailyReduction(Math.round(dailyReduction));
      setBeforeAvg(Math.round(avg15DaysAgo));
      setCurrentAvg(Math.round(avgRecent15Days));
    } catch (e) {
      console.log('Failed to load 30-day progress', e);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Clear data first to force re-render
    setWeeklyData([]);
    setDailyConsumption(0);
    // Then fetch new data
    await Promise.all([fetchDaily(), fetchWeeklyData(), fetch30DayProgress()]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDaily();
  }, [selectedDate]);
  
  // Fetch weekly consumption data (Sunday to Saturday)
  useEffect(() => {
    fetchWeeklyData();
    fetch30DayProgress();
  }, []);

  // Chart data points for daily oil consumption
  const chartData = [
    { time: '8am', value: 7 },
    { time: '10am', value: 9 },
    { time: '12pm', value: 16 },
    { time: '2pm', value: 11 },
    { time: '4pm', value: 3 },
    { time: '6pm', value: 1 },
  ];



  const handleScanFood = () => {
    navigation.navigate('BarcodeScanner');
  };

  const handleLogOil = () => {
    navigation.navigate('OilTracker', { targetDate: selectedDate.toISOString() });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#07A996']}
            tintColor="#07A996"
            title="Pull to refresh"
            titleColor="#5B5B5B"
          />
        }
      >
      {/* Daily Oil Consumption Chart Section */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>{t('home.weeklyOilConsumption')}</Text>
        
        <View style={styles.chartContainer}>
          {/* Chart */}
          <View style={styles.chartWrapper}>
            <Svg 
              key={`chart-${weeklyData.length}-${weeklyData.map(d => d.calories).join('-')}`}
              width={width * 0.58} 
              height={160} 
              viewBox="0 0 300 130"
            >
              <Defs>
                {/* Gradient for line */}
                <SvgLinearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#fcaf56" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#f5a623" stopOpacity="1" />
                </SvgLinearGradient>
                {/* Gradient for area under line */}
                <SvgLinearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#fcaf56" stopOpacity="0.3" />
                  <Stop offset="100%" stopColor="#fcaf56" stopOpacity="0.05" />
                </SvgLinearGradient>
              </Defs>
              
              {/* Horizontal grid lines */}
              <Line x1="30" y1="20" x2="280" y2="20" stroke="#e0e0e0" strokeWidth="0.5" opacity="0.5" />
              <Line x1="30" y1="50" x2="280" y2="50" stroke="#e0e0e0" strokeWidth="0.5" opacity="0.5" />
              <Line x1="30" y1="80" x2="280" y2="80" stroke="#e0e0e0" strokeWidth="0.5" opacity="0.5" />
              <Line x1="30" y1="110" x2="280" y2="110" stroke="#3d6b7a" strokeWidth="1.5" />
              
              {/* Y-axis */}
              <Line x1="30" y1="20" x2="30" y2="110" stroke="#3d6b7a" strokeWidth="1.5" />
              
              {/* Y-axis labels */}
              <SvgText x="25" y="25" fill="#5B5B5B" fontSize="10" fontWeight="600" textAnchor="end">{dailyLimitCal}</SvgText>
              <SvgText x="25" y="55" fill="#5B5B5B" fontSize="10" fontWeight="500" textAnchor="end">{Math.round(dailyLimitCal * 0.67)}</SvgText>
              <SvgText x="25" y="85" fill="#5B5B5B" fontSize="10" fontWeight="500" textAnchor="end">{Math.round(dailyLimitCal * 0.33)}</SvgText>
              <SvgText x="25" y="113" fill="#5B5B5B" fontSize="10" fontWeight="600" textAnchor="end">0</SvgText>
              
              {/* Safe zone indicator */}
              <Path
                d="M30,20 L280,20 L280,65 L30,65 Z"
                fill="rgba(220, 252, 231, 0.3)"
                stroke="#16a34a"
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.5"
              />
              
              {/* Chart data */}
              {weeklyData.length > 0 && (
                <>
                  {/* Area under the line */}
                  <Path
                    d={`M30,110 ${weeklyData.map((point, i) => {
                      const x = 30 + (i * 250 / 6);
                      const maxCal = dailyLimitCal * 1.2;
                      const y = 110 - ((point.calories / maxCal) * 90);
                      return `L${x},${Math.max(20, Math.min(110, y))}`;
                    }).join(' ')} L${30 + (6 * 250 / 6)},110 Z`}
                    fill="url(#areaGradient)"
                  />
                  
                  {/* Line chart path */}
                  <Path
                    d={weeklyData.map((point, i) => {
                      const x = 30 + (i * 250 / 6);
                      const maxCal = dailyLimitCal * 1.2;
                      const y = 110 - ((point.calories / maxCal) * 90);
                      return `${i === 0 ? 'M' : 'L'}${x},${Math.max(20, Math.min(110, y))}`;
                    }).join(' ')}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Data points with glow effect */}
                  {weeklyData.map((point, i) => {
                    const x = 30 + (i * 250 / 6);
                    const maxCal = dailyLimitCal * 1.2;
                    const y = 110 - ((point.calories / maxCal) * 90);
                    const clampedY = Math.max(20, Math.min(110, y));
                    const isOverLimit = point.calories > dailyLimitCal;
                    
                    return (
                      <G key={i}>
                        {/* Outer glow */}
                        <Circle 
                          cx={x} 
                          cy={clampedY} 
                          r="6" 
                          fill={isOverLimit ? "#ef4444" : "#fcaf56"}
                          opacity="0.2"
                        />
                        {/* Main point */}
                        <Circle 
                          cx={x} 
                          cy={clampedY} 
                          r="4" 
                          fill="#ffffff"
                          stroke={isOverLimit ? "#ef4444" : "#f5a623"}
                          strokeWidth="2.5"
                        />
                        {/* Calorie value */}
                        <SvgText 
                          x={x} 
                          y={Math.max(12, clampedY - 10)} 
                          fill={isOverLimit ? "#ef4444" : "#f5a623"}
                          fontSize="10" 
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          {point.calories}
                        </SvgText>
                      </G>
                    );
                  })}
                  
                  {/* X-axis labels */}
                  {weeklyData.map((point, i) => {
                    const x = 30 + (i * 250 / 6);
                    return (
                      <SvgText 
                        key={i}
                        x={x} 
                        y="125" 
                        fill="#5B5B5B" 
                        fontSize="9" 
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {point.date}
                      </SvgText>
                    );
                  })}
                </>
              )}
            </Svg>
          </View>
          
          {/* Super Nani Character */}
          <View style={styles.naniContainer}>
            <View style={styles.naniBox}>
              <Image
                source={mascotImage}
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
            <Text style={styles.infoText}>{t('home.savesOil')} • 8 {t('home.servings')}</Text>
          </View>
          <View style={styles.infoRight}>
            <TouchableOpacity onPress={() => setWeekOffset(prev => prev - 1)}>
              <Ionicons name="chevron-back" size={16} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.monthText}>
              {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
            <TouchableOpacity onPress={() => setWeekOffset(prev => prev + 1)}>
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
                key={item.fullDate.toISOString()}
                style={[
                  styles.dateCard,
                  selectedDate.toDateString() === item.fullDate.toDateString() && styles.dateCardActive,
                ]}
                onPress={() => setSelectedDate(item.fullDate)}
              >
                <Text
                  style={[
                    styles.dayText,
                    selectedDate.toDateString() === item.fullDate.toDateString() && styles.dayTextActive,
                  ]}
                >
                {item.day}
              </Text>
              <Text
                style={[
                  styles.dateNumber,
                  selectedDate.toDateString() === item.fullDate.toDateString() && styles.dateNumberActive,
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
            <Text style={styles.usageTitle}>{t('home.todaysOilUsage')}</Text>
            <Text style={styles.usageValue}>{Math.round(dailyConsumption * 9 * (6.25 / 100))} / {dailyLimitCal} cal</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${Math.min((Math.round(dailyConsumption * 9 * (6.25 / 100)) / dailyLimitCal) * 100, 100)}%` }]} />
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
        <Text style={styles.riskTitle}>{t('home.healthRiskLevel')}</Text>
        <View style={styles.riskProgressContainer}>
          <LinearGradient
            colors={['#7ed321','#7ed321', '#65ad18ff','#f5a623', '#ff6b6b']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.riskProgressBackground}
          />
          <View style={[styles.riskPointer, { left: `${healthRiskLevel}%` }]}>
            <View style={styles.riskPointerTriangle} />
            <View style={styles.riskPointerLine} />
          </View>
        </View>
      </View>

      {/* Your Progress Section */}
      <LinearGradient
        colors={['#1b4a5a', '#07A996']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.progressSection}
      >
        <View style={styles.progressHeader}>
          <View>
            <Text style={styles.progressTitle}>{t('home.yourProgress')}</Text>
            <Text style={styles.progressSubtitle}>{t('home.last30Days')}</Text>
          </View>
          <View style={styles.progressIconCircle}>
            <Ionicons name="water" size={24} color="#ffffff" />
          </View>
        </View>

        {/* Progress Stats Grid */}
        <View style={styles.progressStatsGrid}>
          <View style={styles.progressStatCard}>
            <Text style={styles.progressStatLabel}>{t('home.totalOilSaved')}</Text>
            <Text style={styles.progressStatValue}>{totalOilSaved}ml</Text>
            <View style={styles.progressStatChange}>
              <Ionicons name={totalOilSaved > 0 ? "arrow-up" : "arrow-down"} size={14} color={totalOilSaved > 0 ? "#84cc16" : "#ef4444"} />
              <Text style={styles.progressStatPercentage}>{beforeAvg > 0 ? Math.abs(Math.round((totalOilSaved / (beforeAvg * 15)) * 100)) : 0}%</Text>
            </View>
          </View>

          <View style={styles.progressStatCard}>
            <Text style={styles.progressStatLabel}>{t('home.dailyReduction')}</Text>
            <Text style={styles.progressStatValue}>{avgDailyReduction}ml</Text>
            <View style={styles.progressStatChange}>
              <Ionicons name={avgDailyReduction > 0 ? "arrow-up" : "arrow-down"} size={14} color={avgDailyReduction > 0 ? "#84cc16" : "#ef4444"} />
              <Text style={styles.progressStatPercentage}>{beforeAvg > 0 ? Math.abs(Math.round((avgDailyReduction / beforeAvg) * 100)) : 0}%</Text>
            </View>
          </View>
        </View>

        {/* Comparison Bars */}
        <View style={styles.progressComparison}>
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonLabel}>{t('home.before15to30Days')}</Text>
            <Text style={styles.comparisonValue}>{beforeAvg}ml/day</Text>
          </View>
          <View style={styles.comparisonBarContainer}>
            <View style={[styles.comparisonBar, { width: '100%', backgroundColor: '#ef4444' }]} />
          </View>

          <View style={[styles.comparisonRow, { marginTop: 12 }]}>
            <Text style={styles.comparisonLabel}>{t('home.nowLast15Days')}</Text>
            <Text style={styles.comparisonValue}>{currentAvg}ml/day</Text>
          </View>
          <View style={styles.comparisonBarContainer}>
            <View style={[styles.comparisonBar, { width: `${beforeAvg > 0 ? (currentAvg / beforeAvg) * 100 : 0}%`, backgroundColor: currentAvg <= beforeAvg ? '#84cc16' : '#ef4444' }]} />
          </View>
        </View>

        {/* Achievement Badge */}
        <View style={styles.achievementBadge}>
          <View style={styles.achievementIcon}>
            <Text style={styles.achievementEmoji}>{avgDailyReduction > 0 ? '🎯' : '💪'}</Text>
          </View>
          <View style={styles.achievementText}>
            <Text style={styles.achievementTitle}>{avgDailyReduction > 0 ? t('home.greatProgress') : t('home.keepGoing')}</Text>
            <Text style={styles.achievementDescription}>
              {avgDailyReduction > 0 
                ? t('home.usingLessOil', { percent: beforeAvg > 0 ? Math.abs(Math.round((avgDailyReduction / beforeAvg) * 100)) : 0 })
                : t('home.trackConsumptionProgress')}
            </Text>
          </View>
        </View>

        {/* Government Rewards Progress */}
        <LinearGradient
          colors={['#fbbf24', '#f59e0b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.governmentRewardsCard}
        >
          <View style={styles.rewardsHeader}>
            <View style={styles.rewardsTrophyIcon}>
              <Text style={styles.rewardsTrophyEmoji}>🏆</Text>
            </View>
            <View style={styles.rewardsHeaderText}>
              <View style={styles.rewardsHeaderTop}>
                <Text style={styles.rewardsTitle}>{t('home.governmentRewards')}</Text>
                <View style={styles.rewardsPercentageBadge}>
                  <Text style={styles.rewardsPercentageText}>38%</Text>
                </View>
              </View>

              {/* Unlocked Rewards List */}
              <View style={styles.rewardsList}>
                <View style={styles.rewardItem}>
                  <View style={styles.rewardCheckbox}>
                    <Ionicons name="checkmark" size={12} color="#1b4a5a" />
                  </View>
                  <Text style={styles.rewardItemText}>
                    🥉 Bronze - 10% Electricity Waiver
                  </Text>
                </View>

                <View style={styles.rewardItem}>
                  <View style={styles.rewardCheckbox}>
                    <Ionicons name="checkmark" size={12} color="#1b4a5a" />
                  </View>
                  <Text style={styles.rewardItemText}>
                    🥈 Silver - 15% Water Tax Waiver
                  </Text>
                </View>

                <View style={styles.rewardItem}>
                  <View style={styles.rewardCheckbox}>
                    <Ionicons name="checkmark" size={12} color="#1b4a5a" />
                  </View>
                  <Text style={styles.rewardItemText}>
                    🥇 Gold - 25% Electricity Waiver
                  </Text>
                </View>

                <View style={styles.rewardItem}>
                  <View style={styles.rewardCheckbox}>
                    <Ionicons name="checkmark" size={12} color="#1b4a5a" />
                  </View>
                  <Text style={styles.rewardItemText}>
                    💎 Platinum - 30% Property Tax Rebate
                  </Text>
                </View>
              </View>

              {/* View All Button */}
              <TouchableOpacity 
                style={styles.viewAllRewardsButton}
                onPress={() => navigation.navigate('Rewards')}
              >
                <Text style={styles.viewAllRewardsText}>
                  View All Rewards
                </Text>
                <Ionicons name="chevron-forward" size={14} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </LinearGradient>

      {/* Quick Actions Section */}
      <View style={styles.monitoringSection}>
        <View style={styles.monitoringHeader}>
          <Text style={styles.monitoringTitle}>{t('home.quickActions')}</Text>
          <View style={styles.monitoringIcons}>
            <TouchableOpacity>
              <Ionicons name="shuffle" size={20} color="#1b4a5a" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={20} color="#1b4a5a" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* First Row - Log Oil and Oil Scan */}
        <View style={styles.monitoringCards}>
          {/* Log Oil Card */}
          <TouchableOpacity style={styles.monitoringCard} onPress={handleLogOil}>
            <View style={styles.monitoringIconContainer}>
              <Ionicons name="add" size={32} color="#ffffff" />
            </View>
            <Text style={styles.monitoringCardTitle}>{t('home.logOil')}</Text>
            <Text style={styles.monitoringCardSubtitle}>{t('home.trackYourUsage')}</Text>
          </TouchableOpacity>
          
          {/* Oil Scan Card */}
          <TouchableOpacity style={styles.monitoringCard} onPress={handleScanFood}>
            <View style={[styles.monitoringIconContainer, styles.cameraIconContainer]}>
              <Ionicons name="camera" size={28} color="#07A996" />
            </View>
            <Text style={styles.monitoringCardTitle}>{t('home.oilScan')}</Text>
            <Text style={styles.monitoringCardSubtitle}>{t('home.scanMealOrProduct')}</Text>
          </TouchableOpacity>
        </View>

        {/* Second Row - Learning Modules and AI Insight */}
        <View style={styles.monitoringCards}>
          {/* Learning Modules Card */}
          <TouchableOpacity 
            style={styles.learningCardWrapper}
            onPress={() => navigation.navigate('EducationHub')}
          >
            <View style={styles.learningCard}>
              <View style={[styles.monitoringIconContainer, styles.learningIconContainer]}>
                <Ionicons name="book" size={28} color="#ffffff" />
              </View>
              <Text style={styles.monitoringCardTitle}>{t('home.learningModules')}</Text>
              <Text style={styles.monitoringCardSubtitle}>{t('home.healthNutrition')}</Text>
            </View>
          </TouchableOpacity>
          
          {/* AI Insight Card */}
          <TouchableOpacity style={styles.aiInsightCardWrapper}>
            <LinearGradient
              colors={['#d946ef', '#ec4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aiInsightCard}
            >
              <View style={styles.aiInsightBadge}>
                <Text style={styles.aiInsightBadgeText}>{t('home.aiInsight')}</Text>
              </View>
              <View style={[styles.monitoringIconContainer, styles.aiInsightIconContainer]}>
                <Ionicons name="sparkles" size={24} color="#ffffff" />
              </View>
              <Text style={styles.aiInsightTitle}>{t('home.dalTadkaInsight')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* National Campaign */}
      <View style={styles.campaignSection}>
        <View style={styles.campaignHeader}>
          <Text style={styles.campaignTitle}>{t('home.nationalCampaign')}</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>{t('home.viewAll')}</Text>
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
                <Text style={styles.officialText}>{t('home.official')}</Text>
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
                <Text style={styles.officialText}>{t('home.official')}</Text>
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
                <Text style={styles.officialText}>{t('home.official')}</Text>
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
    marginBottom: 12,
  },
  monitoringCard: {
    flex: 1,
    backgroundColor: '#1b4a5a',
    borderRadius: 20,
    padding: 20,
    minHeight: 150,
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
  // Learning Modules Card Styles
  learningCardWrapper: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  learningCard: {
    flex: 1,
    backgroundColor: '#3b82f6',
    minHeight: 150,
    borderRadius: 20,
    padding: 20,
  },
  learningIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  // AI Insight Card Styles
  aiInsightCardWrapper: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  aiInsightCard: {
    flex: 1,
    position: 'relative',
    borderRadius: 20,
    padding: 20,
    minHeight: 150,
  },
  aiInsightBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#fbbf24',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  aiInsightBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.5,
  },
  aiInsightIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  aiInsightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
    lineHeight: 22,
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
    height: 10,
    width: '100%',
  },
  riskProgressBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  riskPointer: {
    position: 'absolute',
    top: -8,
    marginLeft: -8,
    alignItems: 'center',
  },
  riskPointerTriangle: {
    width: 16,
    height: 10,
    backgroundColor: '#040707',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  riskPointerLine: {
    width: 2,
    height: 10,
    backgroundColor: '#040707',
  },
  // Progress Section Styles
  progressSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  progressIconCircle: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStatsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  progressStatCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
  },
  progressStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  progressStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  progressStatChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressStatPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#84cc16',
  },
  progressComparison: {
    marginBottom: 20,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  comparisonLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  comparisonValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  comparisonBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  comparisonBar: {
    height: '100%',
    borderRadius: 4,
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementEmoji: {
    fontSize: 20,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  governmentRewardsCard: {
    borderRadius: 20,
    padding: 20,
  },
  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rewardsTrophyIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rewardsTrophyEmoji: {
    fontSize: 24,
  },
  rewardsHeaderText: {
    flex: 1,
  },
  rewardsHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rewardsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b4a5a',
  },
  rewardsPercentageBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rewardsPercentageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1b4a5a',
  },
  rewardsList: {
    gap: 10,
    marginBottom: 16,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rewardCheckbox: {
    width: 20,
    height: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardItemText: {
    fontSize: 13,
    color: '#1b4a5a',
    fontWeight: '500',
    flex: 1,
  },
  viewAllRewardsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(27, 74, 90, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 6,
  },
  viewAllRewardsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
