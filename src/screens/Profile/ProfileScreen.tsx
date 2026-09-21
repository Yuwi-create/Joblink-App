import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme/colors';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bgLight }} contentContainerStyle={{ padding: spacing.lg, paddingTop: 55 }}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={22} color={colors.textDark} />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{user?.name?.[0] ?? '?'}</Text></View>
          <View>
            <Text style={styles.name}>{user?.name ?? 'Guest'}</Text>
            <Text style={styles.rating}>⭐ {user?.rating ?? '—'} ({user?.reviewsCount ?? 0} reviews)</Text>
            <Text style={styles.location}>📍 {user?.location ?? 'Not set'}</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <Stat label="Jobs Done" value="14" />
          <Stat label="Earned" value="Rs.42k" />
          <Stat label="Success" value="98%" />
        </View>
      </View>

      {user?.skills && (
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <TouchableOpacity><Text style={styles.editLink}>Edit</Text></TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.sm }}>
            {user.skills.map((s) => (
              <View key={s} style={styles.skillChip}><Text style={styles.skillChipText}>{s}</Text></View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.menu}>
        <MenuItem icon="settings-outline" label="Settings" onPress={() => navigation.navigate('Settings')} />
        <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => {}} />
        <TouchableOpacity style={[styles.menuRow, styles.logoutRow]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={colors.urgent} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MenuItem({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress}>
      <Ionicons name={icon} size={18} color={colors.textDark} />
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} style={{ marginLeft: 'auto' }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  headerTitle: { fontSize: 22, fontWeight: '800', color: colors.textDark },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1,
    borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 20 },
  name: { fontSize: 17, fontWeight: '700', color: colors.textDark },
  rating: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  location: { fontSize: 12, color: colors.textMuted },
  statsRow: { flexDirection: 'row', marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  statValue: { fontSize: 16, fontWeight: '800', color: colors.textDark },
  statLabel: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontWeight: '700', color: colors.textDark },
  editLink: { color: colors.primary, fontWeight: '600', fontSize: 12 },
  skillChip: { backgroundColor: colors.bgLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  skillChipText: { fontSize: 12, color: colors.primaryDark, fontWeight: '600' },
  menu: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  menuLabel: { fontSize: 14, color: colors.textDark, fontWeight: '600' },
  logoutRow: { borderBottomWidth: 0 },
  logoutText: { color: colors.urgent, fontWeight: '700', fontSize: 14 },
});
