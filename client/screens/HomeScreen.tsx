import { Feather } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Card } from "@/components/Card";
import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import {
  BIBLE_BOOKS,
  BIBLE_CATEGORIES,
  getBooksByCategory,
  getDailyVerse,
  getRandomBook,
  getRandomVerse,
} from "@/lib/bible-data";
import {
  getRecentActivity,
  getUserProgress,
  UserProgress,
} from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const { width } = Dimensions.get("window");
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface StatCardProps {
  icon: keyof typeof Feather.glyphMap;
  value: string | number;
  label: string;
  color: string;
  delay?: number;
}

function StatCard({ icon, value, label, color, delay = 0 }: StatCardProps) {
  const { theme } = useTheme();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  React.useEffect(() => {
    setTimeout(() => {
      opacity.value = withSpring(1, { damping: 15 });
      translateY.value = withSpring(0, { damping: 15 });
    }, delay * 100);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.statCard,
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      <View
        style={[styles.statIconContainer, { backgroundColor: color + "20" }]}
      >
        <Feather name={icon} size={20} color={color} />
      </View>
      <ThemedText type="h4" style={styles.statValue}>
        {value}
      </ThemedText>
      <ThemedText type="caption" style={{ color: theme.textSecondary }}>
        {label}
      </ThemedText>
    </Animated.View>
  );
}

interface QuickActionProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  subtitle?: string;
  color: string;
  onPress: () => void;
  delay?: number;
}

function QuickAction({
  icon,
  label,
  subtitle,
  color,
  onPress,
  delay = 0,
}: QuickActionProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(30);

  React.useEffect(() => {
    setTimeout(() => {
      opacity.value = withSpring(1, { damping: 15 });
      translateX.value = withSpring(0, { damping: 15 });
    }, delay * 100);
  }, []);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View style={animatedContainerStyle}>
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.quickAction,
          { backgroundColor: theme.backgroundDefault },
          animatedButtonStyle,
        ]}
      >
        <View
          style={[styles.quickActionIcon, { backgroundColor: color + "20" }]}
        >
          <Feather name={icon} size={24} color={color} />
        </View>
        <View style={styles.quickActionTextContainer}>
          <ThemedText type="small" style={styles.quickActionLabel}>
            {label}
          </ThemedText>
          {subtitle && (
            <ThemedText
              type="caption"
              style={[
                styles.quickActionSubtitle,
                { color: theme.textSecondary },
              ]}
            >
              {subtitle}
            </ThemedText>
          )}
        </View>
        <Feather name="chevron-right" size={16} color={theme.textSecondary} />
      </AnimatedPressable>
    </Animated.View>
  );
}

interface TrainingModeCardProps {
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  onPress: () => void;
  delay?: number;
}

function TrainingModeCard({
  title,
  description,
  icon,
  color,
  onPress,
  delay = 0,
}: TrainingModeCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(40);

  React.useEffect(() => {
    setTimeout(() => {
      opacity.value = withSpring(1, { damping: 15 });
      translateY.value = withSpring(0, { damping: 15 });
    }, delay * 100);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.trainingCard, animatedStyle]}
    >
      <LinearGradient
        colors={[color + "DD", color + "80"]}
        style={styles.trainingCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.trainingCardContent}>
          <View style={styles.trainingCardIcon}>
            <Feather name={icon} size={32} color="#FFF" />
          </View>
          <View style={styles.trainingCardText}>
            <ThemedText type="h4" style={styles.trainingCardTitle}>
              {title}
            </ThemedText>
            <ThemedText type="caption" style={styles.trainingCardDescription}>
              {description}
            </ThemedText>
          </View>
          <Feather
            name="arrow-right"
            size={24}
            color="#FFF"
            style={{ opacity: 0.8 }}
          />
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
}

interface CategoryBadgeProps {
  name: string;
  bookCount: number;
  color: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  delay?: number;
}

function CategoryBadge({
  name,
  bookCount,
  color,
  icon,
  onPress,
  delay = 0,
}: CategoryBadgeProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  React.useEffect(() => {
    setTimeout(() => {
      opacity.value = withSpring(1, { damping: 15 });
      translateY.value = withSpring(0, { damping: 15 });
    }, delay * 100);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.categoryBadge, animatedStyle]}
    >
      <LinearGradient
        colors={[color + "20", color + "05"]}
        style={styles.categoryBadgeGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View
          style={[
            styles.categoryIconContainer,
            { backgroundColor: color + "30" },
          ]}
        >
          <Feather name={icon} size={18} color={color} />
        </View>
        <View style={styles.categoryTextContainer}>
          <ThemedText
            type="small"
            style={[styles.categoryName, { color: color }]}
          >
            {name}
          </ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            {bookCount} books
          </ThemedText>
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
}

interface RecentActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, appColors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [greeting, setGreeting] = useState("");
  const [dailyVerse, setDailyVerse] = useState({ text: "", reference: "" });
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>(
    [],
  );
  const [refreshing, setRefreshing] = useState(false);

  const scrollY = useSharedValue(0);
  const scrollRef = useRef<ScrollView>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const loadProgress = useCallback(async () => {
    try {
      const [progressData, activity] = await Promise.all([
        getUserProgress(),
        getRecentActivity(),
      ]);
      const verse = getDailyVerse();
      setProgress(progressData);
      setDailyVerse(verse);
      setGreeting(getGreeting());
      setRecentActivity(activity);
    } catch (error) {
      console.error("Failed to load progress:", error);
      // Set default data on error
      setProgress({
        xp: 1250,
        level: 3,
        streak: 7,
        totalAnswers: 145,
        correctAnswers: 120,
        totalDrills: 45,
      });
      setDailyVerse(getDailyVerse());
      setGreeting(getGreeting());
      setRecentActivity([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [loadProgress]),
  );

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProgress();
    setRefreshing(false);
  }, [loadProgress]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const startDrill = (mode: string, difficulty: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Drill", { mode, difficulty });
  };

  const startRandomDrill = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const randomBook = getRandomBook();
    const randomVerse = getRandomVerse(randomBook);
    navigation.navigate("Drill", {
      mode: "random",
      difficulty: "novice",
      book: randomBook.name,
      chapter: randomVerse.chapter,
      verse: randomVerse.verse,
    });
  };

  const startCategoryDrill = (categoryKey: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const categoryBooks = getBooksByCategory(categoryKey);
    if (categoryBooks.length > 0) {
      const randomBook =
        categoryBooks[Math.floor(Math.random() * categoryBooks.length)];
      const randomVerse = getRandomVerse(randomBook);
      navigation.navigate("Drill", {
        mode: "category",
        difficulty: "novice",
        category: categoryKey,
        book: randomBook.name,
        chapter: randomVerse.chapter,
        verse: randomVerse.verse,
      });
    }
  };

  const accuracy =
    progress && progress.totalAnswers > 0
      ? Math.round((progress.correctAnswers / progress.totalAnswers) * 100)
      : 0;

  const trainingModes = [
    {
      id: "timed",
      title: "Timed Drill",
      description: "Find verses against the clock",
      icon: "clock" as const,
      color: appColors.accent,
      onPress: () => navigation.navigate("TrainingSelection"),
    },
    {
      id: "competition",
      title: "Competition Mode",
      description: "Simulate real sword drill competitions",
      icon: "award" as const, // Changed from "trophy"
      color: appColors.gold,
      onPress: () => navigation.navigate("CompetitionSetup"),
    },
    {
      id: "category",
      title: "Category Practice",
      description: "Focus on specific Bible sections",
      icon: "folder" as const,
      color: appColors.skyBlue,
      onPress: () => navigation.navigate("CategorySelection"),
    },
    {
      id: "speed",
      title: "Speed Mastery",
      description: "Progressive difficulty survival mode",
      icon: "zap" as const,
      color: appColors.success,
      onPress: () => navigation.navigate("SpeedMastery"),
    },
  ];

  const quickActions = [
    {
      icon: "shuffle" as const,
      label: "Random Drill",
      subtitle: "Random book & chapter",
      color: appColors.accent,
      onPress: startRandomDrill,
    },
    {
      icon: "clock" as const,
      label: "5 Min Challenge",
      subtitle: "Test your endurance",
      color: appColors.gold,
      onPress: () => startDrill("timed", "intermediate"),
    },
    {
      icon: "target" as const,
      label: "Daily Goal",
      subtitle: "Complete 10 drills",
      color: appColors.success,
      onPress: () => navigation.navigate("Goals"),
    },
    {
      icon: "award" as const,
      label: "Achievements",
      subtitle: "View your badges",
      color: appColors.skyBlue,
      onPress: () => navigation.navigate("Achievements"),
    },
  ];

  const categoryData = [
    {
      key: "pentateuch",
      name: BIBLE_CATEGORIES.pentateuch,
      icon: "book" as const, // Changed from "book-open"
      color: "#3498DB",
      bookCount: getBooksByCategory("pentateuch").length,
    },
    {
      key: "gospels",
      name: BIBLE_CATEGORIES.gospels,
      icon: "book-open" as const, // Changed from "cross"
      color: "#27AE60",
      bookCount: getBooksByCategory("gospels").length,
    },
    {
      key: "pauline",
      name: BIBLE_CATEGORIES.pauline,
      icon: "mail" as const,
      color: "#9B59B6",
      bookCount: getBooksByCategory("pauline").length,
    },
    {
      key: "wisdom",
      name: BIBLE_CATEGORIES.wisdom,
      icon: "feather" as const,
      color: "#F39C12",
      bookCount: getBooksByCategory("wisdom").length,
    },
  ];

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [1, 0]);
    const scale = interpolate(scrollY.value, [0, 100], [1, 0.95]);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.md,
        paddingBottom: tabBarHeight + Spacing["5xl"] + Spacing.xl,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      showsVerticalScrollIndicator={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={appColors.accent}
          colors={[appColors.accent]}
        />
      }
    >
      <View style={[styles.container, { paddingHorizontal: Spacing.lg }]}>
        {/* Greeting Header */}
        <Animated.View style={[styles.greetingContainer, headerAnimatedStyle]}>
          <ThemedText type="h1" style={styles.greetingText}>
            {greeting}, Warrior! ⚔️
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.greetingSubtitle, { color: theme.textSecondary }]}
          >
            Ready to sharpen your sword?
          </ThemedText>
        </Animated.View>

        {/* Daily Verse Card */}
        <Card elevation={2} style={styles.verseCard}>
          <View style={styles.verseHeader}>
            <View
              style={[
                styles.verseIconContainer,
                { backgroundColor: appColors.gold + "20" },
              ]}
            >
              <Feather name="book-open" size={18} color={appColors.gold} />
            </View>
            <View style={styles.verseTitleContainer}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Daily Verse
              </ThemedText>
              <ThemedText
                type="caption"
                style={{ color: appColors.gold, fontWeight: "600" }}
              >
                Draw inspiration for today
              </ThemedText>
            </View>
            <Pressable
              onPress={() =>
                navigation.navigate("Bible", {
                  reference: dailyVerse.reference,
                })
              }
              style={styles.externalLinkButton}
            >
              <Feather
                name="external-link"
                size={16}
                color={theme.textSecondary}
              />
            </Pressable>
          </View>
          <ThemedText type="body" style={styles.verseText}>
            "{dailyVerse.text}"
          </ThemedText>
          <View style={styles.verseFooter}>
            <ThemedText
              type="small"
              style={[styles.verseReference, { color: appColors.gold }]}
            >
              {dailyVerse.reference}
            </ThemedText>
            <Pressable
              style={styles.practiceButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate("Drill", {
                  mode: "verse",
                  difficulty: "novice",
                  reference: dailyVerse.reference,
                });
              }}
            >
              <ThemedText
                type="caption"
                style={{ color: appColors.gold, fontWeight: "600" }}
              >
                Practice This Verse
              </ThemedText>
            </Pressable>
          </View>
        </Card>

        {/* Stats Grid */}
        <ThemedText type="h4" style={styles.sectionTitle}>
          Your Progress
        </ThemedText>
        <View style={styles.statsGrid}>
          <StatCard
            icon="zap"
            value={progress?.xp || 0}
            label="XP Points"
            color={appColors.gold}
            delay={0}
          />
          <StatCard
            icon="star"
            value={progress?.level || 1}
            label="Level"
            color={appColors.skyBlue}
            delay={1}
          />
          <StatCard
            icon="target"
            value={`${accuracy}%`}
            label="Accuracy"
            color={appColors.success}
            delay={2}
          />
          <StatCard
            icon="trending-up"
            value={progress?.streak || 0}
            label="Day Streak"
            color={appColors.accent}
            delay={3}
          />
        </View>

        {/* Quick Actions */}
        <ThemedText type="h4" style={styles.sectionTitle}>
          Quick Actions
        </ThemedText>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <QuickAction
              key={action.label}
              icon={action.icon}
              label={action.label}
              subtitle={action.subtitle}
              color={action.color}
              onPress={action.onPress}
              delay={index}
            />
          ))}
        </View>

        {/* Bible Categories */}
        <View style={styles.sectionHeader}>
          <ThemedText type="h4">Bible Categories</ThemedText>
          <Pressable
            onPress={() => navigation.navigate("Categories")}
            style={styles.viewAllButton}
          >
            <ThemedText type="caption" style={{ color: appColors.accent }}>
              View All
            </ThemedText>
            <Feather name="chevron-right" size={14} color={appColors.accent} />
          </Pressable>
        </View>
        <View style={styles.categoriesGrid}>
          {categoryData.map((category, index) => (
            <CategoryBadge
              key={category.key}
              name={category.name}
              bookCount={category.bookCount}
              color={category.color}
              icon={category.icon}
              onPress={() => startCategoryDrill(category.key)}
              delay={index}
            />
          ))}
        </View>

        {/* Training Modes */}
        <ThemedText type="h4" style={styles.sectionTitle}>
          Training Modes
        </ThemedText>
        <View style={styles.trainingGrid}>
          {trainingModes.map((mode, index) => (
            <TrainingModeCard
              key={mode.id}
              title={mode.title}
              description={mode.description}
              icon={mode.icon}
              color={mode.color}
              onPress={mode.onPress}
              delay={index * 2}
            />
          ))}
        </View>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <ThemedText type="h4">Recent Activity</ThemedText>
              <Pressable
                onPress={() => navigation.navigate("History")}
                style={styles.viewAllButton}
              >
                <ThemedText type="caption" style={{ color: appColors.accent }}>
                  See All
                </ThemedText>
                <Feather
                  name="chevron-right"
                  size={14}
                  color={appColors.accent}
                />
              </Pressable>
            </View>
            <Card elevation={1} style={styles.activityCard}>
              {recentActivity.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.activityItem,
                    index < recentActivity.length - 1 &&
                      styles.activityItemBorder,
                  ]}
                >
                  <View
                    style={[
                      styles.activityIcon,
                      { backgroundColor: item.color + "20" },
                    ]}
                  >
                    <Feather name={item.icon} size={16} color={item.color} />
                  </View>
                  <View style={styles.activityContent}>
                    <ThemedText type="small" style={{ fontWeight: "600" }}>
                      {item.title}
                    </ThemedText>
                    <ThemedText
                      type="caption"
                      style={{ color: theme.textSecondary }}
                    >
                      {item.description}
                    </ThemedText>
                  </View>
                  <ThemedText
                    type="caption"
                    style={{ color: theme.textSecondary }}
                  >
                    {item.time}
                  </ThemedText>
                </View>
              ))}
            </Card>
          </>
        )}

        {/* Motivational Quote */}
        <Card
          elevation={0}
          style={[
            styles.motivationCard,
            { backgroundColor: appColors.gold + "10" },
          ]}
        >
          <Feather
            name="award"
            size={24}
            color={appColors.gold}
            style={styles.motivationIcon}
          />
          <View style={styles.motivationContent}>
            <ThemedText
              type="body"
              style={{ fontWeight: "600", marginBottom: Spacing.xs }}
            >
              Keep Going, Champion! 🏆
            </ThemedText>
            <ThemedText
              type="caption"
              style={{ color: theme.textSecondary, lineHeight: 18 }}
            >
              Every verse you master brings you closer to becoming a Sword Drill
              Expert. Your {progress?.streak || 0}-day streak is impressive!
            </ThemedText>
            <Pressable
              style={styles.encouragementButton}
              onPress={() => navigation.navigate("Training", { mode: "timed" })}
            >
              <ThemedText
                type="caption"
                style={{ color: appColors.gold, fontWeight: "600" }}
              >
                Train More →
              </ThemedText>
            </Pressable>
          </View>
        </Card>

        {/* Bible Stats */}
        <Card elevation={1} style={styles.bibleStatsCard}>
          <View style={styles.bibleStatsHeader}>
            <Feather name="book" size={20} color={appColors.skyBlue} />
            <ThemedText type="h4" style={{ marginLeft: Spacing.sm }}>
              Bible Statistics
            </ThemedText>
          </View>
          <View style={styles.bibleStatsGrid}>
            <View style={styles.bibleStat}>
              <ThemedText type="h3" style={{ color: appColors.accent }}>
                {BIBLE_BOOKS.length}
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                Total Books
              </ThemedText>
            </View>
            <View style={styles.bibleStat}>
              <ThemedText type="h3" style={{ color: appColors.gold }}>
                {BIBLE_BOOKS.filter((b) => b.testament === "OT").length}
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                Old Testament
              </ThemedText>
            </View>
            <View style={styles.bibleStat}>
              <ThemedText type="h3" style={{ color: appColors.success }}>
                {BIBLE_BOOKS.filter((b) => b.testament === "NT").length}
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                New Testament
              </ThemedText>
            </View>
          </View>
        </Card>
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greetingContainer: {
    marginBottom: Spacing.xl,
  },
  greetingText: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  greetingSubtitle: {
    fontSize: 16,
  },
  verseCard: {
    marginBottom: Spacing.xl,
  },
  verseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  verseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  verseTitleContainer: {
    flex: 1,
  },
  externalLinkButton: {
    padding: Spacing.xs,
  },
  verseText: {
    fontStyle: "italic",
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  verseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  verseReference: {
    fontWeight: "700",
    fontSize: 15,
  },
  practiceButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    backgroundColor: "rgba(241, 196, 15, 0.1)",
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    marginTop: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
    marginTop: Spacing.xl,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  statValue: {
    marginBottom: Spacing.xs,
    fontSize: 22,
    fontWeight: "700",
  },
  quickActionsGrid: {
    gap: Spacing.md,
  },
  quickAction: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionTextContainer: {
    flex: 1,
  },
  quickActionLabel: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 12,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  categoryBadge: {
    flex: 1,
    minWidth: "45%",
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  categoryBadgeGradient: {
    padding: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryName: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 2,
  },
  trainingGrid: {
    gap: Spacing.md,
  },
  trainingCard: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  trainingCardGradient: {
    padding: Spacing.xl,
  },
  trainingCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  trainingCardIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.lg,
  },
  trainingCardText: {
    flex: 1,
  },
  trainingCardTitle: {
    color: "#FFF",
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  trainingCardDescription: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 13,
  },
  activityCard: {
    marginBottom: Spacing.xl,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  activityItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.08)",
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  motivationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  motivationIcon: {
    marginRight: Spacing.md,
    marginTop: Spacing.xs,
  },
  motivationContent: {
    flex: 1,
  },
  encouragementButton: {
    marginTop: Spacing.md,
    alignSelf: "flex-start",
    paddingVertical: Spacing.xs,
  },
  bibleStatsCard: {
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
  },
  bibleStatsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  bibleStatsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bibleStat: {
    alignItems: "center",
    flex: 1,
  },
});
