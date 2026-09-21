import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme/colors';
import { fetchJobDetail, applyToJob } from '@/api/jobs';
import { Job } from '@/types';
import { getErrorMessage } from '@/api/client';

export default function JobDetailScreen({ route, navigation }: any) {
  const { jobId } = route.params;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    fetchJobDetail(jobId)
      .then(setJob)
      .catch((err) => Alert.alert('Error', getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await applyToJob(jobId);
      setApplied(true);
      Alert.alert('Applied!', 'Your application has been sent to the employer.');
    } catch (err) {
      Alert.alert('Could not apply', getErrorMessage(err));
    } finally {
      setApplying(false);
    }
  };

  if (loading || !job) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgLight }}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleBtn}>
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleBtn}>
              <Ionicons name="heart-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.titleRow}>
            <View style={styles.iconBox}><Ionicons name="leaf" size={22} color={colors.primary} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{job.title}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.categoryBadge}><Text style={styles.categoryBadgeText}>{job.category}</Text></View>
                {job.isUrgent && (
                  <View style={styles.urgentBadge}>
                    <Ionicons name="flash" size={11} color="#fff" />
                    <Text style={styles.urgentBadgeText}>Urgent</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.infoGrid}>
            <InfoBox icon="cash-outline" label="PAY" value={`Rs. ${job.pay.toLocaleString()}`} sub={job.payType === 'per_day' ? 'per day' : 'fixed'} />
            <InfoBox icon="calendar-outline" label="DATE" value={job.date} />
            <InfoBox icon="location-outline" label="LOCATION" value={job.location} sub={job.distanceKm ? `${job.distanceKm} km away` : undefined} />
            <InfoBox icon="time-outline" label="TIME" value={`${job.startTime}${job.endTime ? ` – ${job.endTime}` : ''}`} />
          </View>

          <Section title="Job Description">
            <Text style={styles.paragraph}>{job.description}</Text>
          </Section>

          {job.requirements && job.requirements.length > 0 && (
            <Section title="Requirements">
              {job.requirements.map((r) => (
                <View key={r} style={styles.reqRow}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={styles.reqText}>{r}</Text>
                </View>
              ))}
            </Section>
          )}

          <Section title="About the Employer">
            <View style={styles.employerRow}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{job.employer.name.split(' ').map(n => n[0]).join('').slice(0,2)}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.employerName}>{job.employer.name}</Text>
                <Text style={styles.employerRating}>⭐ {job.employer.rating} · {job.employer.reviewsCount} reviews</Text>
              </View>
              <TouchableOpacity
                style={styles.chatBtn}
                onPress={() => navigation.navigate('Chat', { userId: job.employer.id, userName: job.employer.name })}
              >
                <Ionicons name="chatbubble-outline" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </Section>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.applyBtn, applied && styles.applyBtnDone]}
          onPress={handleApply}
          disabled={applying || applied}
        >
          <Text style={styles.applyBtnText}>
            {applied ? 'Applied ✓' : applying ? 'Applying...' : `Apply Now · Rs. ${job.pay.toLocaleString()}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function InfoBox({ icon, label, value, sub }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; sub?: string }) {
  return (
    <View style={styles.infoBox}>
      <Ionicons name={icon} size={16} color={colors.primary} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
      {sub && <Text style={styles.infoSub}>{sub}</Text>}
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bgLight },
  header: { backgroundColor: colors.primary, paddingTop: 55, paddingBottom: spacing.xl, paddingHorizontal: spacing.lg },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg },
  circleBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  titleRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  iconBox: { width: 48, height: 48, borderRadius: radius.sm, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontSize: 19, fontWeight: '800', marginBottom: 6 },
  badgeRow: { flexDirection: 'row', gap: 6 },
  categoryBadge: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill },
  categoryBadgeText: { fontSize: 11, color: '#fff', fontWeight: '600' },
  urgentBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: colors.urgent, paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill },
  urgentBadgeText: { fontSize: 11, color: '#fff', fontWeight: '700' },
  body: { padding: spacing.lg, marginTop: -spacing.lg },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  infoBox: {
    width: '47%', backgroundColor: colors.surface, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, padding: spacing.md,
  },
  infoLabel: { fontSize: 10, color: colors.textMuted, fontWeight: '700', marginTop: 6 },
  infoValue: { fontSize: 14, fontWeight: '700', color: colors.textDark, marginTop: 2 },
  infoSub: { fontSize: 10, color: colors.textMuted },
  section: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.textDark, marginBottom: 8 },
  paragraph: { fontSize: 13, color: colors.textMuted, lineHeight: 20 },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  reqText: { fontSize: 13, color: colors.textDark },
  employerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700' },
  employerName: { fontWeight: '700', color: colors.textDark, fontSize: 13 },
  employerRating: { fontSize: 11, color: colors.textMuted },
  chatBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bgLight, alignItems: 'center', justifyContent: 'center' },
  footer: { padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  applyBtn: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: radius.sm, alignItems: 'center' },
  applyBtnDone: { backgroundColor: colors.success },
  applyBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
