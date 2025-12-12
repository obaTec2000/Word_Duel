import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, AppColors } from "@/constants/theme";
import { getDailyVerse } from "@/lib/bible-data";
import { getUserProgress, UserProgress } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface StatCardProps {
  icon: keyof typeof Feather.glyphMap;
  value: string | number;
  label: string;
  color: string;
}

function StatCard({ icon, value, label, color }: StatCardProps) {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}>
      <View style={[styles.statIconContainer, { backgroundColor: color + "20" }]}>
        <Feather name={icon} size={20} color={color} />
      </View>
      <ThemedText type="h4" style={styles.statValue}>{value}</ThemedText>
      <ThemedText type="caption" style={{ color: theme.textSecondary }}>{label}</ThemedText>
    </View>
  );
}

interface QuickActionProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}

function QuickAction({ icon, label, color, onPress }: QuickActionProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.quickAction, { backgroundColor: theme.backgroundDefault }, animatedStyle]}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: color + "20" }]}>
        <Feather name={icon} size={24} color={color} />
      </View>
      <ThemedText type="small" style={styles.quickActionLabel}>{label}</ThemedText>
    </AnimatedPressable>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, appColors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const dailyVerse = getDailyVerse();

  const loadProgress = useCallback(async () => {
    const data = await getUserProgress();
    setProgress(data);
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const startDrill = (mode: string, difficulty: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Drill", { mode, difficulty });
  };

  const accuracy = progress && progress.totalAnswers > 0
    ? Math.round((progress.correctAnswers / progress.totalAnswers) * 100)
    : 0;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.lg,
        paddingBottom: tabBarHeight + Spacing["5xl"] + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <Card elevation={1} style={styles.verseCard}>
        <View style={styles.verseHeader}>
          <View style={[styles.verseIconContainer, { backgroundColor: appColors.gold + "20" }]}>
            <Feather name="book-open" size={18} color={appColors.gold} />
          </View>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>Daily Verse</ThemedText>
        </View>
        <ThemedText type="body" style={styles.verseText}>
          "{dailyVerse.text}"
        </ThemedText>
        <ThemedText type="small" style={[styles.verseReference, { color: appColors.gold }]}>
          {dailyVerse.reference}
        </ThemedText>
      </Card>

      <ThemedText type="h4" style={styles.sectionTitle}>Your Progress</ThemedText>
      <View style={styles.statsGrid}>
        <StatCard
          icon="zap"
          value={progress?.xp || 0}
          label="XP"
          color={appColors.gold}
        />
        <StatCard
          icon="star"
          value={progress?.level || 1}
          label="Level"
          color={appColors.skyBlue}
        />
        <StatCard
          icon="target"
          value={`${accuracy}%`}
          label="Accuracy"
          color={appColors.success}
        />
        <StatCard
          icon="trending-up"
          value={progress?.streak || 0}
          label="Streak"
          color={appColors.accent}
        />
      </View>

      <ThemedText type="h4" style={styles.sectionTitle}>Quick Actions</ThemedText>
      <View style={styles.quickActionsGrid}>
        <QuickAction
          icon="play-circle"
          label="Quick Drill"
          color={appColors.accent}
          onPress={() => startDrill("timed", "novice")}
        />
        <QuickAction
          icon="clock"
          label="5 Min Challenge"
          color={appColors.gold}
          onPress={() => startDrill("timed", "intermediate")}
        />
        <QuickAction
          icon="book"
          label="Category"
          color={appColors.skyBlue}
          onPress={() => startDrill("category", "novice")}
        />
        <QuickAction
          icon="zap"
          label="Speed Run"
          color={appColors.success}
          onPress={() => startDrill("speed", "advanced")}
        />
      </View>

      {progress && progress.totalDrills > 0 ? (
        <>
          <ThemedText type="h4" style={styles.sectionTitle}>Recent Activity</ThemedText>
          <Card elevation={1}>
            <View style={styles.activityItem}>
              <Feather name="check-circle" size={20} color={appColors.success} />
              <View style={styles.activityContent}>
                <ThemedText type="body">
                  {progress.totalDrills} drills completed
                </ThemedText>
                <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                  {progress.correctAnswers} correct answers
                </ThemedText>
              </View>
            </View>
          </Card>
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  verseCard: {
    marginBottom: Spacing.xl,
  },
  verseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  verseIconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  verseText: {
    fontStyle: "italic",
    marginBottom: Spacing.md,
  },
  verseReference: {
    fontWeight: "600",
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
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
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  statValue: {
    marginBottom: Spacing.xs,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  quickAction: {
    flex: 1,
    minWidth: "45%",
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  quickActionLabel: {
    fontWeight: "500",
    textAlign: "center",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityContent: {
    marginLeft: Spacing.md,
    flex: 1,
  },
});
