import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme/colors';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'si', label: 'සිංහල' },
  { code: 'ta', label: 'தமிழ்' },
];

export default function SettingsScreen({ navigation }: any) {
  const [lang, setLang] = useState('en');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bgLight }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleBtn}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Language / භාෂාව / மொழி</Text>
          <View style={styles.langRow}>
            {LANGUAGES.map((l) => (
              <TouchableOpacity key={l.code} style={[styles.langChip, lang === l.code && styles.langChipActive]} onPress={() => setLang(l.code)}>
                <Text style={[styles.langChipText, lang === l.code && styles.langChipTextActive]}>{l.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notifications & Privacy</Text>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Push Notifications</Text>
              <Text style={styles.toggleSub}>Job alerts, messages, application updates</Text>
            </View>
            <Switch value={pushEnabled} onValueChange={setPushEnabled} trackColor={{ true: colors.primary }} />
          </View>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Location Access</Text>
              <Text style={styles.toggleSub}>Find nearby jobs based on your location</Text>
            </View>
            <Switch value={locationEnabled} onValueChange={setLocationEnabled} trackColor={{ true: colors.primary }} />
          </View>
        </View>

        <View style={styles.menu}>
          <MenuItem icon="person-outline" label="Edit Profile" />
          <MenuItem icon="shield-checkmark-outline" label="Privacy & Security" />
          <MenuItem icon="card-outline" label="Payment Methods" />
          <MenuItem icon="help-circle-outline" label="Help & Support" />
          <MenuItem icon="alert-circle-outline" label="Report an Issue" last />
        </View>
      </View>
    </ScrollView>
  );
}

function MenuItem({ icon, label, last }: { icon: keyof typeof Ionicons.glyphMap; label: string; last?: boolean }) {
  return (
    <TouchableOpacity style={[styles.menuRow, last && { borderBottomWidth: 0 }]}>
      <Ionicons name={icon} size={18} color={colors.textDark} />
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} style={{ marginLeft: 'auto' }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary, paddingTop: 55, paddingBottom: spacing.lg, paddingHorizontal: spacing.lg,
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
  },
  circleBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 19, fontWeight: '800' },
  body: { padding: spacing.lg },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md },
  sectionTitle: { fontWeight: '700', color: colors.textDark, marginBottom: spacing.sm },
  langRow: { flexDirection: 'row', gap: 8 },
  langChip: { flex: 1, paddingVertical: 10, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  langChipActive: { borderColor: colors.primary, backgroundColor: '#EAFBF6' },
  langChipText: { fontSize: 12, color: colors.textDark, fontWeight: '600' },
  langChipTextActive: { color: colors.primaryDark },
  toggleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  toggleLabel: { fontWeight: '600', color: colors.textDark, fontSize: 13 },
  toggleSub: { fontSize: 11, color: colors.textMuted },
  menu: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  menuLabel: { fontSize: 14, color: colors.textDark, fontWeight: '600' },
});
