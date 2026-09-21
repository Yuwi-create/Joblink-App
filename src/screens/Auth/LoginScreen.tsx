import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme/colors';
import { useAuthStore } from '@/store/authStore';
import { getErrorMessage } from '@/api/client';

export default function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);

  const handleLogin = async () => {
    if (!phone.trim() || !password) {
      Alert.alert('Missing details', 'Please enter your phone number and password.');
      return;
    }
    setLoading(true);
    try {
      await login(phone.trim(), password);
    } catch (err) {
      Alert.alert('Login failed', getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Ionicons name="briefcase" size={26} color="#fff" />
        </View>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your JobLink LK account</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.inputRow}>
          <Ionicons name="call-outline" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="07X XXX XXXX"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: spacing.lg }}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
          <Text style={styles.loginBtnText}>{loading ? 'Signing in...' : 'Login'}</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: spacing.lg }}>
          <Text style={styles.footerText}>
            No account? <Text style={styles.link}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgLight },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  logoCircle: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  form: { padding: spacing.lg, marginTop: -spacing.lg },
  label: { fontSize: 13, fontWeight: '600', color: colors.textDark, marginBottom: 6, marginTop: spacing.md },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.surface, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.md, paddingVertical: 12,
  },
  input: { flex: 1, fontSize: 14, color: colors.textDark },
  link: { color: colors.primary, fontWeight: '600' },
  loginBtn: {
    flexDirection: 'row', gap: 8, backgroundColor: colors.primary,
    paddingVertical: 14, borderRadius: radius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  loginBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  footerText: { textAlign: 'center', color: colors.textMuted, fontSize: 13 },
});
