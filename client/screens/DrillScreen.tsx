import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, StyleSheet, Pressable, Alert, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, AppColors } from "@/constants/theme";
import { BIBLE_BOOKS, getRandomBook, BibleBook } from "@/lib/bible-data";
import {
  getUserProgress,
  saveUserProgress,
  saveDrillResult,
  calculateXpReward,
  calculateLevel,
  UserProgress,
} from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface DrillQuestion {
  targetBook: BibleBook;
  chapter: number;
  verse: number;
  options: BibleBook[];
}

function generateQuestion(): DrillQuestion {
  const targetBook = getRandomBook();
  const chapter = Math.floor(Math.random() * targetBook.chapters) + 1;
  const verse = Math.floor(Math.random() * 20) + 1;
  
  const shuffledBooks = [...BIBLE_BOOKS].sort(() => Math.random() - 0.5);
  const options = shuffledBooks
    .filter(b => b.name !== targetBook.name)
    .slice(0, 11);
  
  options.push(targetBook);
  options.sort(() => Math.random() - 0.5);
  
  return { targetBook, chapter, verse, options };
}

interface BookButtonProps {
  book: BibleBook;
  onPress: () => void;
  isCorrect: boolean | null;
  isSelected: boolean;
  disabled: boolean;
}

function BookButton({ book, onPress, isCorrect, isSelected, disabled }: BookButtonProps) {
  const { theme, appColors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.95);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const getBackgroundColor = () => {
    if (isSelected && isCorrect === true) return appColors.success;
    if (isSelected && isCorrect === false) return appColors.accent;
    return theme.backgroundDefault;
  };

  const getTextColor = () => {
    if (isSelected && isCorrect !== null) return "#FFFFFF";
    return theme.text;
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.bookButton,
        { backgroundColor: getBackgroundColor() },
        animatedStyle,
      ]}
    >
      <ThemedText type="small" style={[styles.bookButtonText, { color: getTextColor() }]}>
        {book.abbreviation}
      </ThemedText>
    </AnimatedPressable>
  );
}

type DrillScreenRouteProp = RouteProp<RootStackParamList, "Drill">;

export default function DrillScreen() {
  const insets = useSafeAreaInsets();
  const { theme, appColors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<DrillScreenRouteProp>();
  
  const { mode = "timed", difficulty = "novice" } = route.params || {};
  
  const [gameState, setGameState] = useState<"ready" | "playing" | "feedback" | "finished">("ready");
  const [question, setQuestion] = useState<DrillQuestion | null>(null);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [timeLeft, setTimeLeft] = useState(300);
  const [totalTime, setTotalTime] = useState(0);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flashOpacity = useSharedValue(0);

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  const getTimeLimit = useCallback(() => {
    switch (difficulty) {
      case "novice": return 300;
      case "intermediate": return 180;
      case "advanced": return 120;
      case "master": return 60;
      default: return 300;
    }
  }, [difficulty]);

  useEffect(() => {
    setTimeLeft(getTimeLimit());
  }, [getTimeLimit]);

  const startGame = useCallback(() => {
    setGameState("playing");
    setScore({ correct: 0, total: 0 });
    setTotalTime(0);
    setTimeLeft(getTimeLimit());
    setQuestion(generateQuestion());
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setGameState("finished");
          return 0;
        }
        return prev - 1;
      });
      setTotalTime(prev => prev + 1);
    }, 1000);
  }, [getTimeLimit]);

  const endGame = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const xpEarned = calculateXpReward(score.correct, Math.max(score.total, 1), totalTime);
    
    const progress = await getUserProgress();
    const newProgress: UserProgress = {
      ...progress,
      xp: progress.xp + xpEarned,
      level: calculateLevel(progress.xp + xpEarned),
      totalDrills: progress.totalDrills + 1,
      correctAnswers: progress.correctAnswers + score.correct,
      totalAnswers: progress.totalAnswers + score.total,
      lastPlayedDate: new Date().toDateString(),
      streak: progress.lastPlayedDate === new Date(Date.now() - 86400000).toDateString()
        ? progress.streak + 1
        : progress.lastPlayedDate === new Date().toDateString()
          ? progress.streak
          : 1,
    };
    
    if (progress.totalDrills === 0) {
      newProgress.achievements = [...(progress.achievements || []), "first_drill"];
    }
    if (newProgress.streak >= 3 && !progress.achievements?.includes("streak_3")) {
      newProgress.achievements = [...(newProgress.achievements || []), "streak_3"];
    }
    if (newProgress.streak >= 7 && !progress.achievements?.includes("streak_7")) {
      newProgress.achievements = [...(newProgress.achievements || []), "streak_7"];
    }
    
    await saveUserProgress(newProgress);
    
    await saveDrillResult({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mode,
      difficulty,
      correctAnswers: score.correct,
      totalAnswers: score.total,
      timeSeconds: totalTime,
      xpEarned,
    });
    
    setGameState("finished");
  }, [score, totalTime, mode, difficulty]);

  const handleBookSelect = useCallback((book: BibleBook) => {
    if (gameState !== "playing" || !question) return;
    
    setSelectedBook(book.name);
    const correct = book.name === question.targetBook.name;
    setIsCorrect(correct);
    
    if (correct) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      flashOpacity.value = withSequence(
        withTiming(0.3, { duration: 100 }),
        withTiming(0, { duration: 200 })
      );
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      flashOpacity.value = withSequence(
        withTiming(0.3, { duration: 100 }),
        withTiming(0, { duration: 200 })
      );
    }
    
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
    
    setGameState("feedback");
    
    setTimeout(() => {
      setSelectedBook(null);
      setIsCorrect(null);
      setQuestion(generateQuestion());
      setGameState("playing");
    }, 800);
  }, [gameState, question, flashOpacity]);

  const handleQuit = () => {
    Alert.alert(
      "Quit Drill?",
      "Your progress will be saved.",
      [
        { text: "Continue", style: "cancel" },
        {
          text: "Quit",
          style: "destructive",
          onPress: () => {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            if (score.total > 0) {
              endGame();
            }
            navigation.goBack();
          },
        },
      ]
    );
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  if (gameState === "ready") {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Feather name="x" size={24} color={theme.text} />
          </Pressable>
          <ThemedText type="h4">Sword Drill</ThemedText>
          <View style={{ width: 40 }} />
        </View>
        
        <View style={styles.readyContent}>
          <View style={[styles.readyIcon, { backgroundColor: appColors.gold + "20" }]}>
            <Feather name="target" size={48} color={appColors.gold} />
          </View>
          <ThemedText type="h2" style={styles.readyTitle}>Ready to Train?</ThemedText>
          <ThemedText type="body" style={[styles.readyDescription, { color: theme.textSecondary }]}>
            Find the correct book of the Bible as quickly as possible. You have {formatTime(getTimeLimit())} to answer as many questions as you can.
          </ThemedText>
          
          <View style={[styles.difficultyBadge, { backgroundColor: appColors.accent + "20" }]}>
            <ThemedText type="small" style={{ color: appColors.accent, fontWeight: "600" }}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Mode
            </ThemedText>
          </View>
          
          <Button onPress={startGame} style={styles.startButton}>
            Start Drill
          </Button>
        </View>
      </ThemedView>
    );
  }

  if (gameState === "finished") {
    const xpEarned = calculateXpReward(score.correct, Math.max(score.total, 1), totalTime);
    
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View style={{ width: 40 }} />
          <ThemedText type="h4">Results</ThemedText>
          <View style={{ width: 40 }} />
        </View>
        
        <View style={styles.resultsContent}>
          <View style={[styles.resultsIcon, { backgroundColor: appColors.gold + "20" }]}>
            <Feather name="award" size={48} color={appColors.gold} />
          </View>
          <ThemedText type="h2" style={styles.resultsTitle}>Great Job!</ThemedText>
          
          <View style={styles.resultsGrid}>
            <View style={[styles.resultCard, { backgroundColor: theme.backgroundDefault }]}>
              <ThemedText type="h2" style={{ color: appColors.success }}>{score.correct}</ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>Correct</ThemedText>
            </View>
            <View style={[styles.resultCard, { backgroundColor: theme.backgroundDefault }]}>
              <ThemedText type="h2" style={{ color: appColors.skyBlue }}>{accuracy}%</ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>Accuracy</ThemedText>
            </View>
            <View style={[styles.resultCard, { backgroundColor: theme.backgroundDefault }]}>
              <ThemedText type="h2" style={{ color: appColors.gold }}>+{xpEarned}</ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>XP Earned</ThemedText>
            </View>
          </View>
          
          <Button onPress={() => navigation.goBack()} style={styles.doneButton}>
            Done
          </Button>
          <Pressable onPress={startGame} style={styles.playAgainButton}>
            <Feather name="refresh-cw" size={18} color={appColors.skyBlue} />
            <ThemedText type="body" style={{ color: appColors.skyBlue, marginLeft: Spacing.sm }}>
              Play Again
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View
        style={[
          styles.flashOverlay,
          { backgroundColor: isCorrect ? appColors.success : appColors.accent },
          flashStyle,
        ]}
        pointerEvents="none"
      />
      
      <View style={styles.header}>
        <Pressable onPress={handleQuit} style={styles.headerButton}>
          <Feather name="x" size={24} color={theme.text} />
        </Pressable>
        <View style={[styles.timerContainer, { backgroundColor: timeLeft <= 30 ? appColors.accent + "20" : theme.backgroundDefault }]}>
          <Feather name="clock" size={16} color={timeLeft <= 30 ? appColors.accent : theme.text} />
          <ThemedText type="h4" style={[styles.timerText, timeLeft <= 30 && { color: appColors.accent }]}>
            {formatTime(timeLeft)}
          </ThemedText>
        </View>
        <Pressable onPress={endGame} style={styles.headerButton}>
          <Feather name="check" size={24} color={appColors.success} />
        </Pressable>
      </View>
      
      <View style={styles.scoreBar}>
        <View style={styles.scoreItem}>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>Correct</ThemedText>
          <ThemedText type="h4" style={{ color: appColors.success }}>{score.correct}</ThemedText>
        </View>
        <View style={styles.scoreItem}>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>Total</ThemedText>
          <ThemedText type="h4">{score.total}</ThemedText>
        </View>
        <View style={styles.scoreItem}>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>Accuracy</ThemedText>
          <ThemedText type="h4" style={{ color: appColors.skyBlue }}>{accuracy}%</ThemedText>
        </View>
      </View>
      
      {question ? (
        <View style={styles.questionContainer}>
          <ThemedText type="small" style={[styles.questionLabel, { color: theme.textSecondary }]}>
            Find this verse:
          </ThemedText>
          <ThemedText type="h2" style={styles.questionText}>
            {question.targetBook.name} {question.chapter}:{question.verse}
          </ThemedText>
        </View>
      ) : null}
      
      <FlatList
        data={question?.options || []}
        keyExtractor={(item) => item.name}
        numColumns={3}
        contentContainerStyle={styles.booksGrid}
        columnWrapperStyle={styles.booksRow}
        renderItem={({ item }) => (
          <BookButton
            book={item}
            onPress={() => handleBookSelect(item)}
            isCorrect={selectedBook === item.name ? isCorrect : null}
            isSelected={selectedBook === item.name}
            disabled={gameState === "feedback"}
          />
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  timerText: {
    marginLeft: Spacing.sm,
  },
  scoreBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  scoreItem: {
    alignItems: "center",
  },
  questionContainer: {
    alignItems: "center",
    paddingVertical: Spacing["2xl"],
    paddingHorizontal: Spacing.lg,
  },
  questionLabel: {
    marginBottom: Spacing.sm,
  },
  questionText: {
    textAlign: "center",
  },
  booksGrid: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing["3xl"],
  },
  booksRow: {
    justifyContent: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  bookButton: {
    flex: 1,
    maxWidth: "30%",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  bookButtonText: {
    fontWeight: "600",
    textAlign: "center",
  },
  readyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing["2xl"],
  },
  readyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  readyTitle: {
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  readyDescription: {
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing["3xl"],
  },
  startButton: {
    width: "100%",
    backgroundColor: AppColors.gold,
  },
  resultsContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing["2xl"],
  },
  resultsIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  resultsTitle: {
    marginBottom: Spacing.xl,
    textAlign: "center",
  },
  resultsGrid: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing["3xl"],
  },
  resultCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  doneButton: {
    width: "100%",
    backgroundColor: AppColors.gold,
    marginBottom: Spacing.lg,
  },
  playAgainButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
  },
});
