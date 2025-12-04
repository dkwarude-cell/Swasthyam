import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Login } from '../components/native/Login';
import { OTPVerification } from '../components/native/OTPVerification';
import { MobileHome } from '../components/native/MobileHome';
import { MobileCommunity } from '../components/native/MobileCommunity';
import { MobilePartners } from '../components/native/MobilePartners';
import { MobileProfile } from '../components/native/MobileProfile';
import { MobileOilTracker } from '../components/native/MobileOilTracker';
import { MobileRecipes } from '../components/native/MobileRecipes';
import { MobileChallenges } from '../components/native/MobileChallenges';
import { MobileEducation } from '../components/native/MobileEducation';
import { OnboardingFlow } from '../components/native/OnboardingFlow';
import { SuperNani } from '../components/native/SuperNani';
import { HamburgerMenu } from '../components/native/HamburgerMenu';

// Detail screens - all converted from web to React Native
import { RecipeDetailScreen } from '../components/native/screens/RecipeDetailScreen';
import { ChallengeDetailScreen } from '../components/native/screens/ChallengeDetailScreen';
import { DeviceManagementScreen } from '../components/native/screens/DeviceManagementScreen';
import { DeviceDetailScreen } from '../components/native/screens/DeviceDetailScreen';
import { NotificationsScreen } from '../components/native/screens/NotificationsScreen';
import { TrendViewScreen } from '../components/native/screens/TrendViewScreen';
import { RecipeSearchScreen } from '../components/native/screens/RecipeSearchScreen';
import { AIRecipesScreen } from '../components/native/screens/AIRecipesScreen';
import { MealPlannerScreen } from '../components/native/screens/MealPlannerScreen';
import { FavoritesScreen } from '../components/native/screens/FavoritesScreen';
import { LeaderboardScreen } from '../components/native/screens/LeaderboardScreen';
import { RewardsStoreScreen } from '../components/native/screens/RewardsStoreScreen';
import { EducationModuleScreen } from '../components/native/screens/EducationModuleScreen';
import { GroupDetailScreen } from '../components/native/screens/GroupDetailScreen';
import { GroupDashboardScreen } from '../components/native/screens/GroupDashboardScreen';
import { GroupManagementScreen } from '../components/native/screens/GroupManagementScreen';
import { EditProfileScreen } from '../components/native/screens/EditProfileScreen';
import { MyGoalsScreen } from '../components/native/screens/MyGoalsScreen';
import { PrivacySettingsScreen } from '../components/native/screens/PrivacySettingsScreen';
import { HelpSupportScreen } from '../components/native/screens/HelpSupportScreen';
import { PartnerDetailScreen } from '../components/native/screens/PartnerDetailScreen';
import { PartnerSearchScreen } from '../components/native/screens/PartnerSearchScreen';
import { BlockchainVerificationScreen } from '../components/native/screens/BlockchainVerificationScreen';

// Placeholder for remaining optional screens
const PlaceholderScreen = ({ title, navigation }: any) => (
  <View style={styles.placeholder}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>Screen placeholder - can be converted on demand</Text>
    {navigation && (
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    )}
  </View>
);

// Optional screens (convert on demand)
const GoalSettingsScreen = ({ navigation }: any) => <PlaceholderScreen title="Goal Settings" navigation={navigation} />;
const SettingsScreen = ({ navigation }: any) => <PlaceholderScreen title="Settings" navigation={navigation} />;

// SuperNani wrapper to handle navigation integration
const SuperNaniScreen = ({ navigation }: any) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const handleClose = () => {
    setIsOpen(false);
    navigation.goBack();
  };

  return <SuperNani isOpen={isOpen} onClose={handleClose} language="en" />;
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const MainStack = createNativeStackNavigator();

// Main Tab Navigator
function MainTabs({ language, onLogout }: any) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e5e5',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 75,
          paddingBottom: 12,
          paddingTop: 8,
          paddingHorizontal: 10,
        },
        tabBarActiveTintColor: '#ffffffff',
        tabBarInactiveTintColor: '#1d1d1dff',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? tabStyles.activeTabBackground : tabStyles.inactiveTabBackground}>
              <Ionicons name={focused ? "home" : "home-outline"} size={24} color={focused ? '#ffffff' : color} />
            </View>
          ),
        }}
      >
        {(props) => <MobileHome {...props} language={language} />}
      </Tab.Screen>

      <Tab.Screen
        name="CommunityTab"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? tabStyles.activeTabBackground : tabStyles.inactiveTabBackground}>
              <Ionicons name={focused ? "people" : "people-outline"} size={24} color={focused ? '#ffffff' : color} />
            </View>
          ),
        }}
      >
        {(props) => <MobileCommunity {...props} language={language} />}
      </Tab.Screen>

      {/* Center Logo Button */}
      <Tab.Screen
        name="Menu"
        component={View}
        options={{
          title: '',
          tabBarIcon: () => (
            <View style={tabStyles.centerButton}>
              <Image
                source={require('../assets/logo.png')}
                style={tabStyles.centerLogo}
                resizeMode="contain"
              />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Settings');
          },
        })}
      />

      <Tab.Screen
        name="PartnersTab"
        options={{
          title: 'Partners',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? tabStyles.activeTabBackground : tabStyles.inactiveTabBackground}>
              <Ionicons name={focused ? "storefront" : "storefront-outline"} size={24} color={focused ? '#ffffff' : color} />
            </View>
          ),
        }}
      >
        {(props) => <MobilePartners {...props} language={language} />}
      </Tab.Screen>

      <Tab.Screen
        name="ProfileTab"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? tabStyles.activeTabBackground : tabStyles.inactiveTabBackground}>
              <Ionicons name={focused ? "person" : "person-outline"} size={24} color={focused ? '#ffffff' : color} />
            </View>
          ),
        }}
      >
        {(props) => <MobileProfile {...props} language={language} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Tab bar specific styles
const tabStyles = StyleSheet.create({
  activeTabBackground: {
    backgroundColor: '#1b4a5a',
    width: 65,
    height: 55,
    marginBottom: -15,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveTabBackground: {
    backgroundColor: 'transparent',
    width: 65,
    height: 55,
    marginBottom: -15,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButton: {
    width: 80,
    height: 80,
    backgroundColor: '#ffffffff',
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  centerLogo: {
    width: 70,
    height: 70,
  },
});

// Main Stack Navigator (includes tabs and detail screens)
function MainStackNavigator({ language, onLogout }: any) {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Tabs">
        {(props) => <MainTabs {...props} language={language} onLogout={onLogout} />}
      </MainStack.Screen>
      
      {/* Oil Tracker Screens */}
      <MainStack.Screen name="OilTracker">
        {(props) => <MobileOilTracker {...props} language={language} />}
      </MainStack.Screen>
      <MainStack.Screen name="Notifications" component={NotificationsScreen} />
      <MainStack.Screen name="DeviceManagement" component={DeviceManagementScreen} />
      <MainStack.Screen name="DeviceDetail" component={DeviceDetailScreen} />
      <MainStack.Screen name="TrendView" component={TrendViewScreen} />
      
      {/* Recipe Screens */}
      <MainStack.Screen name="Recipes">
        {(props) => <MobileRecipes {...props} language={language} />}
      </MainStack.Screen>
      <MainStack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
      <MainStack.Screen name="RecipeSearch" component={RecipeSearchScreen} />
      <MainStack.Screen name="AIRecipes" component={AIRecipesScreen} />
      <MainStack.Screen name="MealPlanner" component={MealPlannerScreen} />
      <MainStack.Screen name="Favorites" component={FavoritesScreen} />
      
      {/* Challenge Screens */}
      <MainStack.Screen name="Challenges">
        {(props) => <MobileChallenges {...props} language={language} />}
      </MainStack.Screen>
      <MainStack.Screen name="ChallengeDetail" component={ChallengeDetailScreen} />
      <MainStack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <MainStack.Screen name="RewardsStore" component={RewardsStoreScreen} />
      
      {/* Education Screens */}
      <MainStack.Screen name="Education">
        {(props) => <MobileEducation {...props} language={language} />}
      </MainStack.Screen>
      <MainStack.Screen name="EducationModule" component={EducationModuleScreen} />
      
      {/* Community Screens */}
      <MainStack.Screen name="GroupManagement" component={GroupManagementScreen} />
      <MainStack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <MainStack.Screen name="GroupDashboard" component={GroupDashboardScreen} />
      
      {/* Partner Screens */}
      <MainStack.Screen name="PartnerDetail" component={PartnerDetailScreen} />
      <MainStack.Screen name="PartnerSearch" component={PartnerSearchScreen} />
      <MainStack.Screen name="BlockchainVerification" component={BlockchainVerificationScreen} />
      
      {/* Profile Screens */}
      <MainStack.Screen name="EditProfile" component={EditProfileScreen} />
      <MainStack.Screen name="MyGoals" component={MyGoalsScreen} />
      <MainStack.Screen name="GoalSettings" component={GoalSettingsScreen} />
      <MainStack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
      <MainStack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <MainStack.Screen name="Settings" component={SettingsScreen} />
      
      {/* Super Nani */}
      <MainStack.Screen 
        name="SuperNani" 
        component={SuperNaniScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </MainStack.Navigator>
  );
}

// Auth Stack Navigator
export function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isOTPVerified, setIsOTPVerified] = React.useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState('en');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Load authentication state from AsyncStorage on mount
  useEffect(() => {
    loadAuthState();
  }, []);

  // Save authentication state whenever it changes (only after initial load)
  useEffect(() => {
    if (isInitialized) {
      saveAuthState();
    }
  }, [isLoggedIn, isOTPVerified, isOnboardingComplete, selectedLanguage, isInitialized]);

  const loadAuthState = async () => {
    try {
      const authData = await AsyncStorage.getItem('authState');
      if (authData) {
        const { isLoggedIn: savedLogin, isOTPVerified: savedOTP, isOnboardingComplete: savedOnboarding, selectedLanguage: savedLang } = JSON.parse(authData);
        // Always start with login screen - comment out saved state for testing
        // setIsLoggedIn(savedLogin || false);
        // setIsOTPVerified(savedOTP || false);
        // setIsOnboardingComplete(savedOnboarding || false);
        setIsLoggedIn(false);
        setIsOTPVerified(false);
        setIsOnboardingComplete(false);
        setSelectedLanguage(savedLang || 'en');
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  const saveAuthState = async () => {
    try {
      const authData = JSON.stringify({
        isLoggedIn,
        isOTPVerified,
        isOnboardingComplete,
        selectedLanguage
      });
      await AsyncStorage.setItem('authState', authData);
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setIsOTPVerified(false);
    setIsOnboardingComplete(false);
    try {
      await AsyncStorage.removeItem('authState');
    } catch (error) {
      console.error('Error clearing auth state:', error);
    }
  };

  // Show loading screen while checking auth state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login">
            {(props) => (
              <Login
                {...props}
                onComplete={() => setIsLoggedIn(true)}
                language={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            )}
          </Stack.Screen>
        ) : !isOTPVerified ? (
          <Stack.Screen name="OTPVerification">
            {(props) => (
              <OTPVerification
                {...props}
                onComplete={() => setIsOTPVerified(true)}
                language={selectedLanguage}
              />
            )}
          </Stack.Screen>
        ) : !isOnboardingComplete ? (
          <Stack.Screen name="Onboarding">
            {(props) => (
              <OnboardingFlow
                {...props}
                onComplete={() => setIsOnboardingComplete(true)}
                language={selectedLanguage}
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Main">
            {(props) => (
              <MainStackNavigator
                {...props}
                language={selectedLanguage}
                onLogout={handleLogout}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafbfa',
  },
  loadingText: {
    fontSize: 18,
    color: '#1b4a5a',
    fontWeight: '600',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fafbfa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1b4a5a',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#5B5B5B',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#1b4a5a',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});