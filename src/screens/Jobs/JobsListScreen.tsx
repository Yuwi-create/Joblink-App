import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme/colors';
import { useAuthStore } from '@/store/authStore';
import { fetchJobs } from '@/api/jobs';
import { Job } from '@/types';
import JobCard from '@/components/JobCard';
import { getErrorMessage } from '@/api/client';

const CATEGORIES = ['All', 'Gardening', 'Cleaning', 'Painting', 'Driving'];

export default function JobsListScreen({ navigation }: any) {
  const user = useAuthStore((s) => s.user);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchJobs({
        category: category === 'All' ? undefined : category,
        search: search || undefined,
      });
      setJobs(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [category, search]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const urgentCount = jobs.filter((j) => j.isUrgent).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>{user?.name ?? 'there'} 👋</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn} onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs, categories..."
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={load}
          />
          <Ionicons name="options-outline" size={18} color={colors.textMuted} />
        </View>
      </View>

      <View style={styles.categoryRow}>
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(c) => c}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: 8 }}
          renderItem={({ item }) => {
            const active = item === category;
            return (
              <TouchableOpacity
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setCategory(item)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.statsRow}>
        <Stat label="JOBS NEAR" value={String(jobs.length)} />
        <Stat label="URGENT" value={String(urgentCount)} color={colors.urgent} />
        <Stat label="AVG PAY" value="3.5k" />
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>{jobs.length} jobs found</Text>
        {urgentCount > 0 && (
          <Text style={styles.urgentLabel}>⚡ {urgentCount} urgent</Text>
        )}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={load}><Text style={styles.retryText}>Tap to retry</Text></TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(j) => String(j.id)}
          contentContainerStyle={{ padding: spacing.lg, paddingTop: 0 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />
          }
          renderItem={({ item }) => (
            <JobCard job={item} onPress={() => navigation.navigate('JobDetail', { jobId: item.id })} />
          )}
          ListEmptyComponent={
            <View style={styles.centerBox}><Text style={styles.errorText}>No jobs found.</Text></View>
          }
        />
      )}
    </View>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, color ? { color } : null]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgLight },
  header: { backgroundColor: colors.primary, paddingTop: 55, paddingBottom: spacing.lg, paddingHorizontal: spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  greeting: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  name: { color: '#fff', fontSize: 20, fontWeight: '700' },
  bellBtn: {
    width: 38, height: 38, borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 12,
  },
  searchInput: { flex: 1, fontSize: 14 },
  categoryRow: { marginTop: spacing.md, marginBottom: spacing.sm },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.textDark, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  statsRow: { flexDirection: 'row', marginHorizontal: spacing.lg, gap: spacing.sm, marginBottom: spacing.md },
  statBox: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', paddingVertical: spacing.sm,
  },
  statValue: { fontSize: 18, fontWeight: '800', color: colors.textDark },
  statLabel: { fontSize: 9, color: colors.textMuted, fontWeight: '600', marginTop: 2 },
  listHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, marginBottom: spacing.sm,
  },
  listHeaderText: { fontWeight: '700', color: colors.textDark },
  urgentLabel: { color: colors.urgent, fontWeight: '600', fontSize: 12 },
  centerBox: { alignItems: 'center', marginTop: 40, gap: 8 },
  errorText: { color: colors.textMuted },
  retryText: { color: colors.primary, fontWeight: '700' },
});
