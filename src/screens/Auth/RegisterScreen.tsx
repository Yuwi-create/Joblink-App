import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme/colors';
import { useAuthStore } from '@/store/authStore';
import { getErrorMessage } from '@/api/client';
import { UserRole } from '@/types';

const ROLES: { key: UserRole; title: string; desc: string; tags: string[]; icon: keyof typeof Ionicons.glyphMap }[] = [
  {
    key: 'worker',
    title: 'I want to find work',
    desc: 'Browse part-time jobs near you. Apply with one tap and track your applications & income.',
    tags: ['Gardening', 'Cleaning', 'Tutoring', '+7 more'],
    icon: 'hammer-outline',
  },
  {
    key: 'employer',
    title: 'I want to hire someone',
    desc: 'Post a job in minutes. Find verified workers nearby. Fast, safe, and free to post.',
    tags: ['Post Free', 'Verified Workers', 'Chat & Hire'],
    icon: 'business-outline',
  },
];

export default function RegisterScreen({ navigation }: any) {
  const [step, setStep] = useState<'role' | 'details'>('role');
  const [role, setRole] = useState<UserRole>('worker');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);

  const handleRegister = async () => {
    if (!name.trim() || !phone.trim() || password.length < 8) {
      Alert.alert('Check your details', 'Name, phone and a password (min 8 characters) are required.');
      return;
    }
    setLoading(true);
    try {
      await register(name.trim(), phone.trim(), password, role);
    } catch (err) {
      Alert.alert('Registration failed', getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (step === 'role') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>How will you use{'\n'}JobLink LK?</Text>
        <Text style={styles.subtitle}>Choose your role to get started</Text>

        {ROLES.map((r) => {
          const selected = role === r.key;
          return (
            <TouchableOpacity
              key={r.key}
              style={[styles.roleCard, selected && styles.roleCardSelected]}
              onPress={() => setRole(r.key)}
            >
              <View style={styles.roleIconWrap}>
                <Ionicons name={r.icon} size={22} color={selected ? '#fff' : colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.roleTitle}>{r.title}</Text>
                  {selected && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
                </View>
                <Text style={styles.roleDesc}>{r.desc}</Text>
                <View style={styles.tagRow}>
                  {r.tags.map((t) => (
                    <View key={t} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.continueBtn} onPress={() => setStep('details')}>
          <Text style={styles.continueBtnText}>Continue</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <TouchableOpacity onPress={() => setStep('role')} style={{ marginBottom: spacing.md }}>
        <Ionicons name="chevron-back-circle" size={30} color={colors.primary} />
      </TouchableOpacity>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>Signing up as {role === 'worker' ? 'a worker' : 'an employer'}</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} placeholder="Eg: Kumara Bandara" value={name} onChangeText={setName} />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput style={styles.input} placeholder="07X XXX XXXX" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

      <Text style={styles.label}>Password</Text>
      <TextInput style={styles.input} placeholder="Min. 8 characters" secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity style={[styles.continueBtn, { marginTop: spacing.lg }]} onPress={handleRegister} disabled={loading}>
        <Text style={styles.continueBtnText}>{loading ? 'Creating account...' : 'Create Account'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: spacing.lg }}>
        <Text style={{ textAlign: 'center', color: colors.textMuted }}>
          Already have an account? <Text style={{ color: colors.primary, fontWeight: '700' }}>Log in</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgLight, padding: spacing.lg, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '800', color: colors.textDark },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 4, marginBottom: spacing.lg },
  roleCard: {
    flexDirection: 'row', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.md,
    borderWidth: 2, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.md,
  },
  roleCardSelected: { borderColor: colors.primary, backgroundColor: '#EAFBF6' },
  roleIconWrap: {
    width: 44, height: 44, borderRadius: radius.sm,
    backgroundColor: colors.bgLight, alignItems: 'center', justifyContent: 'center',
  },
  roleTitle: { fontSize: 15, fontWeight: '700', color: colors.textDark },
  roleDesc: { fontSize: 12, color: colors.textMuted, marginTop: 4, marginBottom: 8 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: colors.bgLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill },
  tagText: { fontSize: 10, color: colors.primaryDark, fontWeight: '600' },
  continueBtn: {
    flexDirection: 'row', gap: 8, backgroundColor: colors.primary,
    paddingVertical: 14, borderRadius: radius.sm,
    alignItems: 'center', justifyContent: 'center', marginTop: spacing.sm,
  },
  continueBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textDark, marginBottom: 6, marginTop: spacing.md },
  input: {
    backgroundColor: colors.surface, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.md, paddingVertical: 12, fontSize: 14,
  },
});
