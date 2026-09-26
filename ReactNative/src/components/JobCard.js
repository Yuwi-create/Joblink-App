import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../theme/colors';

const categoryIcons = {
  gardening: '🌿', cleaning: '🧹', painting: '🎨', driving: '🚗',
  moving: '📦', tutoring: '📚', eventHelp: '🎉',
};

export default function JobCard({ job, onApply }) {
  const handleApply = () => {
    if (onApply) {
      onApply(job);
    } else {
      Alert.alert('Applied', `You applied for "${job.title}" (mock only)`);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>{categoryIcons[job.category] || '💼'}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>{job.title}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{job.category}</Text>
            </View>
            {job.urgent && (
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentBadgeText}>⚡ Urgent</Text>
              </View>
            )}
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>📍 {job.location}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>🕐 {job.postedAgo}</Text>
          </View>
        </View>

        <View style={styles.rightCol}>
          <Text style={styles.rate}>{job.rate}</Text>
          <Text style={styles.rateUnit}>{job.rateUnit}</Text>
          <View style={styles.ratingRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{job.posterInitials}</Text>
            </View>
            <Text style={styles.ratingText}>⭐ {job.rating}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.applyButton} onPress={handleApply} activeOpacity={0.8}>
        <Text style={styles.applyButtonText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white, borderRadius: 16, padding: 14,
    marginHorizontal: 16, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  row: { flexDirection: 'row' },
  iconCircle: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  iconText: { fontSize: 20 },
  content: { flex: 1 },
  title: { fontSize: 14, fontWeight: '700', color: colors.textDark },
  badgeRow: { flexDirection: 'row', marginTop: 6, gap: 6 },
  categoryBadge: { backgroundColor: colors.background, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  categoryBadgeText: { fontSize: 11, color: colors.primary, fontWeight: '600', textTransform: 'capitalize' },
  urgentBadge: { backgroundColor: colors.urgentBg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  urgentBadgeText: { fontSize: 11, color: colors.urgentText, fontWeight: '600' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  metaText: { fontSize: 11, color: colors.textGray },
  metaDot: { marginHorizontal: 6, color: colors.textGray },
  rightCol: { alignItems: 'flex-end', justifyContent: 'space-between' },
  rate: { fontSize: 14, fontWeight: '700', color: colors.primary },
  rateUnit: { fontSize: 10, color: colors.textGray },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  avatarCircle: {
    width: 18, height: 18, borderRadius: 9, backgroundColor: colors.primaryDark,
    alignItems: 'center', justifyContent: 'center', marginRight: 4,
  },
  avatarText: { fontSize: 8, color: colors.white, fontWeight: '700' },
  ratingText: { fontSize: 11, color: colors.textDark },
  applyButton: { marginTop: 12, backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 9, alignItems: 'center' },
  applyButtonText: { color: colors.white, fontWeight: '700', fontSize: 13 },
});
