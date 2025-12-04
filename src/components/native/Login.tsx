import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

interface LoginProps {
  onComplete: () => void;
  language: string;
  onLanguageChange?: (lang: string) => void;
}

export function Login({ onComplete, language, onLanguageChange }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
  ];

  const currentLanguage = languages.find(l => l.code === language) || languages[0];

  const handleLogin = () => {
    onComplete();
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    onComplete();
  };

  const text = {
    en: {
      hello: 'Hello!',
      welcome: 'Welcome to Swasthyam',
      login: 'Login',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      loginButton: 'Login',
      orLoginWith: 'Or login with',
      noAccount: "Don't have account?",
      signUp: 'Sign Up',
    },
    hi: {
      hello: 'नमस्ते!',
      welcome: 'SwasthTel में आपका स्वागत है',
      login: 'लॉगिन',
      email: 'ईमेल',
      password: 'पासवर्ड',
      forgotPassword: 'पासवर्ड भूल गए?',
      loginButton: 'लॉगिन करें',
      orLoginWith: 'या लॉगिन करें',
      noAccount: 'खाता नहीं है?',
      signUp: 'साइन अप करें',
    },
  };

  const t = text[language as keyof typeof text] || text.en;

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Decorative Background Elements */}
        <View style={[styles.decorCircle, styles.decorCircle1]} />
        <View style={[styles.decorCircle, styles.decorCircle2]} />
        <View style={[styles.decorCircle, styles.decorCircle3]} />

        {/* Language Selector */}
        <View style={styles.languageSelector}>
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => setShowLanguageMenu(!showLanguageMenu)}
          >
            <Ionicons name="language" size={18} color="#ffffff" />
            <Text style={styles.languageText}>{currentLanguage.name}</Text>
            <Ionicons 
              name={showLanguageMenu ? "chevron-up" : "chevron-down"} 
              size={16} 
              color="#ffffff" 
            />
          </TouchableOpacity>
          
          {showLanguageMenu && (
            <View style={styles.languageMenu}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageMenuItem,
                    language === lang.code && styles.languageMenuItemActive
                  ]}
                  onPress={() => {
                    onLanguageChange?.(lang.code);
                    setShowLanguageMenu(false);
                  }}
                >
                  <Text style={[
                    styles.languageMenuText,
                    language === lang.code && styles.languageMenuTextActive
                  ]}>{lang.name}</Text>
                  {language === lang.code && (
                    <Ionicons name="checkmark" size={18} color="#07A996" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.helloText}>{t.hello}</Text>
          <Text style={styles.welcomeText}>{t.welcome}</Text>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.loginTitle}>{t.login}</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#5B5B5B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t.email}
              placeholderTextColor="#5B5B5B"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#5B5B5B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t.password}
              placeholderTextColor="#5B5B5B"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>{t.forgotPassword}</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <Button
            onPress={handleLogin}
            style={styles.button}
          >
            {t.loginButton}
          </Button>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t.orLoginWith}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('facebook')}
            >
              <Ionicons name="logo-facebook" size={24} color="#1877F2" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('google')}
            >
              <Ionicons name="logo-google" size={24} color="#EA4335" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('apple')}
            >
              <Ionicons name="logo-apple" size={24} color="#040707" />
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>{t.noAccount} </Text>
            <TouchableOpacity>
              <Text style={styles.signupLink}>{t.signUp}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b4a5a',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  decorCircle1: {
    top: 40,
    left: 40,
    width: 128,
    height: 128,
    backgroundColor: '#E7F2F1',
    opacity: 0.3,
  },
  decorCircle2: {
    top: 80,
    right: -20,
    width: 160,
    height: 160,
    backgroundColor: '#ffffff',
    opacity: 0.2,
  },
  decorCircle3: {
    bottom: 80,
    left: -30,
    width: 192,
    height: 192,
    backgroundColor: '#E7F2F1',
    opacity: 0.25,
  },
  languageSelector: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    zIndex: 100,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  languageText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  languageMenu: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  languageMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  languageMenuItemActive: {
    backgroundColor: '#E7F2F1',
  },
  languageMenuText: {
    flex: 1,
    fontSize: 14,
    color: '#040707',
  },
  languageMenuTextActive: {
    color: '#07A996',
    fontWeight: '600',
  },
  header: {
    marginBottom: 32,
  },
  helloText: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 24,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#E7F2F1',
    borderRadius: 32,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoContainer: {
    position: 'absolute',
    top: -30,
    right: 32,
    width: 80,
    height: 80,
    backgroundColor: '#ffffff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  loginTitle: {
    fontSize: 24,
    color: '#040707',
    fontWeight: '600',
    marginBottom: 24,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#040707',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#07A996',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#1b4a5a',
    height: 56,
    marginTop: 8,
  },
  loginButton: {
    backgroundColor: '#1b4a5a',
    height: 56,
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#5B5B5B',
    opacity: 0.3,
  },
  dividerText: {
    color: '#5B5B5B',
    fontSize: 14,
    marginHorizontal: 16,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#5B5B5B',
    fontSize: 14,
  },
  signupLink: {
    color: '#07A996',
    fontSize: 14,
    fontWeight: '600',
  },
});
