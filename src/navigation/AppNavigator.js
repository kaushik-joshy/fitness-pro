import React, { useContext } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../constants/theme';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

// Main Screens
import HomeScreen from '../screens/HomeScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SocialScreen from '../screens/SocialScreen';
import DietScreen from '../screens/DietScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'Workouts') iconName = focused ? 'barbell' : 'barbell-outline';
        else if (route.name === 'Progress') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
        else if (route.name === 'Diet') iconName = focused ? 'restaurant' : 'restaurant-outline';
        else if (route.name === 'Social') iconName = focused ? 'people' : 'people-outline';
        else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textSecondary,
      tabBarStyle: {
        backgroundColor: COLORS.surface,
        borderTopColor: COLORS.border,
        paddingBottom: 5,
        paddingTop: 5,
        height: 60,
      },
      headerStyle: {
        backgroundColor: COLORS.background,
        shadowColor: 'transparent',
        elevation: 0,
      },
      headerTintColor: COLORS.text,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      sceneStyle: {
        backgroundColor: COLORS.background,
      }
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Workouts" component={WorkoutScreen} />
    <Tab.Screen name="Progress" component={ProgressScreen} />
    <Tab.Screen name="Diet" component={DietScreen} />
    <Tab.Screen name="Social" component={SocialScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={{
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        primary: COLORS.primary,
        background: COLORS.background,
        card: COLORS.surface,
        text: COLORS.text,
        border: COLORS.border,
        notification: COLORS.secondary,
      },
    }}>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: COLORS.background
  }
});
