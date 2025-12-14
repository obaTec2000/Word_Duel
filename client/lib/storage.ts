import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  USER_PROGRESS: "@draw_sword_progress",
  USER_SETTINGS: "@draw_sword_settings",
  DRILL_HISTORY: "@draw_sword_drill_history",
};

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastPlayedDate: string;
  totalDrills: number;
  correctAnswers: number;
  totalAnswers: number;
  fastestTime: number;
  averageTime: number;
  bookStats: Record<string, { correct: number; total: number }>;
  achievements: string[];
}

export interface UserSettings {
  bibleVersion: string;
  skillLevel: "novice" | "intermediate" | "advanced" | "master";
  soundEnabled: boolean;
  hapticEnabled: boolean;
  dailyGoal: number;
}

export interface DrillResult {
  id: string;
  date: string;
  mode: string;
  difficulty: string;
  correctAnswers: number;
  totalAnswers: number;
  timeSeconds: number;
  xpEarned: number;
}

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  lastPlayedDate: "",
  totalDrills: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  fastestTime: 0,
  averageTime: 0,
  bookStats: {},
  achievements: [],
};

const DEFAULT_SETTINGS: UserSettings = {
  bibleVersion: "NIV",
  skillLevel: "novice",
  soundEnabled: true,
  hapticEnabled: true,
  dailyGoal: 5,
};

export async function getRecentActivity(): Promise<ActivityItem[]> {
  try {
    const history = await getDrillHistory();
    const recent = history.slice(0, 4);
    return recent.map((drill, index) => {
      const icons = {
        timed: "clock",
        competition: "award",
        category: "folder",
        speed: "zap",
        random: "shuffle",
      } as const;
      const colors = {
        timed: "#E74C3C",
        competition: "#F1C40F",
        category: "#3498DB",
        speed: "#27AE60",
        random: "#9B59B6",
      } as const;
      const timeAgo = (index: number): string => {
        if (index === 0) return "Just now";
        if (index === 1) return "1 hour ago";
        if (index === 2) return "Yesterday";
        return `${index + 1} days ago`;
      };
      return {
        id: drill.id,
        type: drill.mode,
        title: `${drill.mode.charAt(0).toUpperCase() + drill.mode.slice(1)} Drill`,
        description: `${drill.correctAnswers}/${drill.totalAnswers} correct in ${drill.timeSeconds}s`,
        time: timeAgo(index),
        icon: icons[drill.mode as keyof typeof icons] || "activity",
        color: colors[drill.mode as keyof typeof colors] || "#7F8C8D",
      };
    });
  } catch (error) {
    console.error("Error getting recent activity:", error);
    return [];
  }
}

export async function getUserProgress(): Promise<UserProgress> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    if (data) {
      return { ...DEFAULT_PROGRESS, ...JSON.parse(data) };
    }
    return DEFAULT_PROGRESS;
  } catch (error) {
    console.error("Error loading user progress:", error);
    return DEFAULT_PROGRESS;
  }
}

export async function saveUserProgress(progress: UserProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_PROGRESS,
      JSON.stringify(progress),
    );
  } catch (error) {
    console.error("Error saving user progress:", error);
  }
}

export async function getUserSettings(): Promise<UserSettings> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
    if (data) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Error loading user settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveUserSettings(settings: UserSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_SETTINGS,
      JSON.stringify(settings),
    );
  } catch (error) {
    console.error("Error saving user settings:", error);
  }
}

export async function getDrillHistory(): Promise<DrillResult[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.DRILL_HISTORY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error("Error loading drill history:", error);
    return [];
  }
}

export async function saveDrillResult(result: DrillResult): Promise<void> {
  try {
    const history = await getDrillHistory();
    history.unshift(result);
    const trimmedHistory = history.slice(0, 100);
    await AsyncStorage.setItem(
      STORAGE_KEYS.DRILL_HISTORY,
      JSON.stringify(trimmedHistory),
    );
  } catch (error) {
    console.error("Error saving drill result:", error);
  }
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function getXpForLevel(level: number): number {
  return (level - 1) * 100;
}

export function getXpProgressInLevel(xp: number): number {
  return xp % 100;
}
export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  color: string;
}

export function calculateXpReward(
  correct: number,
  total: number,
  timeSeconds: number,
): number {
  const accuracyBonus = Math.floor((correct / total) * 50);
  const speedBonus = Math.max(0, Math.floor((300 - timeSeconds) / 10));
  const baseXp = correct * 10;
  return baseXp + accuracyBonus + speedBonus;
}

export function checkStreak(lastPlayedDate: string): {
  isStreak: boolean;
  newStreak: number;
  currentStreak: number;
} {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (lastPlayedDate === today) {
    return { isStreak: true, newStreak: 0, currentStreak: 0 };
  }
  if (lastPlayedDate === yesterday) {
    return { isStreak: true, newStreak: 1, currentStreak: 1 };
  }
  return { isStreak: false, newStreak: 1, currentStreak: 0 };
}

export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_PROGRESS,
      STORAGE_KEYS.USER_SETTINGS,
      STORAGE_KEYS.DRILL_HISTORY,
    ]);
  } catch (error) {
    console.error("Error clearing data:", error);
  }
}
