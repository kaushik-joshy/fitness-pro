# 💪 FitTrack Pro

A fully-featured, production-ready cross-platform fitness application built with **React Native** and **Expo**. FitTrack Pro empowers users to log their workouts, track their daily macronutrients, visualize their lifting progress over time, and engage with an Instagram-style community feed.

Built heavily around gamification, the app automatically tracks daily activity streaks and dynamically awards Firebase-backed badges to drive user retention.

---

## ✨ Key Features

- **🔐 Secure Authentication:** Full email/password login and registration flow, backed by Firebase Authentication with persistent session storage.
- **🏋️ Workout Tracking:** Create, edit, and delete daily physical exercises (tracking Sets, Reps, and Weight) with automatic chronological sorting to bypass complex cloud indices.
- **🥗 Macro & Diet Logging:** Monitor your daily protein, carbs, fats, and total caloric intake visually.
- **📈 Data Visualization:** Interactive Bar and Line charts natively rendered across iOS, Android, and Web browsers via `react-native-chart-kit` and SVGs.
- **🔥 Gamification Engine:** Custom streak-calculation algorithms that analyze workout frequencies and award trophies and milestone badges (e.g., *7-Day Streak*, *50 Workouts*).
- **🌐 Community Social Feed:** An Instagram-style realtime feed where users can post their workouts and engage with others via likes.

---

## 🛠 Tech Stack

- **Frontend & Navigation:** React Native, Expo (SDK 54), React Navigation (`native-stack`, `bottom-tabs`).
- **Backend & Database:** Google Firebase (Auth & Cloud Firestore).
- **UI & Visualization:** Custom Glassmorphism-inspired Dark Theme (`expo-linear-gradient`), `react-native-chart-kit`.
- **State Management:** React Context API (Auth Context).

---

## ⚙️ Prerequisites & Setup

To run this project locally, you will need **Node.js** installed on your machine and a free **Firebase Project**.

### 1. Configure Firebase
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Authentication** (Email/Password provider).
3. Enable **Firestore Database** (Start in Test Mode).
4. Register a new Web App in your Firebase settings and copy your `firebaseConfig` object.
5. Open `src/services/firebase.js` and paste your config keys.

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/FitTrack-Pro.git
cd FitTrack-Pro
npm install --legacy-peer-deps
```

*Note: The `--legacy-peer-deps` flag ensures that the exact versions of the React Native Chart Kit modules resolve correctly on Expo SDK 54.*

### 3. Running the App

Start the Expo development server:

```bash
npx expo start --clear
```

- Press **`a`** to open on an Android Emulator.
- Press **`i`** to open on an iOS Simulator.
- Press **`w`** to open in a Web Browser.
- Or, scan the QR code with the **Expo Go** app on your physical iOS/Android device.

---

## 📁 Architecture Overview

```text
/src
 ├── /constants          # Theme design tokens (Colors, Typography, Setup)
 ├── /context            # Global Context Providers (Auth Session Management)
 ├── /navigation         # Stack & Bottom-Tab Routing configuration
 ├── /services           # All Firestore CRUD logic & Cloud connections
 ├── /screens            # The 7 core screens of the application
 └── App.js              # The root provider wrapper
```

---

## 📝 Technical Highlights

- **Bypassing Firestore Composite Index Bottlenecks:** To guarantee sub-second UI rendering, multi-filtered database searches (`where` combined with `orderBy`) were abstracted into a custom `Array.sort((a,b) => new Date(...) - new Date(...))` Javascript loop on the client side, eliminating the mandatory 5-minute background build times typical of NoSQL composite queries.
- **Strict URL Polyfills:** Engineered seamless React 19 / Expo 54 compatibility by injecting dynamic `react-native-url-polyfill/auto` overrides into the absolute root entry point, bypassing secure read-only URL rejections inherent to recent versions of the Firebase JS SDK on native mobile platforms.

---

> Designed & Developed by **Kaushik**.
