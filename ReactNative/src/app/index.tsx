import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import colors from '../theme/colors';
import { mockJobs, categories, stats } from '../data/mockJobs';
import StatsBar from '../components/StatsBar';
import CategoryChips from '../components/CategoryChips';
import JobCard from '../components/JobCard';

export default function WorkerHomeScreen() {
  const userName = 'Kumara Bandara';
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [urgentOnly, setUrgentOnly] = useState(false);

  const filteredJobs = useMemo(() => {
    return mockJobs.filter((job) => {
      const matchesCategory =
        selectedCategory === 'all' || job.category === selectedCategory;
      const matchesSearch = job.title
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesUrgent = !urgentOnly || job.urgent === true;
      return matchesCategory && matchesSearch && matchesUrgent;
    });
  }, [searchText, selectedCategory, urgentOnly]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <JobCard job={item} />}
        ListHeaderComponent={
          <>
            <View style={styles.banner}>
              <Text style={styles.greeting}>Good morning,</Text>
              <Text style={styles.userName}>{userName} 👋</Text>
              <View style={styles.searchRow}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search jobs, categories..."
                  placeholderTextColor={colors.textGray}
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </View>
            </View>

            <StatsBar
              items={[
                { value: stats.appliedJobs, label: 'APPLIED JOBS' },
                { value: stats.activeJobs, label: 'ACTIVE JOBS', valueColor: colors.accent },
                { value: stats.earnings, label: 'EARNINGS' },
              ]}
            />

            <CategoryChips
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />

            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[styles.filterPill, urgentOnly && styles.filterPillActive]}
                onPress={() => setUrgentOnly(!urgentOnly)}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    urgentOnly && styles.filterPillTextActive,
                  ]}
                >
                  ⚡ Urgent
                </Text>
              </TouchableOpacity>
              <Text style={styles.resultsCount}>
                {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No jobs match your search.</Text>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  banner: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 },
  greeting: { color: '#CCFBF1', fontSize: 13 },
  userName: { color: colors.white, fontSize: 20, fontWeight: '700', marginTop: 2, marginBottom: 14 },
  searchRow: { backgroundColor: colors.white, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  searchInput: { fontSize: 14, color: colors.textDark },
  filterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 4, marginBottom: 8 },
  filterPill: { borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  filterPillActive: { backgroundColor: colors.urgentBg, borderColor: colors.urgentText },
  filterPillText: { fontSize: 12, fontWeight: '600', color: colors.textDark },
  filterPillTextActive: { color: colors.urgentText },
  resultsCount: { fontSize: 12, color: colors.textGray },
  emptyText: { textAlign: 'center', color: colors.textGray, marginTop: 40 },
});