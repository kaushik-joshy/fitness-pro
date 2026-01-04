import React, { useState, useContext } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useContext(AuthContext);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    const result = await register(email, password, name);
    setIsLoading(false);
    
    if (result.error) {
      Alert.alert('Signup Failed', result.error);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[COLORS.background, COLORS.surface]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Join FitTrack</Text>
            <Text style={styles.subtitle}>Start your fitness journey today</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={COLORS.textSecondary}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor={COLORS.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor={COLORS.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.text} />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  formContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: SPACING.lg,
    ...SHADOWS.medium,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: COLORS.background,
    color: COLORS.text,
    padding: SPACING.md,
    borderRadius: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: SPACING.sm,
    alignItems: 'center',
    marginTop: SPACING.lg,
    ...SHADOWS.small,
  },
  buttonText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  footerText: {
    color: COLORS.textSecondary,
    ...TYPOGRAPHY.body2,
  },
  footerLink: {
    color: COLORS.secondary,
    ...TYPOGRAPHY.body2,
    fontWeight: 'bold',
  },
});
