import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, AppColors } from "@/constants/theme";
import {
  getUserProgress,
  getUserSettings,
  UserProgress,
  UserSettings,
  clearAllData,
  getXpProgressInLevel,
} from "@/lib/storage";

interface AchievementBadgeProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  description: string;
  color: string;
  unlocked: boolean;
}

function AchievementBadge({ icon, title, description, color, unlocked }: AchievementBadgeProps) {
  const { theme } = useTheme();
  
  return (
    <View style={[
      styles.achievementBadge,
      { backgroundColor: unlocked ? color + "20" : theme.backgroundSecondary },
      !unlocked && { opacity: 0.5 }
    ]}>
      <View style={[
        styles.achievementIcon,
        { backgroundColor: unlocked ? color + "30" : theme.backgroundTertiary }
      ]}>
        <Feather
          name={unlocked ? icon : "lock"}
          size={24}
          color={unlocked ? color : theme.textSecondary}
        />
      </View>
      <ThemedText type="small" style={styles.achievementTitle} numberOfLines={1}>
        {title}
      </ThemedText>
      <ThemedText type="caption" style={{ color: theme.textSecondary, textAlign: "center" }} numberOfLines={2}>
        {description}
      </ThemedText>
    </View>
  );
}

const ACHIEVEMENTS = [
  { id: "first_drill", icon: "play" as const, title: "First Steps", description: "Complete your first drill", color: AppColors.success },
  { id: "streak_3", icon: "zap" as const, title: "On Fire", description: "3 day streak", color: AppColors.accent },
  { id: "streak_7", icon: "award" as const, title: "Dedicated", description: "7 day streak", color: AppColors.gold },
  { id: "accuracy_80", icon: "target" as const, title: "Sharp Shooter", description: "80% accuracy", color: AppColors.skyBlue },
  { id: "level_10", icon: "star" as const, title: "Rising Star", description: "Reach level 10", color: "#9B59B6" },
  { id: "drills_50", icon: "book" as const, title: "Scholar", description: "Complete 50 drills", color: AppColors.primary },
];

interface SettingsRowProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}

function SettingsRow({ icon, title, value, onPress, danger }: SettingsRowProps) {
  const { theme, appColors } = useTheme();
  
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingsRow,
        { backgroundColor: pressed ? theme.backgroundSecondary : theme.backgroundDefault }
      ]}
    >
      <View style={[styles.settingsIcon, { backgroundColor: danger ? appColors.accent + "20" : theme.backgroundSecondary }]}>
        <Feather name={icon} size={18} color={danger ? appColors.accent : theme.text} />
      </View>
      <ThemedText type="body" style={[styles.settingsTitle, danger && { color: appColors.accent }]}>
        {title}
      </ThemedText>
      {value ? (
        <ThemedText type="small" style={{ color: theme.textSecondary }}>{value}</ThemedText>
      ) : null}
      <Feather name="chevron-right" size={18} color={theme.textSecondary} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, appColors } = useTheme();
  
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);

  const loadData = useCallback(async () => {
    const [progressData, settingsData] = await Promise.all([
      getUserProgress(),
      getUserSettings(),
    ]);
    setProgress(progressData);
    setSettings(settingsData);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleResetProgress = () => {
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset all your progress? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await clearAllData();
            await loadData();
          },
        },
      ]
    );
  };

  const xpProgress = progress ? getXpProgressInLevel(progress.xp) : 0;
  const accuracy = progress && progress.totalAnswers > 0
    ? Math.round((progress.correctAnswers / progress.totalAnswers) * 100)
    : 0;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.lg,
        paddingBottom: tabBarHeight + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileHeader}>
        <View style={[styles.avatar, { backgroundColor: appColors.primary }]}>
          <Feather name="user" size={40} color="#FFFFFF" />
        </View>
        <ThemedText type="h3" style={styles.displayName}>Warrior</ThemedText>
        <View style={[styles.levelBadge, { backgroundColor: appColors.gold + "20" }]}>
          <Feather name="star" size={14} color={appColors.gold} />
          <ThemedText type="small" style={{ color: appColors.gold, fontWeight: "600", marginLeft: Spacing.xs }}>
            Level {progress?.level || 1}
          </ThemedText>
        </View>
      </View>

      <View style={[styles.xpBar, { backgroundColor: theme.backgroundSecondary }]}>
        <View style={[styles.xpProgress, { width: `${xpProgress}%`, backgroundColor: appColors.gold }]} />
      </View>
      <ThemedText type="caption" style={[styles.xpText, { color: theme.textSecondary }]}>
        {xpProgress}/100 XP to next level
      </ThemedText>

      <View style={styles.statsGrid}>
        <View style={[styles.statItem, { backgroundColor: theme.backgroundDefault }]}>
          <Feather name="zap" size={20} color={appColors.gold} />
          <ThemedText type="h4" style={styles.statValue}>{progress?.xp || 0}</ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>Total XP</ThemedText>
        </View>
        <View style={[styles.statItem, { backgroundColor: theme.backgroundDefault }]}>
          <Feather name="target" size={20} color={appColors.success} />
          <ThemedText type="h4" style={styles.statValue}>{accuracy}%</ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>Accuracy</ThemedText>
        </View>
        <View style={[styles.statItem, { backgroundColor: theme.backgroundDefault }]}>
          <Feather name="book" size={20} color={appColors.skyBlue} />
          <ThemedText type="h4" style={styles.statValue}>{progress?.totalDrills || 0}</ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>Drills</ThemedText>
        </View>
        <View style={[styles.statItem, { backgroundColor: theme.backgroundDefault }]}>
          <Feather name="trending-up" size={20} color={appColors.accent} />
          <ThemedText type="h4" style={styles.statValue}>{progress?.streak || 0}</ThemedText>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>Streak</ThemedText>
        </View>
      </View>

      <ThemedText type="h4" style={styles.sectionTitle}>Achievements</ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.achievementsScroll}
      >
        {ACHIEVEMENTS.map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            icon={achievement.icon}
            title={achievement.title}
            description={achievement.description}
            color={achievement.color}
            unlocked={progress?.achievements?.includes(achievement.id) || false}
          />
        ))}
      </ScrollView>

      <ThemedText type="h4" style={styles.sectionTitle}>Settings</ThemedText>
      <Card elevation={1} style={styles.settingsCard}>
        <SettingsRow
          icon="book"
          title="Bible Version"
          value={settings?.bibleVersion || "NIV"}
        />
        <SettingsRow
          icon="sliders"
          title="Skill Level"
          value={settings?.skillLevel ? settings.skillLevel.charAt(0).toUpperCase() + settings.skillLevel.slice(1) : "Novice"}
        />
        <SettingsRow
          icon="bell"
          title="Notifications"
          value="On"
        />
        <SettingsRow
          icon="moon"
          title="Theme"
          value="System"
        />
      </Card>

      <Card elevation={1} style={styles.settingsCard}>
        <SettingsRow
          icon="trash-2"
          title="Reset Progress"
          onPress={handleResetProgress}
          danger
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  displayName: {
    marginBottom: Spacing.sm,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  xpBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: Spacing.xs,
    overflow: "hidden",
  },
  xpProgress: {
    height: "100%",
    borderRadius: 4,
  },
  xpText: {
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statItem: {
    flex: 1,
    minWidth: "45%",
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  statValue: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  achievementsScroll: {
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  achievementBadge: {
    width: 120,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  achievementTitle: {
    fontWeight: "600",
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  settingsCard: {
    padding: 0,
    marginBottom: Spacing.lg,
    overflow: "hidden",
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  settingsIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  settingsTitle: {
    flex: 1,
  },
});
