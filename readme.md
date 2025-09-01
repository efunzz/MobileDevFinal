# Flipzi - Personal Flashcard Study App

## Introduction

Flipzi is a simple, focused flashcard application built with React Native and Expo. Created as a personal learning tool for computer science students, it implements core spaced repetition functionality with a clean, minimal interface designed for effective study sessions.

The app was developed to demonstrate mobile development skills while solving a real personal problem - improving long-term retention of programming concepts through active recall techniques.

## Installation & Setup

```bash
# Install dependencies
npm install

# Start the development server
npx expo start

# Run on device/simulator
npx expo start --ios
npx expo start --android
```

## Features Overview

Flipzi includes user authentication, deck management, study sessions with spaced repetition, progress tracking, and a clean mobile interface optimized for focused learning.

---

## Module Topics Implementation

This section demonstrates how Flipzi incorporates skills from all 10 module topics:

### Topic 1: Mobile App Ecosystem
**Implementation:** Cross-platform development using Expo/React Native
- Built for both iOS and Android platforms
- Leveraged Expo's ecosystem for rapid development and testing
- Designed with mobile-first principles and touch interactions

**Code Example:** `App.js` - Platform-agnostic navigation setup

### Topic 2: Mobile User Interface Design  
**Implementation:** Wireframing and psychology-based design decisions
- Created wireframes for all major screens (initial sketches → detailed designs)
- Applied mobile design patterns (card-based layouts, bottom navigation)
- Used color psychology (calming blues/greens for study focus)

**Code Example:** `screens/HomeScreen.js` - Clean card-based deck layout

### Topic 3: Programming User Interfaces
**Implementation:** JSX elements and React Native UI components
- Used core React Native components: `View`, `Text`, `StyleSheet`, `SafeAreaView`
- Implemented responsive layouts with Flexbox
- Created reusable UI components with consistent styling

**Code Example:** `components/DeckCard.js` - Custom deck display component

### Topic 4: Advanced User Interface Elements
**Implementation:** Advanced interactions and animations
- **TouchableOpacity/Pressable:** Interactive buttons and deck cards
- **React Native Reanimated:** Smooth animations for floating action button
- **Gestures:** Swipe gestures for card navigation
- **FlatList:** Efficient scrolling for deck and card lists

**Code Example:** `components/AnimatedFAB.js` - Reanimated floating action button

### Topic 5: Developing a Mobile App Project
**Implementation:** Advanced JavaScript and testing
- **Functional Components:** Modern React hooks (useState, useEffect)
- **State Management:** Proper state flow between components
- **Error Handling:** Try-catch blocks and user-friendly error messages
- **Testing:** Basic component testing setup

**Code Example:** `screens/StudyScreen.js` - Component state management

### Topic 6: Data Sources
**Implementation:** Local data handling and manipulation
- **AsyncStorage:** Persistent local storage for user progress
- **JSON Data:** Structured flashcard and progress data
- **Data Ethics:** Local-first approach, no personal data collection
- **CRUD Operations:** Create, read, update, delete for decks and cards

**Code Example:** `lib/storage.js` - AsyncStorage wrapper functions

### Topic 7: Integrating Cloud Services
**Implementation:** Supabase integration for user accounts
- **User Authentication:** Sign up, sign in, sign out functionality
- **Cloud Database:** User accounts and deck synchronization
- **Network Error Handling:** Graceful handling of connection issues
- **Offline Support:** App functions without internet for local study

**Code Example:** `lib/supabase.js` - Authentication and database setup

### Topic 8: Sensor Programming
**Implementation:** Device haptic feedback and device orientation
- **Haptics:** Subtle vibration feedback for card interactions
- **Screen Orientation:** Locked to portrait for consistent study experience
- **Device Features:** Optimized for mobile study sessions

**Code Example:** `utils/haptics.js` - Haptic feedback implementation

### Topic 9: Introduction to APIs
**Implementation:** Multiple API integrations
- **Supabase API:** User management and database operations
- **OpenAI API:** AI-powered deck and card generation
- **HTTP Requests:** Proper API calls with error handling and loading states
- **API Authentication:** Secure API key management

**Code Example:** `services/openai.js` - AI deck generation service

### Topic 10: Deployment
**Implementation:** Expo deployment pipeline
- **Expo Build:** Configured for app store deployment
- **Code Signing:** Prepared for iOS/Android distribution
- **App Store Ready:** Professional app structure and assets

**Code Example:** `app.json` - Expo configuration for deployment

---

## Key Features

###  User Authentication
- Secure sign up and login with Supabase Auth
- Password reset functionality
- Persistent user sessions

###  Deck Management  
- Create custom flashcard decks
- Organize cards by subject/topic
- Edit and delete decks as needed

###  AI Deck Generation
- Automated flashcard creation using OpenAI API
- Generate cards from topics or subjects
- Smart question and answer generation for study material

###  Smart Study Sessions
- Confidence-based card scheduling (Easy/Medium/Hard ratings)
- Progress tracking per deck and overall
- Adaptive review timing based on performance

###  Study Analytics
- Personal study statistics and progress visualization
- Cards mastered tracking
- Study session history

###  Clean Mobile Interface
- Minimalist design focused on study effectiveness  
- Responsive layouts for different screen sizes
- Touch-optimized interactions

---

## Technical Stack

- **Framework:** React Native with Expo
- **Navigation:** React Navigation 6
- **Storage:** AsyncStorage (local) + Supabase (cloud)
- **Authentication:** Supabase Auth
- **Styling:** StyleSheet with Flexbox layouts
- **Testing:** Jest for unit testing

---

## Project Structure

```
flipzi/
├── components/          # Reusable UI components
├── screens/            # Main app screens  
├── lib/               # Utilities and services
├── utils/             # Helper functions
├── __tests__/         # Unit tests
└── assets/            # Images and icons
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage
```

---

## Future Enhancements

- Social features for sharing decks
- Advanced statistics and analytics
- Offline-first architecture improvements
- Voice recording for audio flashcards

---

## GitHub Repository
Source code available at: https://github.com/efunzz/MobileDevFinal

**Course:** CM3050 Mobile Development  
**Student:** Irfan Sofyan Bin Zufri  
**Academic Year:** 2025