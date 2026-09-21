import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, radius, spacing } from '@/theme/colors';
import { fetchMyApplications } from '@/api/jobs';
import { Application } from '@/types';
import { getErrorMessage } from '@/api/client';

type TabKey = 'pending' | 'accepted' | 'rejected';

const STATUS_STYLES: Record<TabKey, { bg: string; text: string }> = {
  pending: { bg: '#FDF3DC', text: '#B98314' },
  accepted: { bg: '#E2F6EC', text: colors.success },
  rejected: { bg: '#FDEAEA', text: colors.urgent },
};

export default function MyApplicationsScreen() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [tab, setTab] = useState<TabKey>('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyApplications()
      .then(setApplications)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    pending: applications.filter((a) => a.status === 'pending').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };
  const filtered = applications.filter((a) => a.status === tab);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgLight }}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>My Applications</Text>
          <Text style={styles.headerCount}>{applications.length} total</Text>
        </View>
        <View style={styles.tabRow}>
          {(['pending', 'accepted', 'rejected'] as TabKey[]).map((t) => (
            <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t[0].toUpperCase() + t.slice(1)} ({counts[t]})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : error ? (
        <Text style={{ textAlign: 'center', marginTop: 40, color: colors.textMuted }}>{error}</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(a) => String(a.id)}
          contentContainerStyle={{ padding: spacing.lg }}
          ListEmptyComponent={<Text style={styles.emptyText}>No {tab} applications.</Text>}
          renderItem={({ item }) => {
            const s = STATUS_STYLES[item.status as TabKey];
            return (
              <View style={styles.card}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.jobTitle}>{item.job.title}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
                      <Text style={[styles.statusText, { color: s.text }]}>{item.status[0].toUpperCase() + item.status.slice(1)}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                    <Text style={styles.pay}>Rs. {item.job.pay.toLocaleString()}</Text>
                    <Text style={styles.appliedAt}>{item.appliedAt}</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.primary, paddingTop: 55, paddingBottom: spacing.md, paddingHorizontal: spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  headerCount: { color: 'rgba(255,255,255,0.85)', fontSize: 12 },
  tabRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.pill, padding: 3 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: radius.pill, alignItems: 'center' },
  tabActive: { backgroundColor: '#fff' },
  tabText: { fontSize: 11, color: '#fff', fontWeight: '600' },
  tabTextActive: { color: colors.primaryDark },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1,
    borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md, flexDirection: 'row',
  },
  jobTitle: { fontSize: 14, fontWeight: '700', color: colors.textDark, flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill },
  statusText: { fontSize: 11, fontWeight: '700' },
  pay: { fontWeight: '700', color: colors.primaryDark, fontSize: 13 },
  appliedAt: { fontSize: 11, color: colors.textMuted },
  emptyText: { textAlign: 'center', color: colors.textMuted, marginTop: 40 },
});
