import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, Switch, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/theme/colors';
import { createJob } from '@/api/jobs';
import { getErrorMessage } from '@/api/client';

const CATEGORIES = ['Gardening', 'Cleaning', 'Painting', 'Driving', 'Tutoring', 'Event Help', 'Plumbing', 'Electrical', 'Pet Care', 'Moving'];

export default function PostJobScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [pay, setPay] = useState('2500');
  const [payType, setPayType] = useState<'fixed' | 'per_day' | 'per_trip'>('fixed');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Basic client-side validation. Server must re-validate everything -
    // never trust these checks alone.
    if (!title.trim() || !category || !description.trim() || !location.trim() || !date || !startTime) {
      Alert.alert('Missing details', 'Please fill in all fields before posting.');
      return;
    }
    const payNumber = Number(pay);
    if (!payNumber || payNumber <= 0) {
      Alert.alert('Invalid pay', 'Please enter a valid pay amount.');
      return;
    }

    setSubmitting(true);
    try {
      await createJob({
        title: title.trim(),
        category,
        description: description.trim(),
        pay: payNumber,
        payType,
        location: location.trim(),
        date,
        startTime,
        isUrgent,
      });
      Alert.alert('Posted!', 'Your job is now live.', [
        { text: 'OK', onPress: () => navigation.navigate('MyJobs') },
      ]);
    } catch (err) {
      Alert.alert('Could not post job', getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bgLight }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleBtn}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post a New Job</Text>
        <Text style={styles.headerSubtitle}>Fill in the details to find the right worker</Text>
      </View>

      <ScrollView style={{ padding: spacing.lg, marginTop: -spacing.lg }} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Field label="Job Title">
          <TextInput style={styles.input} placeholder="Eg: Lawn mowing at my house" value={title} onChangeText={setTitle} maxLength={80} />
        </Field>

        <Field label="Category">
          <TouchableOpacity style={styles.selectInput} onPress={() => setShowCategoryPicker((v) => !v)}>
            <Text style={category ? styles.selectValue : styles.selectPlaceholder}>{category || 'Select a category'}</Text>
            <Ionicons name={showCategoryPicker ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textMuted} />
          </TouchableOpacity>
          {showCategoryPicker && (
            <View style={styles.categoryList}>
              {CATEGORIES.map((c) => (
                <TouchableOpacity key={c} style={styles.categoryItem} onPress={() => { setCategory(c); setShowCategoryPicker(false); }}>
                  <Text style={styles.categoryItemText}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Field>

        <Field label="Description">
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the job in detail — what needs to be done, tools needed, etc."
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            maxLength={1000}
          />
        </Field>

        <View style={styles.row}>
          <Field label="Pay (Rs.)" style={{ flex: 1 }}>
            <TextInput style={styles.input} keyboardType="number-pad" value={pay} onChangeText={setPay} />
          </Field>
          <Field label="Pay Type" style={{ flex: 1 }}>
            <View style={styles.payTypeRow}>
              {(['fixed', 'per_day', 'per_trip'] as const).map((pt) => (
                <TouchableOpacity key={pt} style={[styles.payTypeChip, payType === pt && styles.payTypeChipActive]} onPress={() => setPayType(pt)}>
                  <Text style={[styles.payTypeChipText, payType === pt && styles.payTypeChipTextActive]}>
                    {pt === 'fixed' ? 'Fixed' : pt === 'per_day' ? '/day' : '/trip'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Field>
        </View>

        <Field label="Location">
          <TextInput style={styles.input} placeholder="Eg: Colombo 05" value={location} onChangeText={setLocation} />
        </Field>

        <View style={styles.row}>
          <Field label="Date" style={{ flex: 1 }}>
            <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={date} onChangeText={setDate} />
          </Field>
          <Field label="Start Time" style={{ flex: 1 }}>
            <TextInput style={styles.input} placeholder="HH:MM AM" value={startTime} onChangeText={setStartTime} />
          </Field>
        </View>

        <View style={styles.urgentBox}>
          <View style={{ flex: 1 }}>
            <Text style={styles.urgentTitle}>Mark as Urgent</Text>
            <Text style={styles.urgentSubtitle}>Gets highlighted & more visibility</Text>
          </View>
          <Switch value={isUrgent} onValueChange={setIsUrgent} trackColor={{ true: colors.primary }} />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
          <Text style={styles.submitBtnText}>{submitting ? 'Posting...' : 'Post Job Now'}</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Field({ label, children, style }: { label: string; children: React.ReactNode; style?: any }) {
  return (
    <View style={[{ marginBottom: spacing.md }, style]}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.primary, paddingTop: 55, paddingBottom: spacing.xl, paddingHorizontal: spacing.lg },
  circleBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  headerSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textDark, marginBottom: 6 },
  input: {
    backgroundColor: colors.surface, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md,
    paddingVertical: 12, fontSize: 14, color: colors.textDark,
  },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  selectInput: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: 12,
  },
  selectValue: { fontSize: 14, color: colors.textDark },
  selectPlaceholder: { fontSize: 14, color: '#9AA8A5' },
  categoryList: {
    backgroundColor: colors.surface, borderRadius: radius.sm, borderWidth: 1,
    borderColor: colors.border, marginTop: 4, overflow: 'hidden',
  },
  categoryItem: { paddingHorizontal: spacing.md, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  categoryItemText: { fontSize: 13, color: colors.textDark },
  row: { flexDirection: 'row', gap: spacing.md },
  payTypeRow: { flexDirection: 'row', gap: 6 },
  payTypeChip: { flex: 1, paddingVertical: 10, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  payTypeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  payTypeChipText: { fontSize: 11, color: colors.textDark, fontWeight: '600' },
  payTypeChipTextActive: { color: '#fff' },
  urgentBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FDEDED',
    borderRadius: radius.sm, padding: spacing.md, marginBottom: spacing.lg,
  },
  urgentTitle: { fontWeight: '700', color: colors.textDark, fontSize: 13 },
  urgentSubtitle: { fontSize: 11, color: colors.textMuted },
  submitBtn: {
    flexDirection: 'row', gap: 8, backgroundColor: colors.primary,
    paddingVertical: 14, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center',
  },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
