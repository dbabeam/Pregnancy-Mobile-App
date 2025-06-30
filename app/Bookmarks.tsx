"use client"

import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
import {
    Alert,
    Animated,
    Dimensions,
    FlatList,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"

const { width, height } = Dimensions.get("window")

// Sample data structure for a tip
interface Tip {
  id: string
  category: string
  title: string
  description: string
  fullContent?: string
  icon: string
  color: string
  lightColor: string
  readTime: string
  author: string
  tags: string[]
  trimester: string[]
  dateAdded: string
  likes: number
  isBookmarked: boolean
}

// Categories for reference
const tipCategories = [
  { id: "all", name: "All", icon: "apps-outline", color: "#9C27B0" },
  { id: "nutrition", name: "Nutrition", icon: "nutrition-outline", color: "#4CAF50" },
  { id: "exercise", name: "Exercise", icon: "fitness-outline", color: "#FF9800" },
  { id: "sleep", name: "Sleep", icon: "bed-outline", color: "#3F51B5" },
  { id: "mental", name: "Mental Health", icon: "heart-outline", color: "#E91E63" },
  { id: "medical", name: "Medical", icon: "medical-outline", color: "#2196F3" },
]

// Sample tips data (same structure as in the tips page)
const allTips = [
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
    isBookmarked: true,
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
    isBookmarked: true,
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
    isBookmarked: true,
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
    isBookmarked: true,
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
    isBookmarked: true,
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
    isBookmarked: true,
  },
]

const BookmarksScreen = () => {
  const router = useRouter()
  const [bookmarkedTips, setBookmarkedTips] = useState<Tip[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchText, setSearchText] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null)
  const [showTipDetail, setShowTipDetail] = useState(false)
  const [sortBy, setSortBy] = useState<"recent" | "title" | "readTime">("recent")

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const cardAnimations = useRef(Array.from({ length: 10 }, () => new Animated.Value(0))).current
  const detailSlideAnim = useRef(new Animated.Value(height)).current

  useEffect(() => {
    loadBookmarks()
    startAnimations()
  }, [])

  const startAnimations = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start()

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start()

    cardAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: 200 + index * 100,
        useNativeDriver: true,
      }).start()
    })
  }

  const loadBookmarks = async () => {
    try {
      setLoading(true)
      const bookmarksJson = await AsyncStorage.getItem("bookmarkedTips")

      if (bookmarksJson) {
        const bookmarkIds = JSON.parse(bookmarksJson)
        // Filter all tips to get only the bookmarked ones
        const bookmarked = allTips.filter((tip) => bookmarkIds.includes(tip.id))
        setBookmarkedTips(bookmarked)
      } else {
        // For demo purposes, use the sample data
        setBookmarkedTips(allTips.filter((tip) => tip.isBookmarked))
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error)
      Alert.alert("Error", "Failed to load your bookmarks.")
    } finally {
      setLoading(false)
    }
  }

  const removeBookmark = async (tipId: string) => {
    try {
      // Get current bookmarks
      const bookmarksJson = await AsyncStorage.getItem("bookmarkedTips")
      if (bookmarksJson) {
        const bookmarkIds = JSON.parse(bookmarksJson)
        // Remove the selected tip ID
        const updatedBookmarkIds = bookmarkIds.filter((id: string) => id !== tipId)
        // Save back to storage
        await AsyncStorage.setItem("bookmarkedTips", JSON.stringify(updatedBookmarkIds))
      }

      // Update state
      setBookmarkedTips((prev) => prev.filter((tip) => tip.id !== tipId))

      // Show feedback
      const removedTip = bookmarkedTips.find((tip) => tip.id === tipId)
      if (removedTip) {
        Alert.alert("Removed", `"${removedTip.title}" removed from bookmarks.`)
      }
    } catch (error) {
      console.error("Error removing bookmark:", error)
      Alert.alert("Error", "Failed to remove bookmark.")
    }
  }

  const getFilteredBookmarks = () => {
    let filtered = bookmarkedTips

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((tip) => tip.category === selectedCategory)
    }

    // Filter by search text
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

    // Sort
    switch (sortBy) {
      case "recent":
        return [...filtered].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      case "title":
        return [...filtered].sort((a, b) => a.title.localeCompare(b.title))
      case "readTime":
        return [...filtered].sort((a, b) => {
          const aTime = Number.parseInt(a.readTime.split(" ")[0])
          const bTime = Number.parseInt(b.readTime.split(" ")[0])
          return aTime - bTime
        })
      default:
        return filtered
    }
  }

  const openTipDetail = (tip: Tip) => {
    setSelectedTip(tip)
    setShowTipDetail(true)
    Animated.timing(detailSlideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  const closeTipDetail = () => {
    Animated.timing(detailSlideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowTipDetail(false)
      setSelectedTip(null)
    })
  }

  const renderListItem = ({ item, index }: { item: Tip; index: number }) => (
    <Animated.View
      style={[
        styles.listItemContainer,
        {
          opacity: cardAnimations[index % cardAnimations.length],
          transform: [
            {
              translateY: cardAnimations[index % cardAnimations.length].interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity style={styles.listItem} onPress={() => openTipDetail(item)} activeOpacity={0.7}>
        <LinearGradient
          colors={[item.lightColor, "#FFFFFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.listItemGradient}
        >
          <View style={styles.listItemHeader}>
            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon as any} size={24} color="white" />
            </View>
            <View style={styles.listItemTitleContainer}>
              <Text style={styles.listItemTitle}>{item.title}</Text>
              <View style={styles.listItemMeta}>
                <Text style={[styles.categoryText, { color: item.color }]}>
                  {tipCategories.find((cat) => cat.id === item.category)?.name}
                </Text>
                <Text style={styles.readTime}>• {item.readTime}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeBookmark(item.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={22} color="#FF5722" />
            </TouchableOpacity>
          </View>

          <Text style={styles.listItemDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.listItemFooter}>
            <Text style={styles.authorText}>{item.author.split(",")[0]}</Text>
            <View style={styles.trimesterContainer}>
              {item.trimester.map((tri) => (
                <View key={tri} style={[styles.trimesterTag, { backgroundColor: `${item.color}15` }]}>
                  <Text style={[styles.trimesterText, { color: item.color }]}>{tri}</Text>
                </View>
              ))}
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  )

  const renderGridItem = ({ item, index }: { item: Tip; index: number }) => (
    <Animated.View
      style={[
        styles.gridItemContainer,
        {
          opacity: cardAnimations[index % cardAnimations.length],
          transform: [
            {
              translateY: cardAnimations[index % cardAnimations.length].interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity style={styles.gridItem} onPress={() => openTipDetail(item)} activeOpacity={0.7}>
        <LinearGradient
          colors={[item.lightColor, "#FFFFFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gridItemGradient}
        >
          <View style={styles.gridItemHeader}>
            <View style={[styles.gridIconContainer, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon as any} size={20} color="white" />
            </View>
            <TouchableOpacity
              style={styles.gridRemoveButton}
              onPress={() => removeBookmark(item.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={18} color="#FF5722" />
            </TouchableOpacity>
          </View>

          <Text style={styles.gridItemTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.gridItemFooter}>
            <Text style={[styles.gridCategoryText, { color: item.color }]}>
              {tipCategories.find((cat) => cat.id === item.category)?.name}
            </Text>
            <Text style={styles.gridReadTime}>{item.readTime}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  )

  const renderTipDetail = () => {
    if (!showTipDetail || !selectedTip) return null

    return (
      <Animated.View
        style={[
          styles.tipDetailOverlay,
          {
            transform: [{ translateY: detailSlideAnim }],
          },
        ]}
      >
        <View style={styles.tipDetailContainer}>
          <View style={styles.tipDetailHeader}>
            <TouchableOpacity style={styles.closeDetailButton} onPress={closeTipDetail} activeOpacity={0.7}>
              <Ionicons name="chevron-down" size={24} color="#2C3E50" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeDetailButton}
              onPress={() => {
                removeBookmark(selectedTip.id)
                closeTipDetail()
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={22} color="#FF5722" />
              <Text style={styles.removeDetailText}>Remove</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.tipDetailContent} showsVerticalScrollIndicator={false}>
            <View style={[styles.tipDetailIconContainer, { backgroundColor: selectedTip.color }]}>
              <Ionicons name={selectedTip.icon as any} size={32} color="white" />
            </View>

            <Text style={styles.tipDetailTitle}>{selectedTip.title}</Text>

            <View style={styles.tipDetailMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="folder-outline" size={16} color="#7F8C8D" />
                <Text style={styles.metaText}>
                  {tipCategories.find((cat) => cat.id === selectedTip.category)?.name}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color="#7F8C8D" />
                <Text style={styles.metaText}>{selectedTip.readTime}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={16} color="#7F8C8D" />
                <Text style={styles.metaText}>
                  {new Date(selectedTip.dateAdded).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.tipDetailAuthor}>
              <Ionicons name="person-outline" size={18} color="#2C3E50" />
              <Text style={styles.tipDetailAuthorText}>{selectedTip.author}</Text>
            </View>

            <View style={styles.tipDetailTrimesters}>
              {selectedTip.trimester.map((tri) => (
                <View key={tri} style={[styles.tipDetailTrimester, { backgroundColor: `${selectedTip.color}15` }]}>
                  <Text style={[styles.tipDetailTrimesterText, { color: selectedTip.color }]}>{tri} Trimester</Text>
                </View>
              ))}
            </View>

            <Text style={styles.tipDetailDescription}>{selectedTip.fullContent || selectedTip.description}</Text>

            <View style={styles.tipDetailTags}>
              <Text style={styles.tipDetailTagsTitle}>Related Topics:</Text>
              <View style={styles.tipDetailTagsContainer}>
                {selectedTip.tags.map((tag) => (
                  <View key={tag} style={styles.tipDetailTag}>
                    <Text style={styles.tipDetailTagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </Animated.View>
    )
  }

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bookmark-outline" size={80} color="#E0E0E0" />
      <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>
      <Text style={styles.emptyDescription}>
        Save your favorite tips for quick access by tapping the bookmark icon on any tip.
      </Text>
      <TouchableOpacity style={styles.browseTipsButton} onPress={() => router.push("/Tips")} activeOpacity={0.7}>
        <LinearGradient colors={["#9C27B0", "#7B1FA2"]} style={styles.browseTipsGradient}>
          <Text style={styles.browseTipsText}>Browse Tips</Text>
          <Ionicons name="arrow-forward" size={18} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )

  const renderSearchBar = () => (
    <Animated.View
      style={[
        styles.searchContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color="#9C27B0" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your bookmarks..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#757575" />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  )

  const renderCategoryFilter = () => (
    <Animated.View
      style={[
        styles.categoryContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
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
              style={[styles.categoryButtonText, selectedCategory === category.id && styles.categoryButtonTextActive]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  )

  const renderHeader = () => (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <LinearGradient
        colors={["#9C27B0", "#7B1FA2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Bookmarks</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerActionButton}
                onPress={() => setSortBy(sortBy === "recent" ? "title" : "recent")}
                activeOpacity={0.7}
              >
                <Ionicons name={sortBy === "recent" ? "time-outline" : "text-outline"} size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerActionButton}
                onPress={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                activeOpacity={0.7}
              >
                <Ionicons name={viewMode === "list" ? "list" : "grid"} size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statCount}>{bookmarkedTips.length}</Text>
              <Text style={styles.statLabel}>Saved Tips</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statCount}>
                {bookmarkedTips.reduce((total, tip) => total + Number.parseInt(tip.readTime.split(" ")[0]), 0)}
              </Text>
              <Text style={styles.statLabel}>Min Read</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statCount}>{Object.keys(tipCategories).length - 1}</Text>
              <Text style={styles.statLabel}>Categories</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </Animated.View>
  )

  const filteredBookmarks = getFilteredBookmarks()

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9C27B0" />

      {renderHeader()}

      <View style={styles.contentContainer}>
        {renderSearchBar()}
        {renderCategoryFilter()}

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading your bookmarks...</Text>
          </View>
        ) : filteredBookmarks.length > 0 ? (
          <FlatList
            data={filteredBookmarks}
            renderItem={viewMode === "list" ? renderListItem : renderGridItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={viewMode === "list" ? styles.listContent : styles.gridContent}
            numColumns={viewMode === "grid" ? 2 : 1}
            key={viewMode} // Force re-render when view mode changes
            showsVerticalScrollIndicator={false}
          />
        ) : (
          renderEmptyState()
        )}
      </View>

      {renderTipDetail()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    width: "100%",
  },
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 0 : 40,
    paddingBottom: 25,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
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
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  headerActions: {
    flexDirection: "row",
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  headerStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statCount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  contentContainer: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#F8F9FA",
    paddingTop: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
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
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#2C3E50",
  },
  clearButton: {
    padding: 4,
  },
  categoryContainer: {
    marginBottom: 15,
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  gridContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  listItemContainer: {
    marginBottom: 15,
  },
  listItem: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  listItemGradient: {
    borderRadius: 16,
    padding: 16,
  },
  listItemHeader: {
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
  listItemTitleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  listItemMeta: {
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
  removeButton: {
    padding: 5,
  },
  listItemDescription: {
    fontSize: 14,
    color: "#5D6D7E",
    lineHeight: 20,
    marginBottom: 12,
  },
  listItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: 12,
  },
  authorText: {
    fontSize: 12,
    color: "#7F8C8D",
    fontStyle: "italic",
  },
  trimesterContainer: {
    flexDirection: "row",
  },
  trimesterTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 6,
  },
  trimesterText: {
    fontSize: 10,
    fontWeight: "600",
  },
  gridItemContainer: {
    width: "50%",
    padding: 5,
    marginBottom: 5,
  },
  gridItem: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    height: 150,
  },
  gridItemGradient: {
    borderRadius: 16,
    padding: 12,
    height: "100%",
    justifyContent: "space-between",
  },
  gridItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  gridIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  gridRemoveButton: {
    padding: 4,
  },
  gridItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 10,
    flex: 1,
  },
  gridItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: 10,
  },
  gridCategoryText: {
    fontSize: 11,
    fontWeight: "600",
  },
  gridReadTime: {
    fontSize: 11,
    color: "#7F8C8D",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2C3E50",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  browseTipsButton: {
    borderRadius: 25,
    shadowColor: "#9C27B0",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  browseTipsGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
  },
  browseTipsText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#7F8C8D",
  },
  tipDetailOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  tipDetailContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: -5 },
    elevation: 10,
  },
  tipDetailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  closeDetailButton: {
    padding: 5,
  },
  removeDetailButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  removeDetailText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF5722",
    marginLeft: 5,
  },
  tipDetailContent: {
    padding: 20,
  },
  tipDetailIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
  },
  tipDetailMeta: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
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
  tipDetailAuthor: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#F8F9FA",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: "center",
  },
  tipDetailAuthorText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    marginLeft: 8,
  },
  tipDetailTrimesters: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  tipDetailTrimester: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  tipDetailTrimesterText: {
    fontSize: 12,
    fontWeight: "600",
  },
  tipDetailDescription: {
    fontSize: 16,
    color: "#2C3E50",
    lineHeight: 24,
    marginBottom: 30,
  },
  tipDetailTags: {
    marginBottom: 30,
  },
  tipDetailTagsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 10,
  },
  tipDetailTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tipDetailTag: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tipDetailTagText: {
    fontSize: 12,
    color: "#5D6D7E",
  },
})

export default BookmarksScreen
