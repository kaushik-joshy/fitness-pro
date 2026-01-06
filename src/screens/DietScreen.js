import React, { useState, useEffect, useContext } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, 
  Modal, ActivityIndicator, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { dietService } from '../services/dietService';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

export default function DietScreen() {
  const { user } = useContext(AuthContext);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Macros
  const DAILY_GOALS = { calories: 2500, protein: 150, carbs: 300, fats: 80 };

  // Form State
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  const fetchMeals = async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const result = await dietService.getDailyLogs(user.uid, today);
    if (!result.error) {
      setMeals(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchMeals();
  }, [user]);

  const handleSaveMeal = async () => {
    if (!mealName || !calories) {
      Alert.alert('Error', 'Meal name and calories are required');
      return;
    }

    const mealData = {
      mealName,
      calories: parseInt(calories, 10),
      protein: protein ? parseInt(protein, 10) : 0,
      carbs: carbs ? parseInt(carbs, 10) : 0,
      fats: fats ? parseInt(fats, 10) : 0,
      date: new Date().toISOString().split('T')[0]
    };

    setModalVisible(false);
    setLoading(true);
    
    const result = await dietService.addMeal(user.uid, mealData);
    if (!result.error) {
      fetchMeals();
      // Reset form
      setMealName(''); setCalories(''); setProtein(''); setCarbs(''); setFats('');
    } else {
      Alert.alert('Error', 'Failed to save meal');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Delete Meal', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          await dietService.deleteMeal(id);
          fetchMeals();
        }
      }
    ]);
  };

  // Summarize today's intake
  const currentIntake = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fats: acc.fats + meal.fats,
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const renderMacroBar = (label, current, goal, color) => {
    const progress = Math.min((current / goal) * 100, 100);
    return (
      <View style={styles.macroRow}>
        <View style={styles.macroLabels}>
          <Text style={styles.macroLabelText}>{label}</Text>
          <Text style={styles.macroValueText}>{current} / {goal}g</Text>
        </View>
        <View style={styles.macroBarContainer}>
          <View style={[styles.macroBarFill, { width: `${progress}%`, backgroundColor: color }]} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Diet Monitor</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Today's Macros</Text>
          <View style={styles.caloriesCircle}>
            <Text style={styles.caloriesText}>{currentIntake.calories}</Text>
            <Text style={styles.caloriesSubText}>/ {DAILY_GOALS.calories} kcal</Text>
          </View>
          
          <View style={styles.macrosContainer}>
            {renderMacroBar('Protein', currentIntake.protein, DAILY_GOALS.protein, COLORS.primary)}
            {renderMacroBar('Carbs', currentIntake.carbs, DAILY_GOALS.carbs, COLORS.secondary)}
            {renderMacroBar('Fats', currentIntake.fats, DAILY_GOALS.fats, COLORS.success)}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Today's Meals</Text>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : meals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No meals logged today.</Text>
          </View>
        ) : (
          meals.map(item => (
            <View key={item.id} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealName}>{item.mealName}</Text>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                </TouchableOpacity>
              </View>
              <Text style={styles.mealCals}>{item.calories} kcal</Text>
              <Text style={styles.mealMacros}>P: {item.protein}g | C: {item.carbs}g | F: {item.fats}g</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Meal Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Log Meal</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.form}>
            <Text style={styles.label}>Meal Name *</Text>
            <TextInput style={styles.input} value={mealName} onChangeText={setMealName} placeholder="e.g. Chicken Salad" placeholderTextColor={COLORS.textSecondary} />
            
            <Text style={styles.label}>Calories (kcal) *</Text>
            <TextInput style={styles.input} value={calories} onChangeText={setCalories} keyboardType="numeric" placeholder="450" placeholderTextColor={COLORS.textSecondary} />

            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: SPACING.md }]}>
                <Text style={styles.label}>Protein (g)</Text>
                <TextInput style={styles.input} value={protein} onChangeText={setProtein} keyboardType="numeric" placeholder="40" placeholderTextColor={COLORS.textSecondary} />
              </View>
              <View style={[styles.inputContainer, { flex: 1, marginRight: SPACING.md }]}>
                <Text style={styles.label}>Carbs (g)</Text>
                <TextInput style={styles.input} value={carbs} onChangeText={setCarbs} keyboardType="numeric" placeholder="30" placeholderTextColor={COLORS.textSecondary} />
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Fats (g)</Text>
                <TextInput style={styles.input} value={fats} onChangeText={setFats} keyboardType="numeric" placeholder="15" placeholderTextColor={COLORS.textSecondary} />
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveMeal}>
              <Text style={styles.saveButtonText}>Save Meal</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: SPACING.md,
    marginBottom: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  summaryTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  caloriesCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  caloriesText: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
  },
  caloriesSubText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  macrosContainer: {
    width: '100%',
  },
  macroRow: {
    marginBottom: SPACING.md,
  },
  macroLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  macroLabelText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
  },
  macroValueText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  macroBarContainer: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  macroBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  mealCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: SPACING.sm,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  mealName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  mealCals: {
    ...TYPOGRAPHY.body1,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  mealMacros: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textSecondary,
  },
  // Modal Styles
  modalContainer: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalTitle: { ...TYPOGRAPHY.h2, color: COLORS.text },
  form: { padding: SPACING.lg },
  label: { ...TYPOGRAPHY.body2, color: COLORS.text, marginBottom: SPACING.xs, fontWeight: 'bold' },
  input: { backgroundColor: COLORS.surface, color: COLORS.text, padding: SPACING.md, borderRadius: SPACING.sm, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.lg },
  row: { flexDirection: 'row' },
  inputContainer: { marginBottom: SPACING.sm },
  saveButton: { backgroundColor: COLORS.primary, padding: SPACING.md, borderRadius: SPACING.sm, alignItems: 'center', marginTop: SPACING.lg },
  saveButtonText: { ...TYPOGRAPHY.h3, color: COLORS.text },
});
