import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { AuthContext } from '../context/AuthContext';
import { workoutService } from '../services/workoutService';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

const screenWidth = Dimensions.get('window').width - (SPACING.lg * 2);

export default function ProgressScreen() {
  const { user } = useContext(AuthContext);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      const result = await workoutService.getUserWorkouts(user.uid);
      if (!result.error) {
        setWorkouts(result.data);
      }
      setLoading(false);
    };
    if (user) fetchWorkouts();
  }, [user]);

  // Aggregate stats
  const totalWorkouts = workouts.length;
  const totalWeightStr = workouts.reduce((sum, w) => sum + (w.weight * w.reps * w.sets), 0).toLocaleString();

  // Process data for charts
  // Last 7 days frequency
  const frequencyLabels = [];
  const frequencyData = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = workouts.filter(w => w.date === dateStr).length;
    frequencyLabels.push(d.getDate().toString());
    frequencyData.push(count);
  }

  // Weight Trend over time (for the first exercise found, generic)
  const weightTrendLabels = [];
  const weightTrendData = [];
  workouts
    .filter(w => w.weight > 0)
    .reverse() // oldest to newest
    .slice(-5) // last 5 entries to not crowd the x-axis
    .forEach((w) => {
      weightTrendLabels.push(w.date.substring(5, 10)); // MM-DD
      weightTrendData.push(w.weight);
    });

  const chartConfig = {
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
    labelColor: (opacity = 1) => COLORS.textSecondary,
    strokeWidth: 2,
    barPercentage: 0.6,
    useShadowColorFromDataset: false
  };

  const lineChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`, // Secondary color
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Your Progress</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
      ) : (
        <View>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Workouts</Text>
              <Text style={styles.statValue}>{totalWorkouts}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Volume Lifted</Text>
              <Text style={styles.statValue}>{totalWeightStr} kg</Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Workout Frequency (7 Days)</Text>
            <BarChart
              style={{ marginTop: 20, borderRadius: 16 }}
              data={{
                labels: frequencyLabels,
                datasets: [{ data: frequencyData }]
              }}
              width={screenWidth - SPACING.md * 2}
              height={220}
              yAxisLabel=""
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              fromZero
            />
          </View>

          {weightTrendData.length > 0 && (
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Recent Weight Trends (kg)</Text>
              <LineChart
                style={{ marginTop: 20, borderRadius: 16 }}
                data={{
                  labels: weightTrendLabels,
                  datasets: [{ data: weightTrendData }]
                }}
                width={screenWidth - SPACING.md * 2}
                height={220}
                yAxisSuffix="kg"
                chartConfig={lineChartConfig}
                bezier
              />
            </View>
          )}

        </View>
      )}
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
    paddingBottom: SPACING.xxl,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: SPACING.md,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statLabel: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  statValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
  chartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    ...SHADOWS.medium,
    alignItems: 'center',
  },
  chartTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    alignSelf: 'flex-start',
    marginBottom: -10, // Adjust VictoryChart padding
    zIndex: 1,
  }
});
