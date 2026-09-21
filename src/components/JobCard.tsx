import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme/colors';
import { Job } from '@/types';

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Gardening: 'leaf',
  Cleaning: 'brush',
  Painting: 'color-palette',
  Driving: 'car',
};

interface Props {
  job: Job;
  onPress: () => void;
}

export default function JobCard({ job, onPress }: Props) {
  const icon = CATEGORY_ICONS[job.category] ?? 'briefcase';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>{job.title}</Text>

        <View style={styles.badgeRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{job.category}</Text>
          </View>
          {job.isUrgent && (
            <View style={styles.urgentBadge}>
              <Ionicons name="flash" size={11} color="#fff" />
              <Text style={styles.urgentBadgeText}>Urgent</Text>
            </View>
          )}
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={13} color={colors.textMuted} />
          <Text style={styles.metaText}>{job.location}</Text>
          <Ionicons name="time-outline" size={13} color={colors.textMuted} style={{ marginLeft: spacing.sm }} />
          <Text style={styles.metaText}>{job.postedAt}</Text>
        </View>
      </View>

      <View style={styles.payWrap}>
        <Text style={styles.payText}>Rs. {job.pay.toLocaleString()}</Text>
        <Text style={styles.payTypeText}>
          {job.payType === 'per_day' ? 'per day' : job.payType === 'per_trip' ? 'per trip' : 'fixed'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.bgLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 15, fontWeight: '700', color: colors.textDark, marginBottom: 4 },
  badgeRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  categoryBadge: {
    backgroundColor: colors.bgLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  categoryBadgeText: { fontSize: 11, color: colors.primaryDark, fontWeight: '600' },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.urgent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  urgentBadgeText: { fontSize: 11, color: '#fff', fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 11, color: colors.textMuted, marginLeft: 3 },
  payWrap: { alignItems: 'flex-end', justifyContent: 'center' },
  payText: { fontSize: 14, fontWeight: '700', color: colors.primaryDark },
  payTypeText: { fontSize: 10, color: colors.textMuted },
});
