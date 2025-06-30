import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// Sample initial messages
const initialMessages = [
  {
    id: "1",
    text: "Hello! I'm your pregnancy assistant. How can I help you today?",
    sender: "bot",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
];

// Sample suggested questions
const suggestedQuestions = [
  {
    id: "1",
    text: "What foods should I avoid?",
    category: "nutrition",
  },
  {
    id: "2",
    text: "Is my symptom normal?",
    category: "health",
  },
  {
    id: "3",
    text: "Safe exercises for 2nd trimester?",
    category: "fitness",
  },
  {
    id: "4",
    text: "How to relieve back pain?",
    category: "comfort",
  },
  {
    id: "5",
    text: "When should I call my doctor?",
    category: "medical",
  },
];

// Sample responses for demo purposes
const sampleResponses = {
  "what foods should i avoid?": "During pregnancy, it's best to avoid:\n\n• Raw or undercooked meat, poultry, fish, and eggs\n• Unpasteurized dairy products\n• High-mercury fish like shark, swordfish, and mackerel\n• Raw sprouts\n• Excessive caffeine\n• Alcohol\n\nWould you like more specific information about any of these?",
  "is my symptom normal?": "Many symptoms can be normal during pregnancy, including nausea, fatigue, back pain, and swelling. However, without knowing your specific symptom, I can't give personalized advice. Could you tell me what symptom you're experiencing?",
  "safe exercises for 2nd trimester?": "Great question! Safe exercises during your 2nd trimester include:\n\n• Walking\n• Swimming\n• Prenatal yoga\n• Stationary cycling\n• Low-impact aerobics\n• Modified strength training\n\nRemember to avoid exercises that require lying flat on your back and activities with a high risk of falling or abdominal trauma.",
  "how to relieve back pain?": "For pregnancy back pain relief, try:\n\n• Gentle stretching\n• Prenatal yoga\n• Proper posture\n• Supportive maternity belt\n• Warm (not hot) compress\n• Prenatal massage\n• Swimming\n• Sleeping with a pregnancy pillow\n\nIf pain is severe or includes other symptoms, please consult your healthcare provider.",
  "when should i call my doctor?": "Contact your doctor immediately if you experience:\n\n• Vaginal bleeding\n• Severe abdominal pain\n• Severe headache or vision changes\n• Fever over 100.4°F (38°C)\n• Rapid swelling of face, hands, or feet\n• Decreased fetal movement\n• Contractions before 37 weeks\n• Fluid leaking from vagina\n• Persistent vomiting",
};

const MyAIScreen = () => {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleSend = () => {
    if (inputText.trim() === "") return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const lowerCaseInput = inputText.toLowerCase().trim();
      let responseText = "I'm not sure how to respond to that. Could you try asking something about pregnancy nutrition, symptoms, exercise, or when to contact your doctor?";
      
      // Check for matching responses
      Object.keys(sampleResponses).forEach(key => {
        if (lowerCaseInput.includes(key) || key.includes(lowerCaseInput)) {
          responseText = sampleResponses[key];
        }
      });

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestedQuestion = (question) => {
    setInputText(question.text);
    inputRef.current.focus();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }) => {
    const isBot = item.sender === "bot";
    
    return (
      <View style={[
        styles.messageContainer,
        isBot ? styles.botMessageContainer : styles.userMessageContainer
      ]}>
        {isBot && (
          <Image 
            source={require("../assets/images/myAI.png")} 
            style={styles.botAvatar}
          />
        )}
        
        <View style={[
          styles.messageBubble,
          isBot ? styles.botMessageBubble : styles.userMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isBot ? styles.botMessageText : styles.userMessageText
          ]}>
            {item.text}
          </Text>
          <Text style={styles.timestamp}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
        
        {!isBot && (
          <Image 
            source={require("../assets/images/avatar2.png")} 
            style={styles.userAvatar}
          />
        )}
      </View>
    );
  };

  const renderSuggestedQuestion = ({ item }) => (
    <TouchableOpacity 
      style={styles.suggestedQuestionButton}
      onPress={() => handleSuggestedQuestion(item)}
    >
      <Text style={styles.suggestedQuestionText}>{item.text}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <LinearGradient 
        colors={["#E0BBFF", "#9C27B0", "#7B1FA2"]} 
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Pregnancy Assistant</Text>
              <View style={styles.activeIndicator}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>Online</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.infoButton}>
              <Ionicons name="information-circle" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <View style={styles.typingBubble}>
            <View style={styles.typingDot} />
            <View style={[styles.typingDot, styles.typingDotMiddle]} />
            <View style={styles.typingDot} />
          </View>
          <Text style={styles.typingText}>Assistant is typing...</Text>
        </View>
      )}

      {/* Suggested Questions */}
      <Animated.View 
        style={[
          styles.suggestedQuestionsContainer, 
          { opacity: fadeAnim },
          keyboardVisible && { height: 0, overflow: 'hidden' }
        ]}
      >
        <Text style={styles.suggestedTitle}>Suggested Questions</Text>
        <FlatList
          data={suggestedQuestions}
          renderItem={renderSuggestedQuestion}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestedQuestionsScroll}
        />
      </Animated.View>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="add-circle" size={24} color="#9C27B0" />
        </TouchableOpacity>
        
        <View style={styles.textInputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            placeholder="Ask me anything about pregnancy..."
            placeholderTextColor="#A0A0A0"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
        </View>
        
        <TouchableOpacity 
          style={[
            styles.sendButton,
            inputText.trim() === "" ? styles.sendButtonDisabled : styles.sendButtonActive
          ]}
          onPress={handleSend}
          disabled={inputText.trim() === ""}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={inputText.trim() === "" ? "#BDBDBD" : "white"} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  activeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginRight: 5,
  },
  activeText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
  },
  infoButton: {
    padding: 8,
  },
  messagesContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  botMessageContainer: {
    justifyContent: "flex-start",
  },
  userMessageContainer: {
    justifyContent: "flex-end",
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  botMessageBubble: {
    backgroundColor: "white",
    borderTopLeftRadius: 4,
  },
  userMessageBubble: {
    backgroundColor: "#9C27B0",
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  botMessageText: {
    color: "#2C3E50",
  },
  userMessageText: {
    color: "white",
  },
  timestamp: {
    fontSize: 10,
    color: "#A0A0A0",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 60,
    marginBottom: 16,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#9C27B0",
    marginHorizontal: 2,
    opacity: 0.6,
  },
  typingDotMiddle: {
    opacity: 0.8,
    transform: [{ scale: 1.2 }],
  },
  typingText: {
    fontSize: 12,
    color: "#A0A0A0",
  },
  suggestedQuestionsContainer: {
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "white",
  },
  suggestedTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    marginLeft: 15,
    marginBottom: 10,
  },
  suggestedQuestionsScroll: {
    paddingHorizontal: 10,
  },
  suggestedQuestionButton: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  suggestedQuestionText: {
    fontSize: 13,
    color: "#5D6D7E",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  attachButton: {
    padding: 8,
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginHorizontal: 8,
    maxHeight: 100,
  },
  textInput: {
    fontSize: 15,
    color: "#2C3E50",
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonActive: {
    backgroundColor: "#9C27B0",
  },
  sendButtonDisabled: {
    backgroundColor: "#F0F0F0",
  },
});

export default MyAIScreen;