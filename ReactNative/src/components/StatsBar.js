import { StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';

function StatBox({ value, label, valueColor }) {
  return (
    <View style={styles.box}>
      <Text style={[styles.value, valueColor ? { color: valueColor } : null]}>
        {value}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export default function StatsBar({ items }) {
  return (
    <View style={styles.row}>
      {items.map((item, index) => (
        <StatBox key={index} value={item.value} label={item.label} valueColor={item.valueColor} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginTop: -28,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  box: { flex: 1, alignItems: 'center' },
  value: { fontSize: 20, fontWeight: '700', color: colors.primary },
  label: { fontSize: 11, color: colors.textGray, marginTop: 2, textAlign: 'center' },
});
