import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { RecordCard } from '@/components/record-card';
import { Screen } from '@/components/screen';
import { colors } from '@/constants/palette';
import { useRecords } from '@/context/RecordsContext';
import { countOpen, formatMoney, sumOutstanding } from '@/lib/records';

export default function HomeScreen() {
  const { records, loadError } = useRecords();
  const [note, setNote] = useState('');
  const theyOwe = sumOutstanding(records, 'lent');
  const iOwe = sumOutstanding(records, 'borrowed');
  const recent = records.slice(0, 4);
  const totalLent = records
    .filter(r => r.type === 'lent')
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const totalBorrowed = records
    .filter(r => r.type === 'borrowed')
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const pendingCount = records.filter(r => !r.returned).length;
  const returnedCount = records.filter(r => r.returned).length;

  const totalRecords = records.length;
  const returnedPercent = totalRecords
    ? Math.round((returnedCount / totalRecords) * 100)
    : 0;

  function openQuickAdd(type) {
    router.push({
      pathname: '/add',
      params: {
        type,
        note: note.trim(),
      },
    });
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.kicker}>Your ledger</Text>
        <Text style={styles.title}>Lend.Borrow.Remember</Text>
        <Text style={styles.subtitle}>
          Never lose track of who has what.
        </Text>
      </View>

      {loadError ? <Text style={styles.error}>{loadError}</Text> : null}

      <View style={styles.summaryRow}>
        <SummaryCard
          label="They Owe Me"
          amount={formatMoney(theyOwe)}
          detail={`${countOpen(records, 'lent')} open`}
          accent={colors.teal}
          onPress={() => router.push('/they-owe')}
        />
        <SummaryCard
          label="I Owe Them"
          amount={formatMoney(iOwe)}
          detail={`${countOpen(records, 'borrowed')} open`}
          accent={colors.purple}
          onPress={() => router.push('/i-owe')}
        />
      </View>

      <View style={styles.quickAdd}>
        <Text style={styles.quickKicker}>QUICK ADD</Text>
        <Text style={styles.quickTitle}>What changed hands?</Text>
        <Text style={styles.quickBody}>
          Add a quick note about something you lent or borrowed.
        </Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Headphones, or ₹20 for lunch"
          placeholderTextColor={colors.faint}
          style={styles.input}
          returnKeyType="done"
        />
        <View style={styles.quickActions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => openQuickAdd('lent')}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            <Text style={styles.primaryLabel}>I lent this</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => openQuickAdd('borrowed')}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <Text style={styles.secondaryLabel}>I borrowed this</Text>
          </Pressable>
        </View>
        <Pressable accessibilityRole="button" onPress={() => router.push('/add')}>
          <Text style={styles.link}>Open the full form</Text>
        </Pressable>
      </View>
      <View style={styles.statsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Statistics</Text>
          <Text style={styles.statsCaption}>All time</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.mintCard]}>
            <Text style={styles.statLabel}>Total Lent</Text>
            <Text style={styles.statAmount}>{formatMoney(totalLent)}</Text>
          </View>

          <View style={[styles.statCard, styles.lavenderCard]}>
            <Text style={styles.statLabel}>Total Borrowed</Text>
            <Text style={styles.statAmount}>{formatMoney(totalBorrowed)}</Text>
          </View>

          <View style={[styles.statCard, styles.peachCard]}>
            <Text style={styles.statLabel}>Pending Records</Text>
            <Text style={styles.statNumber}>{pendingCount}</Text>
          </View>

          <View style={[styles.statCard, styles.greenCard]}>
            <Text style={styles.statLabel}>Returned Records</Text>
            <Text style={styles.statNumber}>{returnedCount}</Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Return Progress</Text>
            <Text style={styles.progressPercent}>{returnedPercent}%</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${returnedPercent}%` }]} />
          </View>

          <Text style={styles.progressHint}>
            {returnedCount} of {totalRecords} records returned
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent activity</Text>
      </View>

      {recent.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No records yet</Text>
          <Text style={styles.emptyBody}>
            Add the first thing you lent or borrowed. It stays on this phone after you close the app.
          </Text>
        </View>
      ) : (
        recent.map((record) => <RecordCard key={record.id} record={record} showReturn={!record.returned} />)
      )}
    </Screen>
  );
}


function SummaryCard({ label, amount, detail, accent, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.summary,
        { borderColor: accent === colors.teal ? '#BCEBD8' : '#CDB9F4' },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.summaryTop}>
        <View style={[styles.accentBar, { backgroundColor: accent }]} />
        <Text style={styles.summaryArrow}>↗</Text>
      </View>

      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryAmount}>{amount}</Text>
      <Text style={styles.summaryDetail}>{detail}</Text>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  header: {
    gap: 6,
  },
  kicker: {
    color: colors.teal,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.6,
    color: colors.text,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summary: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 6,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  accentBar: {
    width: 36,
    height: 4,
    borderRadius: 99,
    marginBottom: 6,
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  summaryAmount: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  summaryDetail: {
    color: colors.faint,
    fontSize: 13,
  },
  quickAdd: {
    backgroundColor: colors.cardRaised,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#3A2E78',
    padding: 18,
    gap: 12,
    shadowColor: colors.purple,
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  quickKicker: {
    color: colors.purple,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  quickTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  quickBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  input: {
    backgroundColor: colors.input,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.teal,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  primaryLabel: {
    color: colors.tealInk,
    fontWeight: '800',
    fontSize: 14,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.purple,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  secondaryLabel: {
    color: colors.purpleInk,
    fontWeight: '800',
    fontSize: 14,
  },
  link: {
    color: '#7652B5',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
    paddingVertical: 8,
  },
  sectionHeader: {
    marginTop: 4,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  empty: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    gap: 6,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  pressed: {
    opacity: 0.82,
  },
  statsSection: {
    marginTop: 20,
    marginBottom: 8,
  },
  statsCaption: {
    fontSize: 13,
    color: colors.muted,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 4,
  },
  mintCard: {
    backgroundColor: '#D1FAE5',
  },
  lavenderCard: {
    backgroundColor: '#EDE9FE',
  },
  peachCard: {
    backgroundColor: '#FFEDD5',
  },
  greenCard: {
    backgroundColor: '#E0F2FE',
  },
  statLabel: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
    marginBottom: 6,
  },
  statAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  progressCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6D28D9',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 999,
  },
  progressHint: {
    fontSize: 12,
    color: colors.muted,
  },
});
