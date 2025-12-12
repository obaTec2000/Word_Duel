# Draw Your Sword - Design Guidelines

## Brand Identity

### Vision
Create the ultimate digital training ground for Christians to master Bible navigation with speed, accuracy, and confidence through gamified sword drills.

### Target Audience
Church youth groups, Bible competition participants, Sunday School teachers, families, and individual believers seeking deeper Bible familiarity.

## Authentication & Account
- **Auth Required**: Email/password with social logins (Google, Apple)
- Guest mode available for trial
- Account screen includes: personalization settings, Bible version preference, skill level, training goals
- Profile displays: level, XP, current streak, achievements earned

## Color System

### Warrior Theme (Default)
- **Primary Dark**: #2C3E50 (Midnight Blue) - Spiritual depth
- **Accent Red**: #C0392B (Crimson) - Urgency and challenge
- **Success Green**: #27AE60 - Growth and achievement
- **Gold**: #F1C40F - Excellence and reward
- **Sky Blue**: #3498DB - Divine guidance
- **Neutral**: #ECF0F1 (Light Gray), #FFFFFF (White)

### Alternative Themes
- **Royal Theme**: Royal Purple #2C1B47, Sky Blue #3498DB, Metallic Gold #D4AF37, Light Lavender #F8F4FF
- **Ancient Scroll Theme**: Saddle Brown #8B4513, Chocolate #D2691E, Peru #CD853F, Linen #FAF0E6

## Typography
- **Primary Font**: Inter (sans-serif for UI)
- **Verse Display**: Serif font for traditional feel
- **Sizes**: H1: 32px, H2: 24px, H3: 20px, Body: 16px, Caption: 14px
- **Headings**: Bold, uppercase for emphasis

## Iconography
Use symbolic icons throughout:
- **Sword**: Actions, drill modes, competition
- **Trophy**: Achievements, leaderboard
- **Shield**: Stats, defense, protection
- **Scroll**: Bible books, verses
- **Flame**: Streaks, intensity
- Use Feather icons from @expo/vector-icons

## Navigation Architecture

### Root Navigation: Tab Bar (4 tabs)
1. **Home/Dashboard**: Daily verse, progress summary, quick actions
2. **Train**: Training modes and drills
3. **Compete**: Leaderboards, multiplayer, tournaments
4. **Profile**: Stats, achievements, settings

### Floating Action Button
- Central "Start Drill" button for quick access to timed sword drill
- Position: Bottom center, above tab bar
- Styling: Gold gradient with subtle shadow (shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2)

## Screen Specifications

### Welcome/Splash Screen
- Full-screen animated sword drawing effect
- App tagline centered
- Hebrews 4:12 verse display
- Gradient particle effects background
- No navigation header

### Onboarding Flow (Stack-Only)
1. **Bible Version Selection**: Scrollable list of versions with radio selection
2. **Skill Level**: Card-based selection (Novice, Intermediate, Advanced, Master)
3. **Account Creation**: Form with submit button below inputs

### Main Dashboard (Home Tab)
- **Header**: Transparent with greeting and streak indicator (right button)
- **Layout**: Scrollable content with safe area insets (top: headerHeight + 16, bottom: tabBarHeight + 72 for FAB clearance)
- **Components**:
  - Daily verse card (elevated, rounded corners)
  - Progress summary cards (3-column grid showing XP, Level, Accuracy)
  - Quick action buttons (horizontal scroll)
  - Recent achievements banner

### Training Modes Screen (Train Tab)
- **Header**: Standard with "Training Modes" title
- **Layout**: Scrollable list with category sections
- **Safe Area**: top: headerHeight + 16, bottom: tabBarHeight + 16
- **Mode Cards**: 
  - Large tappable cards with mode icon, title, description
  - Progress indicator showing category completion
  - Difficulty badge overlay
  - Hover/press state with scale animation

### Drill Active Screen (Modal)
- **Header**: Custom with timer (centered), pause button (right), quit button (left with confirmation)
- **Layout**: Fixed, non-scrollable
- **Components**:
  - Large countdown timer (top third)
  - Bible reference prompt (centered, large serif font)
  - Book selection grid (scrollable if needed)
  - Speed/accuracy metrics (bottom)
- **Visual Feedback**: Haptic feedback on selections, color flash on correct/incorrect

### Leaderboard Screen (Compete Tab)
- **Header**: Standard with segmented control (Global, Church, Friends)
- **Layout**: List view with pull-to-refresh
- **Safe Area**: top: headerHeight + 16, bottom: tabBarHeight + 16
- **Components**:
  - Top 3 podium display (custom layout)
  - Ranked list items with position, avatar, name, score
  - Current user position highlighted

### Profile Screen (Profile Tab)
- **Header**: Transparent with settings icon (right button)
- **Layout**: Scrollable
- **Safe Area**: top: headerHeight + 16, bottom: tabBarHeight + 16
- **Components**:
  - Avatar (large, centered) with edit capability
  - Display name and level badge
  - Stats grid (4 columns: XP, Accuracy, Speed, Streak)
  - Achievement wall (horizontal scrollable gallery)
  - Progress charts (Victory Native graphs)

### Settings Screen (Stack)
- **Header**: Standard with back button
- **Layout**: Scrollable form/list
- **Sections**: Account, Bible Version, Notifications, Theme, Data & Privacy
- **Delete Account**: Nested under Account → Advanced → Delete (double confirmation required)

## Visual Design Principles

### Cards & Containers
- Rounded corners: 12px for primary cards, 8px for secondary
- Elevation via subtle shadows (not blurred): shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2
- Background: White (#FFFFFF) on light mode, #1C1C1E on dark mode
- Padding: 16px standard, 12px compact

### Buttons
- **Primary (Gold)**: Full-width, 48px height, rounded 8px, bold text
- **Secondary (Outlined)**: Border 2px, transparent background
- **Icon Buttons**: 40px touch target, 24px icon size
- **Press State**: Opacity 0.7 or scale 0.95 animation

### Input Fields
- Height: 48px
- Border: 1px solid #E0E0E0, focus: 2px solid primary color
- Rounded: 8px
- Padding: 12px horizontal

### Progress Indicators
- Circular progress: Animated stroke with gold color
- Linear progress bars: 8px height, rounded ends
- XP bars: Gradient fill (gold to light gold)

### Animations
- Use React Native Reanimated for smooth 60fps animations
- Drill countdown: Scale + opacity transitions
- Level up: Confetti particle effect
- Achievement unlock: Modal slide-up with bounce

## Accessibility
- Minimum touch target: 44x44 points
- Color contrast ratio: 4.5:1 for text, 3:1 for UI elements
- Support for dynamic type sizing
- VoiceOver/TalkBack labels for all interactive elements
- Alternative text for all icons and images

## Critical Assets

### Generated Assets Needed
1. **Animated Sword Icon**: SVG animated drawing for splash screen
2. **Achievement Badges**: 20+ unique badge designs (speed, accuracy, category mastery, social)
3. **Level Progress Icons**: Warrior rank symbols (Levels 1-60)
4. **Bible Book Category Icons**: 9 custom icons for Pentateuch, History, Wisdom, Major Prophets, Minor Prophets, Gospels, Acts, Pauline Epistles, General Epistles, Revelation
5. **Power-up Icons**: For Speed Mastery Survival mode
6. **Competition Mode Icons**: Speed Round, Accuracy Round, Marathon, Team Battle

### Standard Icons
Use Feather icons for: navigation, settings, notifications, share, statistics, search, filter, sort

## Notification Design
- In-app banner: Slide from top, 4-second auto-dismiss
- Badge counters: Red circle with white text
- Customizable quiet hours and frequency in settings