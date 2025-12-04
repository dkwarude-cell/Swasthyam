import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface SuperNaniProps {
  isOpen: boolean;
  onClose: () => void;
  language?: string;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'nani';
  timestamp: Date;
}

const quickActions = [
  { id: 'scan', label: 'Scan Product', icon: 'camera' as const, color: '#fcaf56' },
  { id: 'tips', label: 'Oil Tips', icon: 'water' as const, color: '#1b4a5a' },
  { id: 'recipes', label: 'Recipes', icon: 'restaurant' as const, color: '#fcaf56' },
  { id: 'report', label: 'My Report', icon: 'bar-chart' as const, color: '#1b4a5a' },
];

const suggestedPrompts = [
  "How can I reduce oil in dal tadka?",
  "Best oil for heart health?",
  "Air fryer recipe suggestions",
  "My weekly oil consumption analysis",
];

export function SuperNani({ isOpen, onClose, language = 'en' }: SuperNaniProps) {
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'home' | 'chat'>('onboarding');
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: "Namaste! I'm Super Nani, your trusted companion for healthy cooking. How can I help you today?", 
      sender: 'nani', 
      timestamp: new Date() 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (isOpen && !hasSeenOnboarding) {
      setCurrentScreen('onboarding');
    } else if (isOpen && hasSeenOnboarding) {
      setCurrentScreen('home');
    }
  }, [isOpen, hasSeenOnboarding]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');

    // Simulate Nani's response
    setTimeout(() => {
      const naniResponse: Message = {
        id: messages.length + 2,
        text: getNaniResponse(inputMessage),
        sender: 'nani',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, naniResponse]);
    }, 1000);
  };

  const getNaniResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('reduce oil') || input.includes('less oil')) {
      return "Great question! Here are 3 tips to reduce oil:\n\n1. Use air fryer or grilling instead of deep frying\n2. Use a measuring spoon to control portions\n3. Try water sautéing vegetables\n\nWould you like specific recipes?";
    }
    
    if (input.includes('oil') && input.includes('health')) {
      return "For heart health, I recommend:\n\n• Olive oil (for salads & low heat)\n• Rice bran oil (for high heat cooking)\n• Mustard oil (in moderation)\n\nAvoid reusing oil and limit saturated fats. Would you like more details?";
    }
    
    if (input.includes('recipe') || input.includes('air fryer')) {
      return "I have some delicious low-oil recipes for you:\n\n1. Air-Fried Samosa (67% less oil)\n2. Baked Pakora (65% less oil)\n3. Grilled Paneer (70% less oil)\n\nWhich one would you like to try?";
    }
    
    if (input.includes('consumption') || input.includes('report')) {
      return "Based on your weekly usage:\n\n• Average: 42ml/day\n• Ideal: 35ml/day\n• You're 20% over target\n\nTry using oil spray and measuring spoons to stay on track!";
    }

    return "That's an interesting question! As your Super Nani, I'm here to help with:\n\n• Oil usage tips\n• Healthy recipes\n• Consumption analysis\n• Product recommendations\n\nHow can I assist you today?";
  };

  const handleOnboardingComplete = () => {
    setHasSeenOnboarding(true);
    setCurrentScreen('home');
  };

  const handleQuickAction = (actionId: string) => {
    if (actionId === 'tips') {
      setCurrentScreen('chat');
      const tipMessage: Message = {
        id: messages.length + 1,
        text: "Show me oil reduction tips",
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, tipMessage]);
      
      setTimeout(() => {
        const naniResponse: Message = {
          id: messages.length + 2,
          text: getNaniResponse("reduce oil"),
          sender: 'nani',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, naniResponse]);
      }, 500);
    } else {
      setCurrentScreen('chat');
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputMessage(prompt);
    setCurrentScreen('chat');
  };

  const renderOnboarding = () => (
    <View style={styles.onboardingContainer}>
      <View style={styles.naniAvatarContainer}>
        <View style={styles.naniAvatar}>
          <Ionicons name="restaurant" size={48} color="#fff" />
        </View>
      </View>
      
      <Text style={styles.onboardingTitle}>Meet Super Nani</Text>
      <Text style={styles.onboardingSubtitle}>Your AI cooking companion</Text>
      
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <Ionicons name="bulb" size={24} color="#fcaf56" />
          <Text style={styles.featureText}>Smart cooking tips</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="restaurant" size={24} color="#fcaf56" />
          <Text style={styles.featureText}>Healthy recipes</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="analytics" size={24} color="#fcaf56" />
          <Text style={styles.featureText}>Oil tracking</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="chatbubbles" size={24} color="#fcaf56" />
          <Text style={styles.featureText}>24/7 chat support</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.getStartedButton}
        onPress={handleOnboardingComplete}
      >
        <Text style={styles.getStartedButtonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHome = () => (
    <View style={styles.homeContainer}>
      <View style={styles.naniAvatarSmall}>
        <Ionicons name="restaurant" size={32} color="#fff" />
      </View>
      
      <Text style={styles.homeTitle}>Hi! I'm Super Nani</Text>
      <Text style={styles.homeSubtitle}>How can I help you today?</Text>
      
      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.quickActionButton, { backgroundColor: action.color }]}
            onPress={() => handleQuickAction(action.id)}
          >
            <Ionicons name={action.icon} size={24} color="#fff" />
            <Text style={styles.quickActionText}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Suggested Prompts */}
      <View style={styles.suggestedPromptsContainer}>
        <Text style={styles.suggestedPromptsTitle}>Suggested Questions</Text>
        {suggestedPrompts.map((prompt, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestedPromptButton}
            onPress={() => handleSuggestedPrompt(prompt)}
          >
            <Text style={styles.suggestedPromptText}>{prompt}</Text>
            <Ionicons name="arrow-forward" size={16} color="#1b4a5a" />
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity
        style={styles.startChatButton}
        onPress={() => setCurrentScreen('chat')}
      >
        <Ionicons name="chatbubbles" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.startChatButtonText}>Start Chat</Text>
      </TouchableOpacity>
    </View>
  );

  const renderChat = () => (
    <KeyboardAvoidingView 
      style={styles.chatContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.sender === 'user' ? styles.userMessage : styles.naniMessage
            ]}
          >
            {message.sender === 'nani' && (
              <View style={styles.naniMessageIcon}>
                <Ionicons name="restaurant" size={16} color="#fff" />
              </View>
            )}
            <View style={styles.messageContent}>
              <Text style={[
                styles.messageText,
                message.sender === 'user' ? styles.userMessageText : styles.naniMessageText
              ]}>
                {message.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      
      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Ask Super Nani..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputMessage.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!inputMessage.trim()}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {currentScreen !== 'onboarding' && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                if (currentScreen === 'chat') {
                  setCurrentScreen('home');
                } else {
                  onClose();
                }
              }}
            >
              <Ionicons name="chevron-back" size={24} color="#040707" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>
            {currentScreen === 'onboarding' ? 'Welcome' : 'Super Nani'}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#040707" />
          </TouchableOpacity>
        </View>
        
        {/* Content */}
        {currentScreen === 'onboarding' && renderOnboarding()}
        {currentScreen === 'home' && renderHome()}
        {currentScreen === 'chat' && renderChat()}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E7F2F1',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#040707',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Onboarding styles
  onboardingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  naniAvatarContainer: {
    marginBottom: 32,
  },
  naniAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1b4a5a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onboardingTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#040707',
    marginBottom: 8,
  },
  onboardingSubtitle: {
    fontSize: 16,
    color: '#5B5B5B',
    marginBottom: 40,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureText: {
    fontSize: 16,
    color: '#040707',
    marginLeft: 16,
  },
  getStartedButton: {
    backgroundColor: '#1b4a5a',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Home styles
  homeContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  naniAvatarSmall: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1b4a5a',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  homeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#040707',
    textAlign: 'center',
    marginBottom: 8,
  },
  homeSubtitle: {
    fontSize: 16,
    color: '#5B5B5B',
    textAlign: 'center',
    marginBottom: 32,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  quickActionButton: {
    flex: 1,
    minWidth: '47%',
    aspectRatio: 1.5,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  suggestedPromptsContainer: {
    marginBottom: 24,
  },
  suggestedPromptsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#040707',
    marginBottom: 12,
  },
  suggestedPromptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E7F2F1',
  },
  suggestedPromptText: {
    fontSize: 14,
    color: '#040707',
    flex: 1,
  },
  startChatButton: {
    backgroundColor: '#1b4a5a',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startChatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Chat styles
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  naniMessage: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  naniMessageIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1b4a5a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    backgroundColor: '#1b4a5a',
    color: '#fff',
    padding: 12,
    borderRadius: 16,
    borderTopRightRadius: 4,
  },
  naniMessageText: {
    backgroundColor: '#fff',
    color: '#040707',
    padding: 12,
    borderRadius: 16,
    borderTopLeftRadius: 4,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E7F2F1',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fafbfa',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#040707',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1b4a5a',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
