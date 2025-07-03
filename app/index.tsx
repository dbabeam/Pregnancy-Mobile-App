"use client"

import './i18'; // Make sure this path matches your actual file location
import i18n from './i18'; // Import the i18n instance

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width, height } = Dimensions.get("window")

const onboardingData = [
  {
    id: 1,
    title: "Welcome to PregWell",
    subtitle: "Your Pregnancy Journey Companion",
    description:
      "Track your pregnancy week by week with personalized health tips, nutrition guidance, and expert advice tailored for Ghanaian mothers.",
    image: "👶🏾",
    features: [
      { icon: "calendar", text: "Week-by-week tracking" },
      { icon: "heart", text: "Health monitoring" },
      { icon: "nutrition", text: "Nutrition guidance" },
    ],
    gradient: ["#FFE4E6", "#F8BBD0", "#F48FB1"],
  },
  {
    id: 2,
    title: "Smart Health Tracking",
    subtitle: "Monitor Your Wellness",
    description:
      "Check symptoms, track appointments, get emergency help, and access AI-powered health insights designed for expectant mothers.",
    image: "🩺",
    features: [
      { icon: "medical", text: "Symptom checker" },
      { icon: "chatbubble-ellipses", text: "AI health assistant" },
      { icon: "call", text: "Emergency support" },
    ],
    gradient: ["#E8F5E9", "#C8E6C9", "#A5D6A7"],
  },
  {
    id: 3,
    title: "Community & Support",
    subtitle: "You're Not Alone",
    description:
      "Connect with other mothers, access post-natal care, get exercise routines, and join a supportive community throughout your journey.",
    image: "🤱🏾",
    features: [
      { icon: "people", text: "Mother community" },
      { icon: "fitness", text: "Safe exercises" },
      { icon: "baby", text: "Post-natal care" },
    ],
    gradient: ["#E3F2FD", "#BBDEFB", "#90CAF9"],
  },
]

const WelcomeScreen = () => {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const scrollViewRef = useRef<ScrollView>(null)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(0)).current
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current
  const logoRotateAnim = useRef(new Animated.Value(0)).current
  const bubbleAnim1 = useRef(new Animated.Value(0)).current
  const bubbleAnim2 = useRef(new Animated.Value(0)).current
  const bubbleAnim3 = useRef(new Animated.Value(0)).current
  const featureAnimations = useRef(onboardingData[0].features.map(() => new Animated.Value(0))).current

  // Check if first time user
  useEffect(() => {
    checkFirstTimeUser()
  }, [])

  // Start animations when component mounts
  useEffect(() => {
    if (!isLoading) {
      startInitialAnimations()
    }
  }, [isLoading])

  // Animate features when slide changes
  useEffect(() => {
    animateFeatures()
  }, [currentSlide])

  // Language initialization effect
  useEffect(() => {
    AsyncStorage.getItem('appLanguage').then(lang => {
      if (lang) i18n.changeLanguage(lang);
    });
  }, []);

  const checkFirstTimeUser = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding")
      if (hasSeenOnboarding === "true") {
        // Returning user - go to landing page
        setIsFirstTime(false)
        setIsLoading(false)
        router.replace("/Landing")
      } else {
        // First time user - show onboarding
        setIsFirstTime(true)
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error checking first time user:", error)
      setIsLoading(false)
    }
  }

  const setOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true")
    } catch (error) {
      console.error("Error setting onboarding complete:", error)
    }
  }

  const startInitialAnimations = () => {
    // Fade in the entire screen
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()

    // Logo animations
    Animated.parallel([
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start()

    // Bubble animations
    startBubbleAnimations()

    // Slide content animation
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 600,
      delay: 300,
      useNativeDriver: true,
    }).start()

    // Features animation
    setTimeout(() => {
      animateFeatures()
    }, 800)
  }

  const startBubbleAnimations = () => {
    const createBubbleAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 3000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      )
    }

    createBubbleAnimation(bubbleAnim1, 0).start()
    createBubbleAnimation(bubbleAnim2, 1000).start()
    createBubbleAnimation(bubbleAnim3, 2000).start()
  }

  const animateFeatures = () => {
    // Reset all feature animations
    featureAnimations.forEach((anim) => anim.setValue(0))

    // Animate features in sequence
    const animations = featureAnimations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 150,
        useNativeDriver: true,
      }),
    )

    Animated.stagger(150, animations).start()
  }

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width)
    if (slideIndex !== currentSlide) {
      setCurrentSlide(slideIndex)
    }
  }

  const goToSlide = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true })
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    if (currentSlide < onboardingData.length - 1) {
      goToSlide(currentSlide + 1)
    } else {
      handleGetStarted()
    }
  }

  const handleSkip = async () => {
    await setOnboardingComplete()
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.replace("/Landing")
    })
  }

  const handleGetStarted = async () => {
    await setOnboardingComplete()
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.replace("/Landing")
    })
  }

  const renderSlide = (item: any, index: number) => {
    const isActive = currentSlide === index

    return (
      <View key={item.id} style={styles.slide}>
        <LinearGradient colors={item.gradient} style={styles.slideGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          {/* Animated Decorative Bubbles */}
          <Animated.View
            style={[
              styles.bubble,
              styles.bubbleTop,
              {
                opacity: bubbleAnim1,
                transform: [
                  {
                    scale: bubbleAnim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.2],
                    }),
                  },
                  {
                    translateY: bubbleAnim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -20],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.bubble,
              styles.bubbleMiddle,
              {
                opacity: bubbleAnim2,
                transform: [
                  {
                    scale: bubbleAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1.1],
                    }),
                  },
                  {
                    translateX: bubbleAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 15],
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
                opacity: bubbleAnim3,
                transform: [
                  {
                    scale: bubbleAnim3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.8],
                    }),
                  },
                  {
                    translateY: bubbleAnim3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 10],
                    }),
                  },
                ],
              },
            ]}
          />

          <SafeAreaView style={styles.slideContent}>
            {/* Top Bar with Animated Logo */}
            <View style={styles.topBar}>
              <Animated.View
                style={[
                  styles.logoContainer,
                  {
                    transform: [
                      { scale: logoScaleAnim },
                      {
                        rotate: logoRotateAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0deg", "360deg"],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <LinearGradient
                  colors={["#FF4FC3", "#F72FDB", "#E91E63"]}
                  style={styles.logoGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.logoText}>PregWell</Text>
                  <View style={styles.logoIcon}>
                    <Ionicons name="heart" size={16} color="white" />
                  </View>
                </LinearGradient>
              </Animated.View>

              <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipText}>Skip</Text>
                <Ionicons name="arrow-forward" size={16} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Main Content with Slide Animation */}
            <Animated.View
              style={[
                styles.mainContent,
                {
                  opacity: slideAnim,
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {/* Image/Emoji Section with Pulse Effect */}
              <View style={styles.imageSection}>
                <Animated.View
                  style={[
                    styles.emojiContainer,
                    isActive && {
                      transform: [
                        {
                          scale: bubbleAnim1.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.05],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.emojiText}>{item.image}</Text>
                </Animated.View>
                <Animated.View
                  style={[
                    styles.decorativeRing,
                    isActive && {
                      transform: [
                        {
                          rotate: bubbleAnim1.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0deg", "360deg"],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              </View>

              {/* Text Content with Fade Animation */}
              <Animated.View
                style={[
                  styles.textContent,
                  {
                    opacity: slideAnim,
                  },
                ]}
              >
                <Text style={styles.slideTitle}>{item.title}</Text>
                <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
                <Text style={styles.slideDescription}>{item.description}</Text>

                {/* Features List with Staggered Animation */}
                <View style={styles.featuresContainer}>
                  {item.features.map((feature: any, featureIndex: number) => (
                    <Animated.View
                      key={featureIndex}
                      style={[
                        styles.featureItem,
                        {
                          opacity: featureAnimations[featureIndex],
                          transform: [
                            {
                              translateX: featureAnimations[featureIndex].interpolate({
                                inputRange: [0, 1],
                                outputRange: [100, 0],
                              }),
                            },
                            {
                              scale: featureAnimations[featureIndex].interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.8, 1],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      <Animated.View
                        style={[
                          styles.featureIcon,
                          {
                            transform: [
                              {
                                rotate: featureAnimations[featureIndex].interpolate({
                                  inputRange: [0, 1],
                                  outputRange: ["0deg", "360deg"],
                                }),
                              },
                            ],
                          },
                        ]}
                      >
                        <Ionicons name={feature.icon} size={20} color="#666" />
                      </Animated.View>
                      <Text style={styles.featureText}>{feature.text}</Text>
                    </Animated.View>
                  ))}
                </View>
              </Animated.View>
            </Animated.View>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
              {/* Animated Pagination Dots */}
              <View style={styles.pagination}>
                {onboardingData.map((_, dotIndex) => (
                  <TouchableOpacity
                    key={dotIndex}
                    style={[styles.paginationDot, currentSlide === dotIndex && styles.paginationDotActive]}
                    onPress={() => goToSlide(dotIndex)}
                  >
                    {currentSlide === dotIndex && (
                      <Animated.View
                        style={[
                          styles.paginationDotInner,
                          {
                            transform: [
                              {
                                scale: bubbleAnim1.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [1, 1.2],
                                }),
                              },
                            ],
                          },
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Navigation Buttons */}
              <View style={styles.navigationButtons}>
                {currentSlide > 0 && (
                  <Animated.View
                    style={{
                      opacity: slideAnim,
                      transform: [
                        {
                          translateX: slideAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-50, 0],
                          }),
                        },
                      ],
                    }}
                  >
                    <TouchableOpacity style={styles.backButton} onPress={() => goToSlide(currentSlide - 1)}>
                      <Ionicons name="chevron-back" size={20} color="#666" />
                      <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}

                <Animated.View
                  style={{
                    transform: [
                      {
                        scale: bubbleAnim1.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.02],
                        }),
                      },
                    ],
                  }}
                >
                  <TouchableOpacity style={styles.nextButton} onPress={nextSlide}>
                    <LinearGradient
                      colors={["#F48FB1", "#E91E63"]}
                      style={styles.nextButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.nextButtonText}>
                        {currentSlide === onboardingData.length - 1 ? "Get Started" : "Next"}
                      </Text>
                      <Ionicons name="chevron-forward" size={20} color="white" />
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient colors={["#FF4FC3", "#F72FDB"]} style={styles.loadingGradient}>
          <Animated.View
            style={[
              styles.loadingLogo,
              {
                transform: [{ scale: logoScaleAnim }],
              },
            ]}
          >
            <Text style={styles.loadingText}>PregWell</Text>
          </Animated.View>
        </LinearGradient>
      </View>
    )
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {onboardingData.map((item, index) => renderSlide(item, index))}
      </ScrollView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingLogo: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    height,
  },
  slideGradient: {
    flex: 1,
  },
  bubble: {
    position: "absolute",
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  bubbleTop: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
  },
  bubbleMiddle: {
    width: 150,
    height: 150,
    top: height * 0.3,
    left: -75,
  },
  bubbleBottom: {
    width: 120,
    height: 120,
    bottom: 100,
    right: -30,
  },
  slideContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    marginBottom: 20,
  },
  logoContainer: {
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  logoGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginRight: 8,
  },
  logoIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  skipText: {
    fontSize: 14,
    color: "#666",
    marginRight: 5,
    fontWeight: "500",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
  },
  imageSection: {
    alignItems: "center",
    marginBottom: 40,
    position: "relative",
  },
  emojiContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    zIndex: 2,
  },
  emojiText: {
    fontSize: 50,
  },
  decorativeRing: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderStyle: "dashed",
  },
  textContent: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 8,
  },
  slideSubtitle: {
    fontSize: 18,
    color: "#5D6D7E",
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "500",
  },
  slideDescription: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  featuresContainer: {
    width: "100%",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(244, 143, 177, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    color: "#2C3E50",
    fontWeight: "500",
    flex: 1,
  },
  bottomSection: {
    paddingBottom: 30,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  paginationDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E91E63",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  backButtonText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 5,
    fontWeight: "500",
  },
  nextButton: {
    borderRadius: 25,
    shadowColor: "#E91E63",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  nextButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  nextButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    marginRight: 8,
  },
})

export default WelcomeScreen
