import React, { useState, useContext } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    
    if (result.error) {
      Alert.alert('Login Failed', result.error);
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
        <View style={styles.formContainer}>
          <Text style={styles.title}>FitTrack Pro</Text>
          <Text style={styles.subtitle}>Welcome back to your fitness journey</Text>
          
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
              autoComplete="email"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.text} />
            ) : (
              <Text style={styles.buttonText}>Log In</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: SPACING.lg,
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
    marginTop: SPACING.md,
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
