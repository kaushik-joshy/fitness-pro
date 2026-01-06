import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'dietLogs';

export const dietService = {
  async addMeal(userId, mealData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        userId,
        ...mealData,
        createdAt: new Date().toISOString(),
      });
      return { id: docRef.id, ...mealData };
    } catch (error) {
      console.error('Error adding meal: ', error);
      return { error: error.message };
    }
  },

  async getDailyLogs(userId, date) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        where('userId', '==', userId),
        where('date', '==', date)
      );
      
      const querySnapshot = await getDocs(q);
      const meals = [];
      querySnapshot.forEach((doc) => {
        meals.push({ id: doc.id, ...doc.data() });
      });
      
      // Client-side sorting to avoid requiring composite indexes
      meals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return { data: meals };
    } catch (error) {
      console.error('Error fetching meals: ', error);
      return { error: error.message };
    }
  },

  async deleteMeal(mealId) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, mealId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting meal: ', error);
      return { error: error.message };
    }
  }
};
