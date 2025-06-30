"use client"

import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { Alert, Animated, Dimensions, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native"
import BackButton from "../components/BackButton"
import CustomButton from "../components/CustomButton"
import GradientBackground from "../components/GradientBackground"

const { width, height } = Dimensions.get("window")

const LogoutScreen = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const clearAllUserData = async () => {
    try {
      // Get all AsyncStorage keys
      const allKeys = await AsyncStorage.getAllKeys()

      // Define keys to keep (app-level settings that shouldn't be cleared)
      const keysToKeep = ["appVersion", "deviceId", "appLanguage", "systemSettings"]

      // Filter out keys to keep, clear everything else
      const keysToRemove = allKeys.filter((key) => !keysToKeep.includes(key))

      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove)
        console.log("✅ All user data cleared:", keysToRemove)
      }

      // Alternatively, you can specify exact keys to remove:
      const specificKeysToRemove = [
        "token",
        "refreshToken",
        "userId",
        "user",
        "profileCompleted",
        "bookmarkedTips",
        "hasSeenOnboarding",
        "emergencyContacts",
        "userPreferences",
        "pregnancyData",
        "healthData",
        "appointmentData",
        "notificationSettings",
        "lastLoginTime",
        "sessionData",
        "cachedUserData",
      ]

      await AsyncStorage.multiRemove(specificKeysToRemove)
      console.log("✅ Specific user data cleared")
    } catch (error) {
      console.error("❌ Error clearing user data:", error)
      throw error
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      try {
        // Clear all user data
        await clearAllUserData()

        // Small delay to ensure data is cleared
        await new Promise((resolve) => setTimeout(resolve, 500))

        console.log("✅ Logout successful. Redirecting to login...")

        // Use replace to prevent going back to authenticated screens
        // This clears the navigation stack and prevents back navigation
        router.replace("/login")

        // Alternative: If you want to completely reset the navigation stack
        router.dismissAll();
        router.replace("/login");
      } catch (error) {
        console.error("❌ Logout error:", error)
        setIsLoggingOut(false)

        // Reset animations on error
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start()

        Alert.alert("Logout Error", "Could not complete logout. Please try again.", [{ text: "OK" }])
      }
    })
  }

  const handleCancel = () => {
    if (isLoggingOut) return // Prevent cancel during logout

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.back()
    })
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <GradientBackground>
        <SafeAreaView style={styles.safeArea}>
          <BackButton disabled={isLoggingOut} />
          <View style={styles.container}>
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
                },
              ]}
            >
              <LinearGradient colors={["#FF6B6B", "#FF8E8E"]} style={styles.iconGradient}>
                <Ionicons name="log-out-outline" size={40} color="white" />
              </LinearGradient>
            </Animated.View>

            <Animated.Text
              style={[
                styles.title,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              Sign Out
            </Animated.Text>

            <Animated.View
              style={[
                styles.contentContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.warningIconContainer}>
                <Ionicons name="alert-circle-outline" size={24} color="#FF6B6B" />
              </View>

              <Text style={styles.message}>
                {isLoggingOut ? "Signing you out..." : "Are you sure you want to sign out?"}
              </Text>
              <Text style={styles.subMessage}>
                {isLoggingOut
                  ? "Clearing your data and returning to login screen"
                  : "All your data will be cleared and you'll need to sign in again"}
              </Text>

              {!isLoggingOut && (
                <View style={styles.buttonContainer}>
                  <CustomButton
                    title="Cancel"
                    onPress={handleCancel}
                    secondary
                    style={styles.cancelButton}
                    textStyle={styles.cancelButtonText}
                  />
                  <CustomButton
                    title="Sign Out"
                    onPress={handleLogout}
                    style={styles.logoutButton}
                    textStyle={styles.logoutButtonText}
                  />
                </View>
              )}

              {isLoggingOut && (
                <View style={styles.loadingContainer}>
                  <Animated.View style={styles.loadingSpinner}>
                    <Ionicons name="refresh" size={24} color="#FF6B6B" />
                  </Animated.View>
                </View>
              )}
            </Animated.View>

            <Animated.View style={[styles.decorativeCircle1, { opacity: fadeAnim }]} />
            <Animated.View style={[styles.decorativeCircle2, { opacity: fadeAnim }]} />
          </View>
        </SafeAreaView>
      </GradientBackground>
    </>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  iconContainer: {
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 40,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  contentContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 25,
    padding: 30,
    width: "100%",
    maxWidth: 350,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    minHeight: 200,
  },
  warningIconContainer: {
    marginBottom: 15,
  },
  message: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
    color: "#2C3E50",
    lineHeight: 28,
  },
  subMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 30,
    color: "#7F8C8D",
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderWidth: 2,
    borderColor: "#E9ECEF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cancelButtonText: {
    color: "#6C757D",
    fontWeight: "600",
  },
  logoutButton: {
    flex: 1,
    backgroundColor: "#FF6B6B",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingSpinner: {
    padding: 10,
  },
  decorativeCircle1: {
    position: "absolute",
    top: height * 0.1,
    right: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: height * 0.15,
    left: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(222, 216, 216, 0.45)",
  },
})

export default LogoutScreen
