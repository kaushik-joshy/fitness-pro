import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export const streakService = {
  // Checks and updates streak when a user logs a workout
  async updateStreakOnWorkout(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) return;

      const userData = userSnap.data();
      const today = new Date();
      // Normalize to midnight local time
      today.setHours(0, 0, 0, 0);

      const lastWorkoutDateStr = userData.lastWorkoutDate;
      const currentStreak = userData.currentStreak || 0;
      const longestStreak = userData.longestStreak || 0;
      let totalWorkouts = userData.totalWorkouts || 0;
      let badges = userData.badges || [];

      let newStreak = currentStreak;
      totalWorkouts += 1;

      if (lastWorkoutDateStr) {
        const lastWorkoutDate = new Date(lastWorkoutDateStr);
        lastWorkoutDate.setHours(0, 0, 0, 0);

        const diffTime = Math.abs(today - lastWorkoutDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Consecutive day
          newStreak += 1;
        } else if (diffDays > 1) {
          // Streak broken
          newStreak = 1;
        }
        // If diffDays === 0, workout on same day, streak unchanged
      } else {
        // First workout
        newStreak = 1;
      }

      // Check for new badges
      if (newStreak >= 7 && !badges.includes('7_DAY_STREAK')) badges.push('7_DAY_STREAK');
      if (newStreak >= 30 && !badges.includes('30_DAY_STREAK')) badges.push('30_DAY_STREAK');
      if (totalWorkouts >= 10 && !badges.includes('10_WORKOUTS')) badges.push('10_WORKOUTS');
      if (totalWorkouts >= 50 && !badges.includes('50_WORKOUTS')) badges.push('50_WORKOUTS');

      await updateDoc(userRef, {
        currentStreak: newStreak,
        longestStreak: Math.max(longestStreak, newStreak),
        lastWorkoutDate: new Date().toISOString(),
        totalWorkouts,
        badges
      });

      return { success: true, newStreak, badges };
    } catch (error) {
      console.error('Error updating streak: ', error);
      return { error: error.message };
    }
  }
};
