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

const { width, height } = Dimensions.get("window")

interface PregnancyData {
  currentWeek: number
  weeksRemaining: number
  trimester: number
  babySize: string
  babySizeComparison: string
  precautions: string[]
  symptoms: string[]
  tips: string[]
}

// Sample pregnancy data - in real app, this would come from your backend
const getPregnancyData = (week: number): PregnancyData => {
  const weeksRemaining = Math.max(0, 40 - week)
  const trimester = week <= 12 ? 1 : week <= 27 ? 2 : 3
  
  // Sample data based on pregnancy week
  const pregnancyInfo: { [key: number]: Partial<PregnancyData> } = {
    8: {
      babySize: "0.6 inches",
      babySizeComparison: "Size of a raspberry",
      precautions: [
        "Take prenatal vitamins daily",
        "Avoid alcohol and smoking",
        "Limit caffeine intake",
        "Get adequate rest",
        "Stay hydrated"
      ],
      symptoms: ["Morning sickness", "Fatigue", "Breast tenderness", "Frequent urination"],
      tips: ["Eat small, frequent meals", "Get plenty of sleep", "Start gentle exercise"]
    },
    12: {
      babySize: "2.1 inches",
      babySizeComparison: "Size of a lime",
      precautions: [
        "Continue prenatal vitamins",
        "Schedule first trimester screening",
        "Avoid raw fish and undercooked meat",
        "Maintain good hygiene",
        "Monitor weight gain"
      ],
      symptoms: ["Reduced morning sickness", "Increased energy", "Visible baby bump"],
      tips: ["Start telling family and friends", "Consider maternity clothes", "Stay active"]
    },
    20: {
      babySize: "6.5 inches",
      babySizeComparison: "Size of a banana",
      precautions: [
        "Schedule anatomy scan",
        "Monitor fetal movements",
        "Maintain healthy diet",
        "Avoid sleeping on back",
        "Wear comfortable shoes"
      ],
      symptoms: ["Feeling baby movements", "Growing belly", "Back pain", "Heartburn"],
      tips: ["Start prenatal classes", "Plan nursery", "Practice relaxation techniques"]
    },
    28: {
      babySize: "14.8 inches",
      babySizeComparison: "Size of an eggplant",
      precautions: [
        "Monitor blood pressure",
        "Watch for preeclampsia signs",
        "Get glucose screening test",
        "Count fetal movements daily",
        "Prepare birth plan"
      ],
      symptoms: ["Shortness of breath", "Swollen feet", "Braxton Hicks contractions"],
      tips: ["Pack hospital bag", "Install car seat", "Practice breathing exercises"]
    },
    36: {
      babySize: "18.7 inches",
      babySizeComparison: "Size of a romaine lettuce",
      precautions: [
        "Weekly doctor visits",
        "Monitor contractions",
        "Watch for labor signs",
        "Avoid travel",
        "Rest frequently"
      ],
      symptoms: ["Pelvic pressure", "Frequent urination", "Difficulty sleeping"],
      tips: ["Finalize birth plan", "Prepare for breastfeeding", "Rest as much as possible"]
    }
  }

  // Find closest week data or use default
  const closestWeek = Object.keys(pregnancyInfo)
    .map(Number)
    .reduce((prev, curr) => Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev)

  const data = pregnancyInfo[closestWeek] || {}

  return {
    currentWeek: week,
    weeksRemaining,
    trimester,
    babySize: data.babySize || "Growing",
    babySizeComparison: data.babySizeComparison || "Your little miracle",
    precautions: data.precautions || ["Consult your healthcare provider"],
    symptoms: data.symptoms || ["Every pregnancy is unique"],
    tips: data.tips || ["Take care of yourself"],
  }
}

export default function Tracker() {
  const router = useRouter()
  
  // In real app, get this from user data/backend
  const [currentWeek] = useState(20) // Example: 20 weeks pregnant
  const [pregnancyData, setPregnancyData] = useState<PregnancyData>(getPregnancyData(currentWeek))

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const progressAnim = useRef(new Animated.Value(0)).current
  const cardAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current

  useEffect(() => {
    setPregnancyData(getPregnancyData(currentWeek))
    startAnimations()
  }, [currentWeek])

  const startAnimations = () => {
    // Main fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()

    // Content slide up
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start()

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: currentWeek / 40,
      duration: 1500,
      delay: 500,
      useNativeDriver: false,
    }).start()

    // Staggered card animations
    cardAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: 800 + (index * 200),
        useNativeDriver: true,
      }).start()
    })
  }

  const getProgressColor = () => {
    if (pregnancyData.trimester === 1) return "#FF6B9D"
    if (pregnancyData.trimester === 2) return "#4ECDC4"
    return "#45B7D1"
  }

  const getTrimesterInfo = () => {
    const trimesterData = {
      1: { name: "First Trimester", color: "#FF6B9D", weeks: "1-12 weeks" },
      2: { name: "Second Trimester", color: "#4ECDC4", weeks: "13-27 weeks" },
      3: { name: "Third Trimester", color: "#45B7D1", weeks: "28-40 weeks" },
    }
    return trimesterData[pregnancyData.trimester as keyof typeof trimesterData]
  }

  const renderProgressCard = () => (
    <Animated.View 
      style={[
        styles.progressCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <LinearGradient
        colors={[getProgressColor(), `${getProgressColor()}CC`]}
        style={styles.progressCardGradient}
      >
        <View style={styles.progressHeader}>
          <View style={styles.weekBadge}>
            <Text style={styles.weekBadgeText}>Week {pregnancyData.currentWeek}</Text>
          </View>
          <View style={styles.trimesterInfo}>
            <Text style={styles.trimesterText}>{getTrimesterInfo().name}</Text>
            <Text style={styles.trimesterWeeks}>{getTrimesterInfo().weeks}</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Pregnancy Progress</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {pregnancyData.currentWeek} of 40 weeks
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{pregnancyData.weeksRemaining}</Text>
              <Text style={styles.statLabel}>Weeks to go</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{Math.round((pregnancyData.currentWeek / 40) * 100)}%</Text>
              <Text style={styles.statLabel}>Complete</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  )

  const renderBabyCard = () => (
    <Animated.View 
      style={[
        styles.infoCard,
        {
          opacity: cardAnimations[0],
          transform: [{ 
            translateY: cardAnimations[0].interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            })
          }]
        }
      ]}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="heart" size={24} color="#FF6B9D" />
        <Text style={styles.cardTitle}>Your Baby This Week</Text>
      </View>
      <View style={styles.babyInfo}>
        <Text style={styles.babySizeText}>{pregnancyData.babySize}</Text>
        <Text style={styles.babyComparisonText}>{pregnancyData.babySizeComparison}</Text>
      </View>
    </Animated.View>
  )

  const renderPrecautionsCard = () => (
    <Animated.View 
      style={[
        styles.infoCard,
        {
          opacity: cardAnimations[1],
          transform: [{ 
            translateY: cardAnimations[1].interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            })
          }]
        }
      ]}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="shield-checkmark" size={24} color="#4ECDC4" />
        <Text style={styles.cardTitle}>Important Precautions</Text>
      </View>
      <View style={styles.listContainer}>
        {pregnancyData.precautions.map((precaution, index) => (
          <View key={index} style={styles.listItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
            <Text style={styles.listItemText}>{precaution}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  )

  const renderSymptomsCard = () => (
    <Animated.View 
      style={[
        styles.infoCard,
        {
          opacity: cardAnimations[2],
          transform: [{ 
            translateY: cardAnimations[2].interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            })
          }]
        }
      ]}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="body" size={24} color="#FFA726" />
        <Text style={styles.cardTitle}>Common Symptoms</Text>
      </View>
      <View style={styles.listContainer}>
        {pregnancyData.symptoms.map((symptom, index) => (
          <View key={index} style={styles.listItem}>
            <Ionicons name="ellipse" size={8} color="#FFA726" />
            <Text style={styles.listItemText}>{symptom}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  )

  const renderTipsCard = () => (
    <Animated.View 
      style={[
        styles.infoCard,
        {
          opacity: cardAnimations[3],
          transform: [{ 
            translateY: cardAnimations[3].interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            })
          }]
        }
      ]}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="bulb" size={24} color="#9C27B0" />
        <Text style={styles.cardTitle}>Helpful Tips</Text>
      </View>
      <View style={styles.listContainer}>
        {pregnancyData.tips.map((tip, index) => (
          <View key={index} style={styles.listItem}>
            <Ionicons name="star" size={14} color="#9C27B0" />
            <Text style={styles.listItemText}>{tip}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
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
            <Text style={styles.headerTitle}>Pregnancy Tracker</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {renderProgressCard()}
            {renderBabyCard()}
            {renderPrecautionsCard()}
            {renderSymptomsCard()}
            {renderTipsCard()}

            {/* Bottom spacing */}
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
  progressCard: {
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  progressCardGradient: {
    borderRadius: 25,
    padding: 25,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  weekBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  weekBadgeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  trimesterInfo: {
    alignItems: "flex-end",
  },
  trimesterText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  trimesterWeeks: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  progressSection: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
    textAlign: "center",
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 6,
    marginBottom: 10,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginLeft: 10,
  },
  babyInfo: {
    alignItems: "center",
    paddingVertical: 10,
  },
  babySizeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B9D",
    marginBottom: 5,
  },
  babyComparisonText: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
  },
  listContainer: {
    gap: 12,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingRight: 10,
  },
  listItemText: {
    fontSize: 15,
    color: "#2C3E50",
    marginLeft: 10,
    flex: 1,
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 20,
  },
})