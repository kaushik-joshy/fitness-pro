import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout }
    ]);
  };

  const badges = user?.badges || [];
  
  const getBadgeIcon = (id) => {
    switch (id) {
      case '7_DAY_STREAK': return 'flame';
      case '30_DAY_STREAK': return 'trophy';
      case '10_WORKOUTS': return 'medal';
      case '50_WORKOUTS': return 'star';
      default: return 'ribbon';
    }
  };

  const getBadgeName = (id) => {
    switch (id) {
      case '7_DAY_STREAK': return '7 Day Streak';
      case '30_DAY_STREAK': return '30 Day Streak';
      case '10_WORKOUTS': return '10 Workouts';
      case '50_WORKOUTS': return '50 Workouts';
      default: return 'Achiever';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{user?.displayName?.charAt(0) || 'U'}</Text>
        </View>
        <Text style={styles.name}>{user?.displayName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{user?.currentStreak || 0}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{user?.totalWorkouts || 0}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>My Badges</Text>
      {badges.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="lock-closed-outline" size={40} color={COLORS.border} />
          <Text style={styles.emptyText}>Keep working out to earn badges!</Text>
        </View>
      ) : (
        <View style={styles.badgesGrid}>
          {badges.map(badgeId => (
            <View key={badgeId} style={styles.badgeItem}>
              <View style={styles.badgeIconContainer}>
                <Ionicons name={getBadgeIcon(badgeId)} size={32} color={COLORS.secondary} />
              </View>
              <Text style={styles.badgeName}>{getBadgeName(badgeId)}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>Account Settings</Text>
      <View style={styles.settingsGroup}>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
          <Text style={styles.settingText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="color-palette-outline" size={24} color={COLORS.text} />
          <Text style={styles.settingText}>Appearance</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
          <Text style={[styles.settingText, { color: COLORS.error }]}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.versionText}>FitTrack Pro v1.0.0</Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { alignItems: 'center', padding: SPACING.xl, paddingTop: SPACING.xxl },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md, ...SHADOWS.medium },
  avatarText: { ...TYPOGRAPHY.h1, color: COLORS.text },
  name: { ...TYPOGRAPHY.h2, color: COLORS.text, marginBottom: 4 },
  email: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary },
  statsContainer: { flexDirection: 'row', backgroundColor: COLORS.surface, marginHorizontal: SPACING.lg, borderRadius: SPACING.lg, padding: SPACING.lg, ...SHADOWS.small, marginBottom: SPACING.xl },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { ...TYPOGRAPHY.h1, color: COLORS.primary },
  statLabel: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary },
  statDivider: { width: 1, backgroundColor: COLORS.border },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  emptyContainer: { alignItems: 'center', padding: SPACING.xl, backgroundColor: COLORS.surface, marginHorizontal: SPACING.lg, borderRadius: SPACING.lg, marginBottom: SPACING.xl },
  emptyText: { ...TYPOGRAPHY.body1, color: COLORS.textSecondary, marginTop: SPACING.sm },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.lg, marginBottom: SPACING.xl },
  badgeItem: { width: '30%', alignItems: 'center', margin: '1.5%', backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: SPACING.md, ...SHADOWS.small },
  badgeIconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xs },
  badgeName: { ...TYPOGRAPHY.caption, color: COLORS.text, textAlign: 'center', fontWeight: 'bold' },
  settingsGroup: { backgroundColor: COLORS.surface, marginHorizontal: SPACING.lg, borderRadius: SPACING.lg, overflow: 'hidden', marginBottom: SPACING.xl },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  settingText: { flex: 1, ...TYPOGRAPHY.body1, color: COLORS.text, marginLeft: SPACING.md },
  versionText: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.xl },
});
