import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../theme/colors';

export default function CategoryChips({ categories, selectedCategory, onSelect }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {categories.map((cat) => {
        const isActive = cat.id === selectedCategory;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.7}
          >
            {cat.icon ? <Text style={styles.icon}>{cat.icon} </Text> : null}
            <Text style={[styles.label, isActive && styles.labelActive]}>{cat.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.chipBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipActive: { backgroundColor: colors.chipActiveBg, borderColor: colors.chipActiveBg },
  icon: { fontSize: 13 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textDark },
  labelActive: { color: colors.chipActiveText },
});
