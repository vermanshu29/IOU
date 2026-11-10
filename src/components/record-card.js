import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/palette';
import { formatDisplayDate, formatMoney, isOverdue, recordTitle } from '@/lib/records';
import { useRecords } from '@/context/RecordsContext';

export function RecordCard({ record, showReturn = false }) {
  const { markReturned } = useRecords();
  const lent = record.type === 'lent';
  const title = recordTitle(record);
  const overdue = isOverdue(record);

  function confirmReturn() {
    Alert.alert(
      'Mark as returned?',
      `${title} with ${record.person} will move to History.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Returned', onPress: () => markReturned(record.id) },
      ],
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.pill, lent ? styles.lentPill : styles.borrowedPill]}>
          <Text style={[styles.pillText, lent ? styles.lentText : styles.borrowedText]}>
            {lent ? 'I lent' : 'I borrowed'}
          </Text>
        </View>
        {record.returned ? (
          <Text style={styles.returned}>Returned</Text>
        ) : overdue ? (
          <Text style={styles.overdue}>Overdue</Text>
        ) : null}
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.person}>{record.person}</Text>

      <View style={styles.metaRow}>
        {typeof record.amount === 'number' && record.itemName ? (
          <Text style={styles.meta}>{formatMoney(record.amount)}</Text>
        ) : null}
        <Text style={styles.meta}>{formatDisplayDate(record.date)}</Text>
        {record.returnDate && !record.returned ? (
          <Text style={styles.meta}>Due {formatDisplayDate(record.returnDate)}</Text>
        ) : null}
        {record.returned && record.returnedAt ? (
          <Text style={styles.meta}>
            Back {formatDisplayDate(record.returnedAt.slice(0, 10))}
          </Text>
        ) : null}
      </View>

      {showReturn && !record.returned ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Mark ${title} as returned`}
          onPress={confirmReturn}
          style={({ pressed }) => [styles.returnButton, pressed && styles.pressed]}>
          <Text style={styles.returnLabel}>Mark returned</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 8,
    shadowColor: colors.shadow,
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  pill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  lentPill: {
    backgroundColor: 'rgba(39, 224, 195, 0.16)',
  },
  borrowedPill: {
    backgroundColor: 'rgba(128, 103, 255, 0.2)',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  lentText: {
    color: colors.teal,
  },
  borrowedText: {
    color: '#C4B6FF',
  },
  returned: {
    color: colors.teal,
    fontSize: 12,
    fontWeight: '700',
  },
  overdue: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  person: {
    color: colors.muted,
    fontSize: 15,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  meta: {
    color: colors.faint,
    fontSize: 13,
  },
  returnButton: {
    marginTop: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.teal,
    paddingVertical: 12,
    alignItems: 'center',
  },
  returnLabel: {
    color: colors.teal,
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
