import React from "react";
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
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, AppColors } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TrainingModeCardProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  description: string;
  color: string;
  difficulty: string;
  onPress: () => void;
}

function TrainingModeCard({ icon, title, description, color, difficulty, onPress }: TrainingModeCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "Easy": return AppColors.success;
      case "Medium": return AppColors.gold;
      case "Hard": return AppColors.accent;
      default: return AppColors.skyBlue;
    }
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.modeCard, { backgroundColor: theme.backgroundDefault }, animatedStyle]}
    >
      <View style={[styles.modeIconContainer, { backgroundColor: color + "20" }]}>
        <Feather name={icon} size={28} color={color} />
      </View>
      <View style={styles.modeContent}>
        <View style={styles.modeHeader}>
          <ThemedText type="h4">{title}</ThemedText>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor() + "20" }]}>
            <ThemedText type="caption" style={{ color: getDifficultyColor(), fontWeight: "600" }}>
              {difficulty}
            </ThemedText>
          </View>
        </View>
        <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: Spacing.xs }}>
          {description}
        </ThemedText>
      </View>
      <Feather name="chevron-right" size={20} color={theme.textSecondary} />
    </AnimatedPressable>
  );
}

const TRAINING_MODES = [
  {
    id: "timed",
    icon: "clock" as const,
    title: "Timed Sword Drill",
    description: "Race against the clock to find Bible verses quickly",
    color: AppColors.accent,
    difficulty: "Easy",
  },
  {
    id: "speed",
    icon: "zap" as const,
    title: "Speed Mastery",
    description: "Progressive difficulty with shrinking time limits",
    color: AppColors.gold,
    difficulty: "Hard",
  },
  {
    id: "category",
    icon: "layers" as const,
    title: "Category Mastery",
    description: "Master books by category: Pentateuch, Gospels, and more",
    color: AppColors.skyBlue,
    difficulty: "Medium",
  },
  {
    id: "marathon",
    icon: "trending-up" as const,
    title: "Marathon Mode",
    description: "Extended training session for serious Bible warriors",
    color: AppColors.success,
    difficulty: "Hard",
  },
  {
    id: "practice",
    icon: "book-open" as const,
    title: "Practice Mode",
    description: "No timer, no pressure - just learning at your own pace",
    color: "#9B59B6",
    difficulty: "Easy",
  },
];

export default function TrainScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, appColors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const startDrill = (mode: string, difficulty: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Drill", { mode, difficulty });
  };

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
      <View style={styles.headerSection}>
        <View style={[styles.headerIcon, { backgroundColor: appColors.accent + "20" }]}>
          <Feather name="target" size={32} color={appColors.accent} />
        </View>
        <ThemedText type="h3" style={styles.headerTitle}>Training Modes</ThemedText>
        <ThemedText type="body" style={{ color: theme.textSecondary, textAlign: "center" }}>
          Choose a training mode to sharpen your Bible navigation skills
        </ThemedText>
      </View>

      <View style={styles.modesContainer}>
        {TRAINING_MODES.map((mode) => (
          <TrainingModeCard
            key={mode.id}
            icon={mode.icon}
            title={mode.title}
            description={mode.description}
            color={mode.color}
            difficulty={mode.difficulty}
            onPress={() => startDrill(mode.id, mode.difficulty.toLowerCase())}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  modesContainer: {
    gap: Spacing.md,
  },
  modeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  modeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.lg,
  },
  modeContent: {
    flex: 1,
  },
  modeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
});
