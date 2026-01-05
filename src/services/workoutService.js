import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'workouts';

export const workoutService = {
  // Create a new workout
  async createWorkout(userId, workoutData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        userId,
        ...workoutData,
        createdAt: new Date().toISOString(),
      });
      return { id: docRef.id, ...workoutData };
    } catch (error) {
      console.error('Error adding workout: ', error);
      return { error: error.message };
    }
  },

  // Get user's workouts, optionally filtered by date
  async getUserWorkouts(userId, date = null) {
    try {
      const constraints = [
        where('userId', '==', userId)
      ];
      
      if (date) {
        constraints.push(where('date', '==', date));
      }

      const q = query(collection(db, COLLECTION_NAME), ...constraints);
      const querySnapshot = await getDocs(q);
      
      const workouts = [];
      querySnapshot.forEach((doc) => {
        workouts.push({ id: doc.id, ...doc.data() });
      });

      // Client-side sorting to avoid requiring composite indexes
      workouts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return { data: workouts };
    } catch (error) {
      console.error('Error fetching workouts: ', error);
      return { error: error.message };
    }
  },

  // Update a workout
  async updateWorkout(workoutId, updateData) {
    try {
      const workoutRef = doc(db, COLLECTION_NAME, workoutId);
      await updateDoc(workoutRef, updateData);
      return { success: true };
    } catch (error) {
      console.error('Error updating workout: ', error);
      return { error: error.message };
    }
  },

  // Delete a workout
  async deleteWorkout(workoutId) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, workoutId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting workout: ', error);
      return { error: error.message };
    }
  }
};
