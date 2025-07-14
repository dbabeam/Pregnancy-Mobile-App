"use client"

import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
import {
  Animated,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import i18n from "./i18"; // adjust path as needed

const { width, height } = Dimensions.get("window")

interface Language {
  code: string
  label: string
  nativeLabel: string
  flag: string
  description: string
}

const languages: Language[] = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
    flag: "🇺🇸",
    description: "Default language",
  },
  {
    code: "tw",
    label: "Twi",
    nativeLabel: "Twi",
    flag: "🇬🇭",
    description: "Akan language of Ghana",
  },
  {
    code: "ee",
    label: "Ewe",
    nativeLabel: "Eʋegbe",
    flag: "🇬🇭",
    description: "Volta language of Ghana",
  },
  {
    code: "ga",
    label: "Ga",
    nativeLabel: "Gã",
    flag: "🇬🇭",
    description: "Kwa language of Ghana",
  },
]

export default function LanguageSettings() {
  const router = useRouter()
  const [selectedLang, setSelectedLang] = useState("en")

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const headerScaleAnim = useRef(new Animated.Value(0.9)).current
  const cardAnimations = useRef(languages.map(() => new Animated.Value(0))).current
  const bubbleAnim1 = useRef(new Animated.Value(0)).current
  const bubbleAnim2 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    startAnimations()
  }, [])

  const startAnimations = () => {
    // Main fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()

    // Header scale animation
    Animated.spring(headerScaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start()

    // Content slide up
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start()

    // Staggered card animations
    cardAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: 400 + index * 150,
        useNativeDriver: true,
      }).start()
    })

    // Background bubble animations
    startBubbleAnimations()
  }

  const startBubbleAnimations = () => {
    const createBubbleAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 4000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
      )
    }

    createBubbleAnimation(bubbleAnim1, 0).start()
    createBubbleAnimation(bubbleAnim2, 2000).start()
  }

  const selectLanguage = (code: string) => {
    setSelectedLang(code)
    i18n.changeLanguage(code) // This will update the language everywhere
    // Optionally, save to AsyncStorage for persistence
    // AsyncStorage.setItem('appLanguage', code);

    // Animate selection feedback
    const selectedIndex = languages.findIndex((lang) => lang.code === code)
    if (selectedIndex !== -1) {
      Animated.sequence([
        Animated.timing(cardAnimations[selectedIndex], {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(cardAnimations[selectedIndex], {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }

  const getCurrentLanguage = () => {
    return languages.find((lang) => lang.code === selectedLang) || languages[0]
  }

  const renderCurrentLanguageHeader = () => (
    <Animated.View
      style={[
        styles.currentLanguageContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: headerScaleAnim }],
        },
      ]}
    >
      <LinearGradient colors={["#9C27B0", "#7B1FA2"]} style={styles.currentLanguageGradient}>
        <View style={styles.currentLanguageContent}>
          <View style={styles.currentLanguageIcon}>
            <Text style={styles.flagEmoji}>{getCurrentLanguage().flag}</Text>
          </View>
          <View style={styles.currentLanguageText}>
            <Text style={styles.currentLanguageTitle}>Current Language</Text>
            <Text style={styles.currentLanguageName}>{getCurrentLanguage().label}</Text>
            <Text style={styles.currentLanguageNative}>{getCurrentLanguage().nativeLabel}</Text>
          </View>
          <View style={styles.languageStats}>
            <Ionicons name="globe-outline" size={24} color="rgba(255, 255, 255, 0.8)" />
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  )

  const renderLanguageCard = (language: Language, index: number) => (
    <Animated.View
      key={language.code}
      style={[
        styles.animatedCard,
        {
          opacity: cardAnimations[index],
          transform: [
            {
              translateY: cardAnimations[index].interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.languageCard, selectedLang === language.code && styles.selectedLanguageCard]}
        onPress={() => selectLanguage(language.code)}
        activeOpacity={0.7}
      >
        <View style={styles.languageCardContent}>
          <View style={styles.languageLeft}>
            <View style={[styles.flagContainer, selectedLang === language.code && styles.selectedFlagContainer]}>
              <Text style={styles.flagText}>{language.flag}</Text>
            </View>
            <View style={styles.languageInfo}>
              <Text style={[styles.languageLabel, selectedLang === language.code && styles.selectedLanguageLabel]}>
                {language.label}
              </Text>
              <Text style={styles.languageNative}>{language.nativeLabel}</Text>
              <Text style={styles.languageDescription}>{language.description}</Text>
            </View>
          </View>

          <View style={styles.languageRight}>
            {selectedLang === language.code ? (
              <View style={styles.selectedIndicator}>
                <LinearGradient colors={["#4CAF50", "#45A049"]} style={styles.checkmarkGradient}>
                  <Ionicons name="checkmark" size={20} color="white" />
                </LinearGradient>
              </View>
            ) : (
              <View style={styles.unselectedIndicator}>
                <Ionicons name="chevron-forward" size={20} color="#BDC3C7" />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )

  const renderSaveButton = () => (
    <Animated.View
      style={[
        styles.saveButtonContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => {
          // Save language preference and go back
          router.back()
        }}
        activeOpacity={0.8}
      >
        <LinearGradient colors={["#9C27B0", "#7B1FA2"]} style={styles.saveButtonGradient}>
          <Ionicons name="save-outline" size={20} color="white" />
          <Text style={styles.saveButtonText}>Save Language</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  )

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["#F3E5F5", "#E1BEE7", "#CE93D8"]} style={styles.backgroundGradient}>
          {/* Animated Background Bubbles */}
          <Animated.View
            style={[
              styles.bubble,
              styles.bubbleTop,
              {
                opacity: bubbleAnim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.05, 0.15],
                }),
                transform: [
                  {
                    scale: bubbleAnim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.bubble,
              styles.bubbleBottom,
              {
                opacity: bubbleAnim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.05, 0.1],
                }),
                transform: [
                  {
                    scale: bubbleAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1.1],
                    }),
                  },
                ],
              },
            ]}
          />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Language Settings</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {renderCurrentLanguageHeader()}

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Available Languages</Text>
                <Text style={styles.sectionSubtitle}>Choose your preferred language for the app interface</Text>

                <View style={styles.languageList}>
                  {languages.map((language, index) => renderLanguageCard(language, index))}
                </View>
              </View>

              {renderSaveButton()}

              <View style={styles.bottomSpacing} />
            </Animated.View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  bubble: {
    position: "absolute",
    borderRadius: 100,
    backgroundColor: "rgba(156, 39, 176, 0.1)",
  },
  bubbleTop: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
  },
  bubbleBottom: {
    width: 150,
    height: 150,
    bottom: 100,
    left: -75,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  content: {
    flex: 1,
  },
  currentLanguageContainer: {
    marginBottom: 30,
    borderRadius: 25,
    shadowColor: "#9C27B0",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
  },
  currentLanguageGradient: {
    borderRadius: 25,
    padding: 25,
  },
  currentLanguageContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentLanguageIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  flagEmoji: {
    fontSize: 32,
  },
  currentLanguageText: {
    flex: 1,
  },
  currentLanguageTitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 5,
    fontWeight: "500",
  },
  currentLanguageName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 3,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  currentLanguageNative: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  languageStats: {
    alignItems: "center",
  },
  animatedCard: {
    marginBottom: 12,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    marginBottom: 20,
    lineHeight: 22,
  },
  languageList: {
    gap: 12,
  },
  languageCard: {
    backgroundColor: "white",
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedLanguageCard: {
    borderColor: "#9C27B0",
    shadowColor: "#9C27B0",
    shadowOpacity: 0.2,
  },
  languageCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  languageLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  flagContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedFlagContainer: {
    borderColor: "#9C27B0",
    backgroundColor: "#F3E5F5",
  },
  flagText: {
    fontSize: 24,
  },
  languageInfo: {
    flex: 1,
  },
  languageLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  selectedLanguageLabel: {
    color: "#9C27B0",
  },
  languageNative: {
    fontSize: 16,
    color: "#7F8C8D",
    marginBottom: 2,
    fontWeight: "500",
  },
  languageDescription: {
    fontSize: 14,
    color: "#BDC3C7",
  },
  languageRight: {
    marginLeft: 15,
  },
  selectedIndicator: {
    borderRadius: 20,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  checkmarkGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  unselectedIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonContainer: {
    marginTop: 20,
  },
  saveButton: {
    borderRadius: 15,
    shadowColor: "#9C27B0",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  saveButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },
  bottomSpacing: {
    height: 30,
  },
})
