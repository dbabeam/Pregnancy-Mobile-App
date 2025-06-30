"use client"

import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
import {
  Alert,
  Animated,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

// Enhanced tip data structure
const tipCategories = [
  { id: "all", name: "All Tips", icon: "apps-outline" },
  { id: "nutrition", name: "Nutrition", icon: "nutrition-outline" },
  { id: "exercise", name: "Exercise", icon: "fitness-outline" },
  { id: "sleep", name: "Sleep", icon: "bed-outline" },
  { id: "mental", name: "Mental Health", icon: "heart-outline" },
  { id: "medical", name: "Medical", icon: "medical-outline" },
]

const healthTips = [
  {
    id: "1",
    category: "nutrition",
    title: "Eat Folate-Rich Foods",
    description:
      "Leafy greens, citrus fruits, and beans are excellent sources of folate, which is essential for your baby's neural tube development.",
    fullContent: `Folate (also known as folic acid when taken as a supplement) is crucial during pregnancy, especially in the first trimester when your baby's neural tube is forming.

**Best Sources:**
• Dark leafy greens (spinach, kale, romaine lettuce)
• Citrus fruits (oranges, grapefruits, lemons)
• Legumes (lentils, chickpeas, black beans)
• Fortified cereals and grains
• Asparagus and broccoli

**Daily Recommendation:** 600-800 micrograms per day

**Why It Matters:** Adequate folate intake can prevent neural tube defects like spina bifida and anencephaly by up to 70%.`,
    icon: "nutrition-outline",
    image: "/placeholder.svg?height=100&width=100",
    color: "#4CAF50",
    lightColor: "#E8F5E8",
    tags: ["folate", "nutrition", "baby development", "leafy greens", "neural tube"],
    readTime: "3 min read",
    difficulty: "Easy",
    trimester: ["1st", "2nd", "3rd"],
    author: "Dr. Sarah Johnson, Nutritionist",
    dateAdded: "2024-01-15",
    likes: 245,
    isBookmarked: false,
  },
  {
    id: "2",
    category: "nutrition",
    title: "Stay Hydrated",
    description:
      "Drink at least 8-10 glasses of water daily to support your increased blood volume and amniotic fluid.",
    fullContent: `Proper hydration is essential during pregnancy as your body's fluid needs increase significantly.

**Why You Need More Water:**
• Blood volume increases by 40-50%
• Amniotic fluid production
• Supporting placental function
• Preventing constipation and UTIs
• Regulating body temperature

**Daily Goal:** 8-12 glasses (64-96 oz) of water

**Hydration Tips:**
• Start your day with a glass of water
• Keep a water bottle with you
• Add lemon or cucumber for flavor
• Monitor urine color (should be pale yellow)
• Increase intake during hot weather or exercise`,
    icon: "water-outline",
    image: "/placeholder.svg?height=100&width=100",
    color: "#2196F3",
    lightColor: "#E3F2FD",
    tags: ["hydration", "water", "blood volume", "amniotic fluid", "health"],
    readTime: "2 min read",
    difficulty: "Easy",
    trimester: ["1st", "2nd", "3rd"],
    author: "Dr. Maria Rodriguez, OB-GYN",
    dateAdded: "2024-01-10",
    likes: 189,
    isBookmarked: false,
  },
  {
    id: "3",
    category: "exercise",
    title: "Gentle Walking",
    description: "A 20-30 minute walk daily improves circulation, reduces swelling, and boosts your mood.",
    fullContent: `Walking is one of the safest and most beneficial exercises during pregnancy.

**Benefits:**
• Improves cardiovascular health
• Reduces leg swelling and varicose veins
• Helps maintain healthy weight gain
• Boosts mood and energy levels
• Prepares your body for labor

**Getting Started:**
• Start with 10-15 minutes if you're new to exercise
• Gradually increase to 30 minutes daily
• Choose flat, even surfaces
• Wear supportive shoes
• Stay hydrated

**Safety Tips:**
• Avoid overheating
• Stop if you feel dizzy or short of breath
• Listen to your body
• Consult your doctor before starting any exercise program`,
    icon: "walk-outline",
    image: "/placeholder.svg?height=100&width=100",
    color: "#FF9800",
    lightColor: "#FFF3E0",
    tags: ["walking", "exercise", "circulation", "mood", "swelling", "cardio"],
    readTime: "4 min read",
    difficulty: "Easy",
    trimester: ["1st", "2nd", "3rd"],
    author: "Lisa Chen, Prenatal Fitness Specialist",
    dateAdded: "2024-01-08",
    likes: 156,
    isBookmarked: false,
  },
  {
    id: "4",
    category: "exercise",
    title: "Prenatal Yoga",
    description:
      "Prenatal yoga can improve sleep, reduce stress, and increase the strength and flexibility needed for childbirth.",
    fullContent: `Prenatal yoga is specifically designed to be safe and beneficial during pregnancy.

**Physical Benefits:**
• Improves flexibility and strength
• Reduces back pain and hip discomfort
• Better sleep quality
• Improved balance and posture

**Mental Benefits:**
• Stress reduction
• Better emotional regulation
• Mindfulness and relaxation
• Connection with your baby

**Safe Poses:**
• Cat-cow stretches
• Modified downward dog
• Prenatal sun salutations
• Supported child's pose
• Gentle twists

**Avoid:**
• Deep backbends
• Lying flat on your back after first trimester
• Hot yoga
• Intense core work
• Poses that compress the belly`,
    icon: "fitness-outline",
    image: "/placeholder.svg?height=100&width=100",
    color: "#9C27B0",
    lightColor: "#F3E5F5",
    tags: ["yoga", "prenatal", "sleep", "stress", "flexibility", "childbirth", "mindfulness"],
    readTime: "5 min read",
    difficulty: "Moderate",
    trimester: ["1st", "2nd", "3rd"],
    author: "Amanda Williams, Certified Prenatal Yoga Instructor",
    dateAdded: "2024-01-05",
    likes: 203,
    isBookmarked: false,
  },
  {
    id: "5",
    category: "sleep",
    title: "Sleep on Your Side",
    description:
      "Sleeping on your left side improves blood flow to your heart, kidneys, and uterus, benefiting both you and your baby.",
    fullContent: `Side sleeping, particularly on your left side, is the recommended sleep position during pregnancy.

**Why Left Side is Best:**
• Improves blood flow to the placenta
• Reduces pressure on major blood vessels
• Better kidney function
• Optimal oxygen delivery to baby

**Making Side Sleeping Comfortable:**
• Use a pregnancy pillow between your knees
• Place a small pillow under your belly for support
• Keep your legs slightly bent
• Use a pillow behind your back to prevent rolling

**Sleep Quality Tips:**
• Establish a bedtime routine
• Keep your bedroom cool and dark
• Avoid caffeine after 2 PM
• Try relaxation techniques before bed
• Don't worry if you wake up on your back - just return to your side`,
    icon: "bed-outline",
    image: "/placeholder.svg?height=100&width=100",
    color: "#3F51B5",
    lightColor: "#E8EAF6",
    tags: ["sleep", "side sleeping", "blood flow", "heart", "kidneys", "uterus", "comfort"],
    readTime: "3 min read",
    difficulty: "Easy",
    trimester: ["2nd", "3rd"],
    author: "Dr. Jennifer Park, Sleep Medicine Specialist",
    dateAdded: "2024-01-03",
    likes: 178,
    isBookmarked: false,
  },
  {
    id: "6",
    category: "mental",
    title: "Practice Mindfulness",
    description:
      "Taking 10 minutes daily for deep breathing or meditation can reduce anxiety and promote emotional well-being.",
    fullContent: `Mindfulness practices can significantly improve your mental health during pregnancy.

**Benefits:**
• Reduced anxiety and stress
• Better emotional regulation
• Improved sleep quality
• Enhanced bonding with baby
• Lower risk of postpartum depression

**Simple Mindfulness Techniques:**

**Deep Breathing (5 minutes):**
1. Sit comfortably with eyes closed
2. Breathe in for 4 counts
3. Hold for 4 counts
4. Exhale for 6 counts
5. Repeat 10 times

**Body Scan Meditation (10 minutes):**
• Start at your toes and work up
• Notice sensations without judgment
• Include your growing belly
• Send love to your baby

**Mindful Walking:**
• Focus on each step
• Notice your surroundings
• Breathe naturally
• Stay present in the moment`,
    icon: "heart-outline",
    image: "/placeholder.svg?height=100&width=100",
    color: "#E91E63",
    lightColor: "#FCE4EC",
    tags: ["mindfulness", "meditation", "breathing", "anxiety", "emotional health", "stress relief"],
    readTime: "4 min read",
    difficulty: "Easy",
    trimester: ["1st", "2nd", "3rd"],
    author: "Dr. Rachel Thompson, Clinical Psychologist",
    dateAdded: "2024-01-01",
    likes: 267,
    isBookmarked: false,
  },
]

const TipsScreen = () => {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchVisible, setSearchVisible] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [tips, setTips] = useState(healthTips)
  const [bookmarkedTips, setBookmarkedTips] = useState<string[]>([])
  const [selectedTip, setSelectedTip] = useState<any>(null)
  const [showTipDetail, setShowTipDetail] = useState(false)

  // Animation values
  const searchSlideAnim = useRef(new Animated.Value(0)).current
  const searchOpacityAnim = useRef(new Animated.Value(0)).current
  const searchInputRef = useRef<TextInput>(null)

  // Load bookmarked tips from storage
  useEffect(() => {
    loadBookmarkedTips()
  }, [])

  const loadBookmarkedTips = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem("bookmarkedTips")
      if (bookmarks) {
        const bookmarkIds = JSON.parse(bookmarks)
        setBookmarkedTips(bookmarkIds)
        // Update tips with bookmark status
        setTips((prevTips) =>
          prevTips.map((tip) => ({
            ...tip,
            isBookmarked: bookmarkIds.includes(tip.id),
          })),
        )
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error)
    }
  }

  const saveBookmarkedTips = async (bookmarkIds: string[]) => {
    try {
      await AsyncStorage.setItem("bookmarkedTips", JSON.stringify(bookmarkIds))
    } catch (error) {
      console.error("Error saving bookmarks:", error)
    }
  }

  // Filter tips based on search and category
  const getFilteredTips = () => {
    let filtered = selectedCategory === "all" ? tips : tips.filter((tip) => tip.category === selectedCategory)

    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase()
      filtered = filtered.filter(
        (tip) =>
          tip.title.toLowerCase().includes(searchLower) ||
          tip.description.toLowerCase().includes(searchLower) ||
          tip.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          tip.author.toLowerCase().includes(searchLower),
      )
    }

    return filtered
  }

  const toggleSearch = () => {
    if (searchVisible) {
      Keyboard.dismiss()
      Animated.parallel([
        Animated.timing(searchSlideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(searchOpacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setSearchVisible(false)
        setSearchText("")
      })
    } else {
      setSearchVisible(true)
      Animated.parallel([
        Animated.timing(searchSlideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(searchOpacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        searchInputRef.current?.focus()
      })
    }
  }

  const toggleBookmark = async (tipId: string) => {
    const updatedBookmarks = bookmarkedTips.includes(tipId)
      ? bookmarkedTips.filter((id) => id !== tipId)
      : [...bookmarkedTips, tipId]

    setBookmarkedTips(updatedBookmarks)
    await saveBookmarkedTips(updatedBookmarks)

    // Update tips state
    setTips((prevTips) => prevTips.map((tip) => (tip.id === tipId ? { ...tip, isBookmarked: !tip.isBookmarked } : tip)))

    // Show feedback
    const tip = tips.find((t) => t.id === tipId)
    if (tip) {
      Alert.alert(
        updatedBookmarks.includes(tipId) ? "Tip Saved!" : "Tip Removed",
        updatedBookmarks.includes(tipId)
          ? `"${tip.title}" has been added to your bookmarks.`
          : `"${tip.title}" has been removed from your bookmarks.`,
      )
    }
  }

  const shareTip = async (tip: any) => {
    try {
      const shareContent = {
        title: tip.title,
        message: `${tip.title}\n\n${tip.description}\n\nShared from Pregnancy Tips App`,
        url: "https://pregnancytips.app", // Replace with your app's URL
      }

      const result = await Share.share(shareContent)
      if (result.action === Share.sharedAction) {
        console.log("Tip shared successfully")
      }
    } catch (error) {
      console.error("Error sharing tip:", error)
      Alert.alert("Error", "Unable to share this tip. Please try again.")
    }
  }

  const likeTip = (tipId: string) => {
    setTips((prevTips) => prevTips.map((tip) => (tip.id === tipId ? { ...tip, likes: tip.likes + 1 } : tip)))
  }

  const openTipDetail = (tip: any) => {
    setSelectedTip(tip)
    setShowTipDetail(true)
  }

  const clearSearch = () => {
    setSearchText("")
    searchInputRef.current?.focus()
  }

  const renderSearchBar = () => {
    if (!searchVisible) return null

    return (
      <Animated.View
        style={[
          styles.searchContainer,
          {
            opacity: searchOpacityAnim,
            transform: [
              {
                translateY: searchSlideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.searchInputContainer, isSearchFocused && styles.searchInputContainerFocused]}>
          <Ionicons name="search" size={20} color={isSearchFocused ? "#9C27B0" : "#757575"} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search tips, keywords, authors..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#757575" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    )
  }

  const renderTipCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.tipCard} onPress={() => openTipDetail(item)} activeOpacity={0.7}>
      <LinearGradient colors={[item.lightColor, "#FFFFFF"]} style={styles.tipCardGradient}>
        <View style={styles.tipCardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
            <Ionicons name={item.icon as any} size={24} color="white" />
          </View>
          <View style={styles.tipTitleContainer}>
            <Text style={styles.tipTitle}>{item.title}</Text>
            <View style={styles.tipMeta}>
              <Text style={[styles.categoryText, { color: item.color }]}>
                {tipCategories.find((cat) => cat.id === item.category)?.name}
              </Text>
              <Text style={styles.readTime}>• {item.readTime}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.tipDescription} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.tipTags}>
          {item.trimester.map((tri: string) => (
            <View key={tri} style={[styles.trimesterTag, { backgroundColor: `${item.color}15` }]}>
              <Text style={[styles.trimesterText, { color: item.color }]}>{tri} Trimester</Text>
            </View>
          ))}
        </View>

        <View style={styles.tipCardFooter}>
          <View style={styles.tipStats}>
            <TouchableOpacity style={styles.statButton} onPress={() => likeTip(item.id)} activeOpacity={0.7}>
              <Ionicons name="heart-outline" size={18} color="#757575" />
              <Text style={styles.statText}>{item.likes}</Text>
            </TouchableOpacity>
            <Text style={styles.authorText}>by {item.author.split(",")[0]}</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={() => toggleBookmark(item.id)} activeOpacity={0.7}>
              <Ionicons
                name={item.isBookmarked ? "bookmark" : "bookmark-outline"}
                size={20}
                color={item.isBookmarked ? item.color : "#757575"}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => shareTip(item)} activeOpacity={0.7}>
              <Ionicons name="share-social-outline" size={20} color="#757575" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )

  const renderTipDetail = () => {
    if (!showTipDetail || !selectedTip) return null

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.tipDetailContainer}>
          <ScrollView style={styles.tipDetailScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.tipDetailHeader}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowTipDetail(false)} activeOpacity={0.7}>
                <Ionicons name="close" size={24} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            <View style={[styles.tipDetailIcon, { backgroundColor: selectedTip.color }]}>
              <Ionicons name={selectedTip.icon} size={32} color="white" />
            </View>

            <Text style={styles.tipDetailTitle}>{selectedTip.title}</Text>

            <View style={styles.tipDetailMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color="#7F8C8D" />
                <Text style={styles.metaText}>{selectedTip.readTime}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="bar-chart-outline" size={16} color="#7F8C8D" />
                <Text style={styles.metaText}>{selectedTip.difficulty}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="person-outline" size={16} color="#7F8C8D" />
                <Text style={styles.metaText}>{selectedTip.author.split(",")[0]}</Text>
              </View>
            </View>

            <Text style={styles.tipDetailContent}>{selectedTip.fullContent}</Text>

            <View style={styles.tipDetailActions}>
              <TouchableOpacity
                style={[
                  styles.detailActionButton,
                  { backgroundColor: selectedTip.isBookmarked ? selectedTip.color : "#F8F9FA" },
                ]}
                onPress={() => toggleBookmark(selectedTip.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={selectedTip.isBookmarked ? "bookmark" : "bookmark-outline"}
                  size={20}
                  color={selectedTip.isBookmarked ? "white" : "#2C3E50"}
                />
                <Text style={[styles.detailActionText, { color: selectedTip.isBookmarked ? "white" : "#2C3E50" }]}>
                  {selectedTip.isBookmarked ? "Saved" : "Save"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.detailActionButton, { backgroundColor: "#F8F9FA" }]}
                onPress={() => shareTip(selectedTip)}
                activeOpacity={0.7}
              >
                <Ionicons name="share-social-outline" size={20} color="#2C3E50" />
                <Text style={[styles.detailActionText, { color: "#2C3E50" }]}>Share</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }

  const renderEmptySearch = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={64} color="#E0E0E0" />
      <Text style={styles.emptyTitle}>No tips found</Text>
      <Text style={styles.emptySubtitle}>Try searching with different keywords or check another category</Text>
      <TouchableOpacity style={styles.clearSearchButton} onPress={clearSearch} activeOpacity={0.7}>
        <Text style={styles.clearSearchText}>Clear Search</Text>
      </TouchableOpacity>
    </View>
  )

  const filteredTips = getFilteredTips()

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      {/* Header */}
      <LinearGradient
        colors={["#E0BBFF", "#9C27B0", "#7B1FA2"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Health Tips</Text>
            <TouchableOpacity style={styles.searchButton} onPress={toggleSearch} activeOpacity={0.7}>
              <Ionicons name={searchVisible ? "close" : "search"} size={24} color="white" />
            </TouchableOpacity>
          </View>

          {!searchVisible && (
            <View style={styles.headerSubtitle}>
              <Ionicons name="bulb" size={20} color="white" style={styles.headerIcon} />
              <Text style={styles.subtitleText}>
                Expert advice for a healthy pregnancy • {bookmarkedTips.length} saved
              </Text>
            </View>
          )}

          {renderSearchBar()}
        </SafeAreaView>
      </LinearGradient>

      {/* Search Results Count */}
      {searchText.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <Text style={styles.searchResultsText}>
            {filteredTips.length} {filteredTips.length === 1 ? "result" : "results"} for "{searchText}"
          </Text>
        </View>
      )}

      {/* Featured Tip - Hide when searching */}
      {!searchText && (
        <View style={styles.featuredContainer}>
          <LinearGradient colors={["#FCE4EC", "#FFEBEE"]} style={styles.featuredGradient}>
            <TouchableOpacity style={styles.featuredContent} onPress={() => openTipDetail(tips[3])} activeOpacity={0.7}>
              <View style={styles.featuredTextContent}>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>Featured Tip</Text>
                </View>
                <Text style={styles.featuredTitle}>Stay Active Throughout Your Pregnancy</Text>
                <Text style={styles.featuredDescription}>
                  Regular physical activity can help reduce back pain, promote healthy weight gain, and improve sleep
                  quality.
                </Text>
                <View style={styles.readMoreButton}>
                  <Text style={styles.readMoreText}>Read More</Text>
                  <Ionicons name="arrow-forward" size={16} color="#9C27B0" />
                </View>
              </View>
              <Image source={{ uri: "/placeholder.svg?height=100&width=100" }} style={styles.featuredImage} />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}

      {/* Category Filter - Hide when searching */}
      {!searchText && (
        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {tipCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryButton, selectedCategory === category.id && styles.categoryButtonActive]}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={category.icon as any}
                  size={16}
                  color={selectedCategory === category.id ? "white" : "#5D6D7E"}
                  style={styles.categoryIcon}
                />
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category.id && styles.categoryButtonTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Tips List */}
      {filteredTips.length > 0 ? (
        <FlatList
          data={filteredTips}
          renderItem={renderTipCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.tipsListContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      ) : searchText.length > 0 ? (
        renderEmptySearch()
      ) : null}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push("/Bookmarks")} activeOpacity={0.8}>
        <LinearGradient colors={["#9C27B0", "#7B1FA2"]} style={styles.fabGradient}>
          <Ionicons name="bookmark" size={24} color="white" />
          {bookmarkedTips.length > 0 && (
            <View style={styles.fabBadge}>
              <Text style={styles.fabBadgeText}>{bookmarkedTips.length}</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Tip Detail Modal */}
      {renderTipDetail()}
    </KeyboardAvoidingView>
  )
}

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
  searchButton: {
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
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  searchContainer: {
    marginTop: 15,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  searchInputContainerFocused: {
    shadowColor: "#9C27B0",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#2C3E50",
  },
  clearButton: {
    padding: 4,
  },
  searchResultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#F8F9FA",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  searchResultsText: {
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  featuredContainer: {
    marginHorizontal: 20,
    marginTop: -15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  featuredGradient: {
    borderRadius: 20,
    overflow: "hidden",
  },
  featuredContent: {
    flexDirection: "row",
    padding: 20,
  },
  featuredTextContent: {
    flex: 1,
    marginRight: 15,
  },
  featuredBadge: {
    backgroundColor: "#E91E63",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  featuredBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 14,
    color: "#5D6D7E",
    marginBottom: 12,
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9C27B0",
    marginRight: 5,
  },
  featuredImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },
  categoryContainer: {
    marginTop: 20,
  },
  categoryScrollContent: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: "#F5F5F5",
  },
  categoryButtonActive: {
    backgroundColor: "#9C27B0",
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#5D6D7E",
  },
  categoryButtonTextActive: {
    color: "white",
  },
  tipsListContent: {
    padding: 15,
    paddingBottom: 80,
  },
  tipCard: {
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  tipCardGradient: {
    borderRadius: 16,
    padding: 16,
  },
  tipCardHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  tipTitleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  tipMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  readTime: {
    fontSize: 12,
    color: "#7F8C8D",
    marginLeft: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: "#5D6D7E",
    lineHeight: 20,
    marginBottom: 12,
  },
  tipTags: {
    flexDirection: "row",
    marginBottom: 15,
  },
  trimesterTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 6,
  },
  trimesterText: {
    fontSize: 10,
    fontWeight: "600",
  },
  tipCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: 12,
  },
  tipStats: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  statText: {
    fontSize: 12,
    color: "#7F8C8D",
    marginLeft: 4,
  },
  authorText: {
    fontSize: 12,
    color: "#7F8C8D",
    fontStyle: "italic",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#BDC3C7",
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#BDC3C7",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  clearSearchButton: {
    backgroundColor: "#9C27B0",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearSearchText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
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
    position: "relative",
  },
  fabBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FF5722",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  fabBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  tipDetailContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    margin: 20,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  tipDetailScroll: {
    maxHeight: "100%",
  },
  tipDetailHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 15,
  },
  closeButton: {
    padding: 5,
  },
  tipDetailIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  tipDetailTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  tipDetailMeta: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  metaText: {
    fontSize: 14,
    color: "#7F8C8D",
    marginLeft: 4,
  },
  tipDetailContent: {
    fontSize: 16,
    color: "#2C3E50",
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  tipDetailActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  detailActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 0.45,
    justifyContent: "center",
  },
  detailActionText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
})

export default TipsScreen
