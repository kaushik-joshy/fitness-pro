import React, { useState, useEffect, useContext } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  Modal, TextInput, ActivityIndicator, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { workoutService } from '../services/workoutService';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

export default function WorkoutScreen() {
  const { user } = useContext(AuthContext);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Form State
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');

  const fetchWorkouts = async () => {
    setLoading(true);
    const result = await workoutService.getUserWorkouts(user.uid);
    if (!result.error) {
      setWorkouts(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchWorkouts();
  }, [user]);

  const handleSaveWorkout = async () => {
    if (!exerciseName || !sets || !reps) {
      Alert.alert('Error', 'Please fill the required fields (Exercise, Sets, Reps)');
      return;
    }

    const workoutData = {
      exerciseName,
      sets: parseInt(sets, 10),
      reps: parseInt(reps, 10),
      weight: weight ? parseFloat(weight) : 0,
      duration: duration ? parseInt(duration, 10) : 0,
      date: new Date().toISOString().split('T')[0] // current local date
    };

    setModalVisible(false);
    setLoading(true);
    
    const result = await workoutService.createWorkout(user.uid, workoutData);
    if (!result.error) {
      fetchWorkouts();
      // Reset form
      setExerciseName('');
      setSets('');
      setReps('');
      setWeight('');
      setDuration('');
    } else {
      Alert.alert('Error', 'Failed to save workout');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Delete Workout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          await workoutService.deleteWorkout(id);
          fetchWorkouts();
        }
      }
    ]);
  };

  const renderWorkoutItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.exerciseName}>{item.exerciseName}</Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardStats}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Sets</Text>
          <Text style={styles.statValue}>{item.sets}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Reps</Text>
          <Text style={styles.statValue}>{item.reps}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Weight (kg)</Text>
          <Text style={styles.statValue}>{item.weight}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Workouts</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
      ) : workouts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="barbell-outline" size={64} color={COLORS.border} />
          <Text style={styles.emptyText}>No workouts logged yet.</Text>
        </View>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={item => item.id}
          renderItem={renderWorkoutItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Log Workout</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.form}>
            <Text style={styles.label}>Exercise Name *</Text>
            <TextInput style={styles.input} value={exerciseName} onChangeText={setExerciseName} placeholder="e.g. Bench Press" placeholderTextColor={COLORS.textSecondary} />
            
            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: SPACING.md }]}>
                <Text style={styles.label}>Sets *</Text>
                <TextInput style={styles.input} value={sets} onChangeText={setSets} keyboardType="numeric" placeholder="3" placeholderTextColor={COLORS.textSecondary} />
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Reps *</Text>
                <TextInput style={styles.input} value={reps} onChangeText={setReps} keyboardType="numeric" placeholder="10" placeholderTextColor={COLORS.textSecondary} />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: SPACING.md }]}>
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" placeholder="60" placeholderTextColor={COLORS.textSecondary} />
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Duration (min)</Text>
                <TextInput style={styles.input} value={duration} onChangeText={setDuration} keyboardType="numeric" placeholder="45" placeholderTextColor={COLORS.textSecondary} />
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveWorkout}>
              <Text style={styles.saveButtonText}>Save Workout</Text>
            </TouchableOpacity>
          </View>
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
  listContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  exerciseName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.sm,
    borderRadius: SPACING.sm,
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  statValue: {
    ...TYPOGRAPHY.body1,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  form: {
    padding: SPACING.lg,
  },
  label: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    padding: SPACING.md,
    borderRadius: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
  },
  inputContainer: {
    marginBottom: SPACING.sm,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: SPACING.sm,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  saveButtonText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
});
