import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get('window');

// Sample data for exercise tracking
const weeklyGoals = {
  workouts: { current: 3, target: 4, unit: "sessions" },
  minutes: { current: 90, target: 150, unit: "min" },
  steps: { current: 6500, target: 8000, unit: "steps" },
  calories: { current: 280, target: 400, unit: "kcal" },
};

const exerciseCategories = [
  {
    id: "1",
    name: "Prenatal Yoga",
    description: "Gentle stretches and breathing",
    duration: "20-30 min",
    difficulty: "Beginner",
    icon: "body-outline",
    color: "#9C27B0",
    image: require("../assets/images/yoga.png"),
    exercises: 8,
  },
  {
    id: "2",
    name: "Walking",
    description: "Low-impact cardio exercise",
    duration: "30-45 min",
    difficulty: "Easy",
    icon: "walk-outline",
    color: "#4CAF50",
    image: require("../assets/images/walking.png"),
    exercises: 5,
  },
  {
    id: "3",
    name: "Swimming",
    description: "Full-body water exercise",
    duration: "30-40 min",
    difficulty: "Moderate",
    icon: "water-outline",
    color: "#2196F3",
    image: require("../assets/images/swimming.png"),
    exercises: 6,
  },
  {
    id: "4",
    name: "Strength Training",
    description: "Light weights and resistance",
    duration: "25-35 min",
    difficulty: "Intermediate",
    icon: "fitness-outline",
    color: "#FF9800",
    image: require("../assets/images/strength.png"),
    exercises: 10,
  },
  {
    id: "5",
    name: "Pelvic Floor",
    description: "Core and pelvic exercises",
    duration: "15-20 min",
    difficulty: "Beginner",
    icon: "heart-outline",
    color: "#E91E63",
    image: require("../assets/images/pelvic.png"),
    exercises: 7,
  },
  {
    id: "6",
    name: "Breathing",
    description: "Relaxation and breathing techniques",
    duration: "10-15 min",
    difficulty: "Easy",
    icon: "leaf-outline",
    color: "#00BCD4",
    image: require("../assets/images/breathing.png"),
    exercises: 4,
  },
];

const todayWorkouts = [
  {
    id: "1",
    name: "Morning Prenatal Yoga",
    time: "7:00 AM",
    duration: "25 min",
    type: "Yoga",
    completed: true,
    color: "#9C27B0",
  },
  {
    id: "2",
    name: "Evening Walk",
    time: "6:00 PM",
    duration: "30 min",
    type: "Cardio",
    completed: false,
    color: "#4CAF50",
  },
  {
    id: "3",
    name: "Pelvic Floor Exercises",
    time: "8:30 PM",
    duration: "15 min",
    type: "Strength",
    completed: false,
    color: "#E91E63",
  },
];

const safetyTips = [
  {
    id: "1",
    tip: "Stay hydrated throughout your workout",
    icon: "water",
    color: "#2196F3",
  },
  {
    id: "2",
    tip: "Avoid exercises lying flat on your back after first trimester",
    icon: "warning",
    color: "#FF9800",
  },
  {
    id: "3",
    tip: "Stop if you feel dizzy, short of breath, or have chest pain",
    icon: "medical",
    color: "#F44336",
  },
  {
    id: "4",
    tip: "Listen to your body and rest when needed",
    icon: "heart",
    color: "#E91E63",
  },
];

const achievements = [
  {
    id: "1",
    title: "First Week Complete",
    description: "Completed your first week of prenatal exercise",
    icon: "trophy",
    color: "#FFD700",
    unlocked: true,
  },
  {
    id: "2",
    title: "Yoga Master",
    description: "Completed 10 yoga sessions",
    icon: "medal",
    color: "#9C27B0",
    unlocked: true,
  },
  {
    id: "3",
    title: "Walking Champion",
    description: "Walk 10,000 steps in a day",
    icon: "walk",
    color: "#4CAF50",
    unlocked: false,
  },
  {
    id: "4",
    title: "Consistency Queen",
    description: "Exercise 4 times a week for a month",
    icon: "calendar",
    color: "#FF9800",
    unlocked: false,
  },
];

const ExercisesScreen = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("overview");

  const renderGoalCard = (key, goal) => {
    const percentage = (goal.current / goal.target) * 100;
    
    return (
      <View key={key} style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalTitle}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
          <Text style={styles.goalValue}>
            {goal.current}/{goal.target} {goal.unit}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <LinearGradient
              colors={percentage >= 100 ? ["#4CAF50", "#66BB6A"] : ["#9C27B0", "#BA68C8"]}
              style={[styles.progressBarFill, { width: `${Math.min(percentage, 100)}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{Math.round(percentage)}%</Text>
        </View>
      </View>
    );
  };

  const renderExerciseCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <LinearGradient
        colors={[`${item.color}15`, `${item.color}05`]}
        style={styles.categoryGradient}
      >
        <Image source={item.image} style={styles.categoryImage} />
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{item.name}</Text>
          <Text style={styles.categoryDescription}>{item.description}</Text>
          <View style={styles.categoryDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={14} color="#7F8C8D" />
              <Text style={styles.detailText}>{item.duration}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="fitness-outline" size={14} color="#7F8C8D" />
              <Text style={styles.detailText}>{item.difficulty}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="list-outline" size={14} color="#7F8C8D" />
              <Text style={styles.detailText}>{item.exercises} exercises</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={[styles.playButton, { backgroundColor: item.color }]}>
          <Ionicons name="play" size={20} color="white" />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderTodayWorkout = ({ item }) => (
    <TouchableOpacity style={styles.workoutCard}>
      <LinearGradient
        colors={item.completed ? ["#E8F5E8", "#F1F8E9"] : ["#FFF", "#FAFAFA"]}
        style={styles.workoutGradient}
      >
        <View style={styles.workoutHeader}>
          <View style={[styles.workoutIcon, { backgroundColor: `${item.color}15` }]}>
            <Ionicons 
              name={item.completed ? "checkmark-circle" : "time-outline"} 
              size={24} 
              color={item.completed ? "#4CAF50" : item.color} 
            />
          </View>
          <View style={styles.workoutInfo}>
            <Text style={styles.workoutName}>{item.name}</Text>
            <Text style={styles.workoutTime}>{item.time} • {item.duration}</Text>
            <Text style={[styles.workoutType, { color: item.color }]}>{item.type}</Text>
          </View>
          <TouchableOpacity style={styles.workoutAction}>
            <Ionicons 
              name={item.completed ? "checkmark-circle" : "play-circle"} 
              size={28} 
              color={item.completed ? "#4CAF50" : item.color} 
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
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
            <Text style={styles.headerTitle}>Exercise & Fitness</Text>
            <TouchableOpacity style={styles.timerButton}>
              <Ionicons name="timer" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.headerSubtitle}>
            <Ionicons name="fitness" size={20} color="white" style={styles.headerIcon} />
            <Text style={styles.subtitleText}>
              Stay active and healthy during pregnancy
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {["overview", "workouts", "safety", "achievements"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                selectedTab === tab && styles.tabButtonActive
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text 
                style={[
                  styles.tabButtonText,
                  selectedTab === tab && styles.tabButtonTextActive
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === "overview" && (
          <>
            {/* Weekly Goals */}
            <View style={styles.goalsSection}>
              <Text style={styles.sectionTitle}>This Week's Goals</Text>
              <View style={styles.goalsGrid}>
                {Object.entries(weeklyGoals).map(([key, goal]) => 
                  renderGoalCard(key, goal)
                )}
              </View>
            </View>

            {/* Today's Workouts */}
            <View style={styles.todaySection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today's Schedule</Text>
                <TouchableOpacity style={styles.addWorkoutButton}>
                  <Ionicons name="add-circle" size={24} color="#9C27B0" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={todayWorkouts}
                renderItem={renderTodayWorkout}
                keyExtractor={item => item.id}
                scrollEnabled={false}
              />
            </View>

            {/* Quick Stats */}
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>This Week</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <LinearGradient colors={["#E8F5E8", "#F1F8E9"]} style={styles.statGradient}>
                    <Ionicons name="flame" size={24} color="#4CAF50" />
                    <Text style={styles.statValue}>1,240</Text>
                    <Text style={styles.statLabel}>Calories Burned</Text>
                  </LinearGradient>
                </View>
                <View style={styles.statCard}>
                  <LinearGradient colors={["#F3E5F5", "#FCE4EC"]} style={styles.statGradient}>
                    <Ionicons name="time" size={24} color="#9C27B0" />
                    <Text style={styles.statValue}>4h 30m</Text>
                    <Text style={styles.statLabel}>Active Time</Text>
                  </LinearGradient>
                </View>
                <View style={styles.statCard}>
                  <LinearGradient colors={["#FFF3E0", "#FFF8E1"]} style={styles.statGradient}>
                    <Ionicons name="trophy" size={24} color="#FF9800" />
                    <Text style={styles.statValue}>12</Text>
                    <Text style={styles.statLabel}>Workouts</Text>
                  </LinearGradient>
                </View>
              </View>
            </View>
          </>
        )}

        {selectedTab === "workouts" && (
          <View style={styles.workoutsSection}>
            <Text style={styles.sectionTitle}>Pregnancy-Safe Workouts</Text>
            <Text style={styles.sectionSubtitle}>
              Choose from our curated collection of safe exercises
            </Text>
            <FlatList
              data={exerciseCategories}
              renderItem={renderExerciseCategory}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {selectedTab === "safety" && (
          <View style={styles.safetySection}>
            <Text style={styles.sectionTitle}>Exercise Safety Guidelines</Text>
            <Text style={styles.sectionSubtitle}>
              Important tips to keep you and your baby safe
            </Text>
            
            {/* Safety Tips */}
            <View style={styles.safetyTipsContainer}>
              {safetyTips.map((tip) => (
                <View key={tip.id} style={styles.safetyTipCard}>
                  <View style={[styles.safetyIcon, { backgroundColor: `${tip.color}15` }]}>
                    <Ionicons name={tip.icon} size={24} color={tip.color} />
                  </View>
                  <Text style={styles.safetyTipText}>{tip.tip}</Text>
                </View>
              ))}
            </View>

            {/* Warning Section */}
            <View style={styles.warningSection}>
              <LinearGradient
                colors={["#FFEBEE", "#FFCDD2"]}
                style={styles.warningGradient}
              >
                <Ionicons name="warning" size={24} color="#F44336" />
                <Text style={styles.warningTitle}>When to Stop Exercising</Text>
                <Text style={styles.warningText}>
                  Stop exercising immediately and consult your doctor if you experience:
                  {"\n"}• Vaginal bleeding or fluid leakage
                  {"\n"}• Chest pain or heart palpitations
                  {"\n"}• Severe headaches or dizziness
                  {"\n"}• Muscle weakness or calf pain
                  {"\n"}• Decreased fetal movement
                </Text>
              </LinearGradient>
            </View>
          </View>
        )}

        {selectedTab === "achievements" && (
          <View style={styles.achievementsSection}>
            <Text style={styles.sectionTitle}>Your Achievements</Text>
            <Text style={styles.sectionSubtitle}>
              Celebrate your fitness milestones
            </Text>
            
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement) => (
                <View key={achievement.id} style={styles.achievementCard}>
                  <LinearGradient
                    colors={achievement.unlocked ? 
                      [`${achievement.color}15`, `${achievement.color}05`] : 
                      ["#F5F5F5", "#EEEEEE"]
                    }
                    style={styles.achievementGradient}
                  >
                    <View style={[
                      styles.achievementIcon, 
                      { backgroundColor: achievement.unlocked ? achievement.color : "#BDBDBD" }
                    ]}>
                      <Ionicons 
                        name={achievement.icon} 
                        size={24} 
                        color="white" 
                      />
                    </View>
                    <Text style={[
                      styles.achievementTitle,
                      { color: achievement.unlocked ? "#2C3E50" : "#9E9E9E" }
                    ]}>
                      {achievement.title}
                    </Text>
                    <Text style={[
                      styles.achievementDescription,
                      { color: achievement.unlocked ? "#7F8C8D" : "#BDBDBD" }
                    ]}>
                      {achievement.description}
                    </Text>
                    {achievement.unlocked && (
                      <View style={styles.unlockedBadge}>
                        <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                        <Text style={styles.unlockedText}>Unlocked</Text>
                      </View>
                    )}
                  </LinearGradient>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <LinearGradient
          colors={["#9C27B0", "#7B1FA2"]}
          style={styles.fabGradient}
        >
          <Ionicons name="play" size={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
    marginBottom: 15,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  timerButton: {
    padding: 8,
  },
  headerSubtitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginRight: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  tabContainer: {
    backgroundColor: "white",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  tabButtonActive: {
    backgroundColor: "#9C27B0",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#5D6D7E",
  },
  tabButtonTextActive: {
    color: "white",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  goalsSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  addWorkoutButton: {
    padding: 5,
  },
  goalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  goalCard: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
  },
  goalValue: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 3,
    marginRight: 10,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9C27B0",
  },
  todaySection: {
    marginBottom: 25,
  },
  workoutCard: {
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  workoutGradient: {
    borderRadius: 15,
    padding: 15,
  },
  workoutHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  workoutIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  workoutTime: {
    fontSize: 12,
    color: "#7F8C8D",
    marginTop: 2,
  },
  workoutType: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  workoutAction: {
    padding: 5,
  },
  statsSection: {
    marginBottom: 25,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    width: "31%",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statGradient: {
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: "#7F8C8D",
    textAlign: "center",
    marginTop: 4,
  },
  workoutsSection: {
    marginBottom: 25,
  },
  categoryCard: {
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryGradient: {
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    color: "#7F8C8D",
    marginBottom: 8,
  },
  categoryDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 2,
  },
  detailText: {
    fontSize: 11,
    color: "#7F8C8D",
    marginLeft: 4,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  safetySection: {
    marginBottom: 25,
  },
  safetyTipsContainer: {
    marginBottom: 20,
  },
  safetyTipCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  safetyIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  safetyTipText: {
    flex: 1,
    fontSize: 14,
    color: "#2C3E50",
    lineHeight: 20,
  },
  warningSection: {
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  warningGradient: {
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F44336",
    marginTop: 10,
    marginBottom: 10,
  },
  warningText: {
    fontSize: 14,
    color: "#D32F2F",
    textAlign: "center",
    lineHeight: 20,
  },
  achievementsSection: {
    marginBottom: 25,
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  achievementCard: {
    width: "48%",
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementGradient: {
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
    marginBottom: 10,
  },
  unlockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unlockedText: {
    fontSize: 10,
    color: "#4CAF50",
    fontWeight: "600",
    marginLeft: 4,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    shadowColor: "#9C27B0",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ExercisesScreen;