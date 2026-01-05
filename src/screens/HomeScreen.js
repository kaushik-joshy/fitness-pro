import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.name}>{user?.displayName || 'Athlete'}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={24} color={COLORS.text} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.streakCard}>
        <View style={styles.streakHeader}>
          <Ionicons name="flame" size={32} color={COLORS.secondary} />
          <View style={styles.streakTextContainer}>
            <Text style={styles.streakCount}>5 Day Streak!</Text>
            <Text style={styles.streakSub}>Keep it up, you're doing great!</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Today's Summary</Text>
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Ionicons name="barbell" size={24} color={COLORS.primary} />
          <Text style={styles.summaryValue}>0</Text>
          <Text style={styles.summaryLabel}>Workouts</Text>
        </View>
        <View style={styles.summaryCard}>
          <Ionicons name="restaurant" size={24} color={COLORS.success} />
          <Text style={styles.summaryValue}>0 kcal</Text>
          <Text style={styles.summaryLabel}>Logged</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('Workouts')}
      >
        <Ionicons name="add-circle" size={24} color={COLORS.text} />
        <Text style={styles.actionText}>Log Workout</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionButton, styles.actionButtonSecondary]}
        onPress={() => navigation.navigate('Diet')}
      >
        <Ionicons name="water" size={24} color={COLORS.text} />
        <Text style={styles.actionText}>Log Meal</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
  },
  greeting: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textSecondary,
  },
  name: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  streakCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
    ...SHADOWS.medium,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakTextContainer: {
    marginLeft: SPACING.md,
  },
  streakCount: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  streakSub: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  summaryValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  summaryLabel: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.md,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  actionButtonSecondary: {
    backgroundColor: COLORS.border,
  },
  actionText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
});
