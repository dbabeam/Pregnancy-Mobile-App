"use client"

import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
import {
    Alert,
    Animated,
    Dimensions,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native"

const { width, height } = Dimensions.get("window")

interface PrivacySettings {
  profileVisibility: boolean
  dataSharing: boolean
  analyticsTracking: boolean
  locationServices: boolean
  pushNotifications: boolean
  emailMarketing: boolean
  thirdPartySharing: boolean
  dataExport: boolean
  accountDeletion: boolean
}

export default function PrivacySettings() {
  const router = useRouter()
  
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: true,
    dataSharing: false,
    analyticsTracking: true,
    locationServices: false,
    pushNotifications: true,
    emailMarketing: false,
    thirdPartySharing: false,
    dataExport: true,
    accountDeletion: true,
  })

  const [loading, setLoading] = useState(false)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const cardAnimations = useRef(
    Array.from({ length: 6 }, () => new Animated.Value(0))
  ).current

  useEffect(() => {
    startAnimations()
  }, [])

  const startAnimations = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start()

    cardAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: 200 + (index * 100),
        useNativeDriver: true,
      }).start()
    })
  }

  const updateSetting = (key: keyof PrivacySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      Alert.alert("Success", "Your privacy settings have been updated!")
    }, 1500)
  }

  const handleDataExport = () => {
    Alert.alert(
      "Export Data",
      "We'll prepare your data and send you a download link via email within 24 hours.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Request Export", onPress: () => Alert.alert("Export Requested", "You'll receive an email with your data export link.") }
      ]
    )
  }

  const handleViewPrivacyPolicy = () => {
    Alert.alert("Privacy Policy", "This would open the full privacy policy document.")
  }

  const handleViewTerms = () => {
    Alert.alert("Terms of Service", "This would open the terms of service document.")
  }

  const renderAnimatedCard = (index: number, children: React.ReactNode) => (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: cardAnimations[index],
          transform: [{
            translateY: cardAnimations[index].interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            })
          }]
        }
      ]}
    >
      {children}
    </Animated.View>
  )

  const renderPrivacyOverview = () => (
    <Animated.View 
      style={[
        styles.overviewCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.overviewGradient}>
        <Ionicons name="shield-checkmark" size={40} color="white" />
        <Text style={styles.overviewTitle}>Your Privacy Matters</Text>
        <Text style={styles.overviewDescription}>
          Control how your data is used and shared. We're committed to protecting your privacy during your pregnancy journey.
        </Text>
      </LinearGradient>
    </Animated.View>
  )

  const renderDataCollection = () => (
    renderAnimatedCard(0,
      <View>
        <View style={styles.cardHeader}>
          <Ionicons name="analytics-outline" size={24} color="#4ECDC4" />
          <Text style={styles.cardTitle}>Data Collection</Text>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Analytics Tracking</Text>
            <Text style={styles.settingDescription}>
              Help us improve the app by sharing anonymous usage data
            </Text>
          </View>
          <Switch
            value={settings.analyticsTracking}
            onValueChange={(value) => updateSetting('analyticsTracking', value)}
            trackColor={{ false: "#E0E0E0", true: "#4ECDC4" }}
            thumbColor={settings.analyticsTracking ? "white" : "#f4f3f4"}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Location Services</Text>
            <Text style={styles.settingDescription}>
              Allow location access for nearby healthcare providers
            </Text>
          </View>
          <Switch
            value={settings.locationServices}
            onValueChange={(value) => updateSetting('locationServices', value)}
            trackColor={{ false: "#E0E0E0", true: "#4ECDC4" }}
            thumbColor={settings.locationServices ? "white" : "#f4f3f4"}
          />
        </View>
      </View>
    )
  )

  const renderDataSharing = () => (
    renderAnimatedCard(1,
      <View>
        <View style={styles.cardHeader}>
          <Ionicons name="share-outline" size={24} color="#FF6B9D" />
          <Text style={styles.cardTitle}>Data Sharing</Text>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Profile Visibility</Text>
            <Text style={styles.settingDescription}>
              Allow other users to see your profile in community features
            </Text>
          </View>
          <Switch
            value={settings.profileVisibility}
            onValueChange={(value) => updateSetting('profileVisibility', value)}
            trackColor={{ false: "#E0E0E0", true: "#FF6B9D" }}
            thumbColor={settings.profileVisibility ? "white" : "#f4f3f4"}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Data Sharing with Partners</Text>
            <Text style={styles.settingDescription}>
              Share anonymized data with healthcare research partners
            </Text>
          </View>
          <Switch
            value={settings.dataSharing}
            onValueChange={(value) => updateSetting('dataSharing', value)}
            trackColor={{ false: "#E0E0E0", true: "#FF6B9D" }}
            thumbColor={settings.dataSharing ? "white" : "#f4f3f4"}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Third-Party Sharing</Text>
            <Text style={styles.settingDescription}>
              Allow sharing data with trusted third-party services
            </Text>
          </View>
          <Switch
            value={settings.thirdPartySharing}
            onValueChange={(value) => updateSetting('thirdPartySharing', value)}
            trackColor={{ false: "#E0E0E0", true: "#FF6B9D" }}
            thumbColor={settings.thirdPartySharing ? "white" : "#f4f3f4"}
          />
        </View>
      </View>
    )
  )

  const renderCommunications = () => (
    renderAnimatedCard(2,
      <View>
        <View style={styles.cardHeader}>
          <Ionicons name="notifications-outline" size={24} color="#9C27B0" />
          <Text style={styles.cardTitle}>Communications</Text>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive important updates and reminders
            </Text>
          </View>
          <Switch
            value={settings.pushNotifications}
            onValueChange={(value) => updateSetting('pushNotifications', value)}
            trackColor={{ false: "#E0E0E0", true: "#9C27B0" }}
            thumbColor={settings.pushNotifications ? "white" : "#f4f3f4"}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Marketing Emails</Text>
            <Text style={styles.settingDescription}>
              Receive promotional content and pregnancy tips
            </Text>
          </View>
          <Switch
            value={settings.emailMarketing}
            onValueChange={(value) => updateSetting('emailMarketing', value)}
            trackColor={{ false: "#E0E0E0", true: "#9C27B0" }}
            thumbColor={settings.emailMarketing ? "white" : "#f4f3f4"}
          />
        </View>
      </View>
    )
  )

  const renderDataRights = () => (
    renderAnimatedCard(3,
      <View>
        <View style={styles.cardHeader}>
          <Ionicons name="document-text-outline" size={24} color="#FFA726" />
          <Text style={styles.cardTitle}>Your Data Rights</Text>
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={handleDataExport} activeOpacity={0.7}>
          <Ionicons name="download-outline" size={20} color="#FFA726" />
          <Text style={styles.actionButtonText}>Export My Data</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Ionicons name="trash-outline" size={20} color="#FFA726" />
          <Text style={styles.actionButtonText}>Request Data Deletion</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Ionicons name="create-outline" size={20} color="#FFA726" />
          <Text style={styles.actionButtonText}>Correct My Information</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    )
  )

  const renderLegalDocuments = () => (
    renderAnimatedCard(4,
      <View>
        <View style={styles.cardHeader}>
          <Ionicons name="library-outline" size={24} color="#45B7D1" />
          <Text style={styles.cardTitle}>Legal Documents</Text>
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={handleViewPrivacyPolicy} activeOpacity={0.7}>
          <Ionicons name="shield-outline" size={20} color="#45B7D1" />
          <Text style={styles.actionButtonText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleViewTerms} activeOpacity={0.7}>
          <Ionicons name="document-outline" size={20} color="#45B7D1" />
          <Text style={styles.actionButtonText}>Terms of Service</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Ionicons name="information-circle-outline" size={20} color="#45B7D1" />
          <Text style={styles.actionButtonText}>Cookie Policy</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    )
  )

  const renderSaveButton = () => (
    renderAnimatedCard(5,
      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={handleSaveSettings}
        disabled={loading}
        activeOpacity={0.8}
      >
        <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.saveButtonGradient}>
          <Text style={styles.saveButtonText}>
            {loading ? "Saving..." : "Save Privacy Settings"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    )
  )

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.gradient}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Privacy Settings</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {renderPrivacyOverview()}
            {renderDataCollection()}
            {renderDataSharing()}
            {renderCommunications()}
            {renderDataRights()}
            {renderLegalDocuments()}
            {renderSaveButton()}

            <View style={styles.bottomSpacing} />
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
  gradient: {
    flex: 1,
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
    paddingBottom: 20,
  },
  overviewCard: {
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  overviewGradient: {
    borderRadius: 25,
    padding: 30,
    alignItems: "center",
  },
  overviewTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 15,
    marginBottom: 10,
    textAlign: "center",
  },
  overviewDescription: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginLeft: 10,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#7F8C8D",
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  actionButtonText: {
    fontSize: 16,
    color: "#2C3E50",
    marginLeft: 15,
    flex: 1,
  },
  saveButton: {
    borderRadius: 15,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  saveButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  bottomSpacing: {
    height: 20,
  },
})