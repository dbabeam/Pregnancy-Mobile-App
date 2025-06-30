"use client"

import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

const { width, height } = Dimensions.get("window")

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  dueDate: string
  profileImage?: string
  emergencyContact: string
  doctorName: string
  hospitalName: string
}

export default function AccountSettings() {
  const router = useRouter()
  
  // User profile state
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    dueDate: "2024-08-15",
    emergencyContact: "+1 (555) 987-6543",
    doctorName: "Dr. Emily Chen",
    hospitalName: "City General Hospital",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [appointmentReminders, setAppointmentReminders] = useState(true)

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

  const handleSave = async () => {
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setIsEditing(false)
      Alert.alert("Success", "Your profile has been updated successfully!")
    }, 1500)
  }

  const handleChangePassword = () => {
    Alert.alert(
      "Change Password",
      "You will receive an email with instructions to reset your password.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Send Email", onPress: () => Alert.alert("Email Sent", "Check your inbox for password reset instructions.") }
      ]
    )
  }

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => Alert.alert("Account Deleted", "Your account has been scheduled for deletion.")
        }
      ]
    )
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

  const renderProfileHeader = () => (
    <Animated.View 
      style={[
        styles.profileHeader,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.profileImageContainer}>
        <View style={styles.profileImageWrapper}>
          {profile.profileImage ? (
            <Image source={{ uri: profile.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" size={40} color="#9C27B0" />
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.editImageButton} activeOpacity={0.7}>
          <Ionicons name="camera" size={16} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.profileName}>{profile.firstName} {profile.lastName}</Text>
      <Text style={styles.profileEmail}>{profile.email}</Text>
    </Animated.View>
  )

  const renderPersonalInfo = () => (
    renderAnimatedCard(0,
      <View>
        <View style={styles.cardHeader}>
          <Ionicons name="person-outline" size={24} color="#9C27B0" />
          <Text style={styles.cardTitle}>Personal Information</Text>
          <TouchableOpacity 
            onPress={() => setIsEditing(!isEditing)}
            style={styles.editButton}
            activeOpacity={0.7}
          >
            <Ionicons name={isEditing ? "close" : "pencil"} size={20} color="#9C27B0" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profile.firstName}
              onChangeText={(text) => setProfile({...profile, firstName: text})}
              editable={isEditing}
              placeholder="First Name"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profile.lastName}
              onChangeText={(text) => setProfile({...profile, lastName: text})}
              editable={isEditing}
              placeholder="Last Name"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profile.email}
            onChangeText={(text) => setProfile({...profile, email: text})}
            editable={isEditing}
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profile.phone}
            onChangeText={(text) => setProfile({...profile, phone: text})}
            editable={isEditing}
            placeholder="Phone Number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Due Date</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profile.dueDate}
            onChangeText={(text) => setProfile({...profile, dueDate: text})}
            editable={isEditing}
            placeholder="YYYY-MM-DD"
          />
        </View>

        {isEditing && (
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient colors={["#9C27B0", "#7B1FA2"]} style={styles.saveButtonGradient}>
              <Text style={styles.saveButtonText}>
                {loading ? "Saving..." : "Save Changes"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    )
  )

  const renderMedicalInfo = () => (
    renderAnimatedCard(1,
      <View>
        <View style={styles.cardHeader}>
          <Ionicons name="medical-outline" size={24} color="#4ECDC4" />
          <Text style={styles.cardTitle}>Medical Information</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Doctor's Name</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profile.doctorName}
            onChangeText={(text) => setProfile({...profile, doctorName: text})}
            editable={isEditing}
            placeholder="Doctor's Name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Hospital/Clinic</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profile.hospitalName}
            onChangeText={(text) => setProfile({...profile, hospitalName: text})}
            editable={isEditing}
            placeholder="Hospital or Clinic Name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Emergency Contact</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={profile.emergencyContact}
            onChangeText={(text) => setProfile({...profile, emergencyContact: text})}
            editable={isEditing}
            placeholder="Emergency Contact Number"
            keyboardType="phone-pad"
          />
        </View>
      </View>
    )
  )

  const renderNotificationSettings = () => (
    renderAnimatedCard(2,
      <View>
        <View style={styles.cardHeader}>
          <Ionicons name="notifications-outline" size={24} color="#FF6B9D" />
          <Text style={styles.cardTitle}>Notification Preferences</Text>
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchLabel}>Email Notifications</Text>
            <Text style={styles.switchDescription}>Receive updates via email</Text>
          </View>
          <Switch
            value={emailNotifications}
            onValueChange={setEmailNotifications}
            trackColor={{ false: "#E0E0E0", true: "#9C27B0" }}
            thumbColor={emailNotifications ? "white" : "#f4f3f4"}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchLabel}>Appointment Reminders</Text>
            <Text style={styles.switchDescription}>Get reminded about upcoming appointments</Text>
          </View>
          <Switch
            value={appointmentReminders}
            onValueChange={setAppointmentReminders}
            trackColor={{ false: "#E0E0E0", true: "#9C27B0" }}
            thumbColor={appointmentReminders ? "white" : "#f4f3f4"}
          />
        </View>
      </View>
    )
  )

  const renderSecuritySettings = () => (
    renderAnimatedCard(3,
      <View>
        <View style={styles.cardHeader}>
          <Ionicons name="shield-checkmark-outline" size={24} color="#FFA726" />
          <Text style={styles.cardTitle}>Security</Text>
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword} activeOpacity={0.7}>
          <Ionicons name="key-outline" size={20} color="#FFA726" />
          <Text style={styles.actionButtonText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Ionicons name="finger-print-outline" size={20} color="#FFA726" />
          <Text style={styles.actionButtonText}>Enable Biometric Login</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    )
  )

  const renderDangerZone = () => (
    renderAnimatedCard(4,
      <View>
        <View style={styles.cardHeader}>
          <Ionicons name="warning-outline" size={24} color="#FF5722" />
          <Text style={[styles.cardTitle, { color: "#FF5722" }]}>Danger Zone</Text>
        </View>

        <TouchableOpacity 
          style={[styles.actionButton, styles.dangerButton]} 
          onPress={handleDeleteAccount}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={20} color="#FF5722" />
          <Text style={[styles.actionButtonText, { color: "#FF5722" }]}>Delete Account</Text>
          <Ionicons name="chevron-forward" size={20} color="#FF5722" />
        </TouchableOpacity>
      </View>
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
            <Text style={styles.headerTitle}>Account Settings</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {renderProfileHeader()}
            {renderPersonalInfo()}
            {renderMedicalInfo()}
            {renderNotificationSettings()}
            {renderSecuritySettings()}
            {renderDangerZone()}

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
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 25,
    padding: 25,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 15,
  },
  profileImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  profileImagePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#9C27B0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
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
    flex: 1,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  inputRow: {
    flexDirection: "row",
    gap: 15,
  },
  inputContainer: {
    marginBottom: 15,
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#2C3E50",
    backgroundColor: "white",
  },
  inputDisabled: {
    backgroundColor: "#F8F9FA",
    color: "#7F8C8D",
  },
  saveButton: {
    marginTop: 10,
    borderRadius: 12,
    shadowColor: "#9C27B0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  switchInfo: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 2,
  },
  switchDescription: {
    fontSize: 14,
    color: "#7F8C8D",
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
  dangerButton: {
    borderBottomColor: "#FFE5E5",
  },
  bottomSpacing: {
    height: 20,
  },
})