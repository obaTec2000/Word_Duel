import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, AppColors } from "@/constants/theme";

interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  level: number;
  isCurrentUser?: boolean;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "BibleWarrior", xp: 15420, level: 42 },
  { rank: 2, name: "SwordMaster", xp: 14890, level: 40 },
  { rank: 3, name: "ScriptureSeeker", xp: 13750, level: 38 },
  { rank: 4, name: "VerseHunter", xp: 12340, level: 35 },
  { rank: 5, name: "FaithFighter", xp: 11200, level: 32 },
  { rank: 6, name: "WordWarrior", xp: 10890, level: 30 },
  { rank: 7, name: "GospelGuard", xp: 9540, level: 28 },
  { rank: 8, name: "You", xp: 0, level: 1, isCurrentUser: true },
];

function PodiumCard({ entry, position }: { entry: LeaderboardEntry; position: 1 | 2 | 3 }) {
  const { theme, appColors } = useTheme();
  
  const getColor = () => {
    switch (position) {
      case 1: return appColors.gold;
      case 2: return "#C0C0C0";
      case 3: return "#CD7F32";
    }
  };

  const getHeight = () => {
    switch (position) {
      case 1: return 100;
      case 2: return 80;
      case 3: return 60;
    }
  };

  return (
    <View style={[styles.podiumCard, { order: position === 1 ? 0 : position === 2 ? -1 : 1 }]}>
      <View style={[styles.podiumAvatar, { backgroundColor: getColor() + "30", borderColor: getColor() }]}>
        <ThemedText type="h3" style={{ color: getColor() }}>{entry.rank}</ThemedText>
      </View>
      <ThemedText type="small" style={styles.podiumName} numberOfLines={1}>
        {entry.name}
      </ThemedText>
      <ThemedText type="caption" style={{ color: theme.textSecondary }}>
        {entry.xp.toLocaleString()} XP
      </ThemedText>
      <View style={[styles.podiumBar, { height: getHeight(), backgroundColor: getColor() + "30" }]}>
        <ThemedText type="h4" style={{ color: getColor() }}>{position}</ThemedText>
      </View>
    </View>
  );
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const { theme, appColors } = useTheme();
  
  return (
    <View style={[
      styles.leaderboardRow,
      { backgroundColor: entry.isCurrentUser ? appColors.gold + "15" : theme.backgroundDefault },
      entry.isCurrentUser && { borderColor: appColors.gold, borderWidth: 1 }
    ]}>
      <View style={styles.rankContainer}>
        <ThemedText type="body" style={[styles.rankText, entry.isCurrentUser && { color: appColors.gold }]}>
          #{entry.rank}
        </ThemedText>
      </View>
      <View style={[styles.avatarSmall, { backgroundColor: entry.isCurrentUser ? appColors.gold + "30" : theme.backgroundSecondary }]}>
        <Feather name="user" size={16} color={entry.isCurrentUser ? appColors.gold : theme.textSecondary} />
      </View>
      <View style={styles.userInfo}>
        <ThemedText type="body" style={entry.isCurrentUser && { fontWeight: "600" }}>
          {entry.name}
        </ThemedText>
        <ThemedText type="caption" style={{ color: theme.textSecondary }}>
          Level {entry.level}
        </ThemedText>
      </View>
      <ThemedText type="body" style={[styles.xpText, entry.isCurrentUser && { color: appColors.gold }]}>
        {entry.xp.toLocaleString()}
      </ThemedText>
    </View>
  );
}

type TabType = "global" | "church" | "friends";

export default function CompeteScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, appColors } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>("global");

  const topThree = MOCK_LEADERBOARD.slice(0, 3);
  const restOfList = MOCK_LEADERBOARD.slice(3);

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
      <View style={[styles.tabContainer, { backgroundColor: theme.backgroundDefault }]}>
        {(["global", "church", "friends"] as TabType[]).map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && { backgroundColor: appColors.primary }
            ]}
          >
            <ThemedText
              type="small"
              style={[
                styles.tabText,
                activeTab === tab && { color: "#FFFFFF" }
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <View style={styles.podiumContainer}>
        <PodiumCard entry={topThree[1]} position={2} />
        <PodiumCard entry={topThree[0]} position={1} />
        <PodiumCard entry={topThree[2]} position={3} />
      </View>

      <View style={styles.listContainer}>
        {restOfList.map((entry) => (
          <LeaderboardRow key={entry.rank} entry={entry} />
        ))}
      </View>

      <View style={[styles.infoCard, { backgroundColor: theme.backgroundDefault }]}>
        <Feather name="info" size={20} color={appColors.skyBlue} />
        <ThemedText type="small" style={{ color: theme.textSecondary, flex: 1, marginLeft: Spacing.md }}>
          Complete drills to earn XP and climb the leaderboard. Rankings update daily.
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    borderRadius: BorderRadius.sm,
    padding: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
  },
  tabText: {
    fontWeight: "600",
  },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: Spacing["2xl"],
    paddingHorizontal: Spacing.lg,
  },
  podiumCard: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  podiumAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  podiumName: {
    fontWeight: "600",
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  podiumBar: {
    width: "100%",
    borderTopLeftRadius: BorderRadius.xs,
    borderTopRightRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.sm,
  },
  listContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  leaderboardRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  rankContainer: {
    width: 40,
  },
  rankText: {
    fontWeight: "600",
  },
  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  xpText: {
    fontWeight: "600",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
});
