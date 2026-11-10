
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/palette';
import { useRecords } from '@/context/RecordsContext';
import {
  formatDisplayDate,
  formatMoney,
  isOverdue,
  recordTitle,
} from '@/lib/records';

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
          <View style={[styles.statusBadge, styles.returnedBadge]}>
            <Text style={styles.returned}>Returned ✓</Text>
          </View>
        ) : overdue ? (
          <View style={[styles.statusBadge, styles.overdueBadge]}>
            <Text style={styles.overdue}>Overdue</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.person}>With {record.person}</Text>

      <View style={styles.metaRow}>
        {typeof record.amount === 'number' && record.itemName ? (
          <Text style={styles.meta}>{formatMoney(record.amount)}</Text>
        ) : null}

        <Text style={styles.meta}>
          {formatDisplayDate(record.date)}
        </Text>

        {record.returnDate && !record.returned ? (
          <Text style={styles.meta}>
            Due {formatDisplayDate(record.returnDate)}
          </Text>
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
          style={({ pressed }) => [
            styles.returnButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.returnLabel}>✓  Mark as returned</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    gap: 11,
    shadowColor: colors.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  pill: {
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 6,
  },

  lentPill: {
    backgroundColor: '#DDF7EE',
  },

  borrowedPill: {
    backgroundColor: '#EEE5FF',
  },

  pillText: {
    fontSize: 12,
    fontWeight: '800',
  },

  lentText: {
    color: '#28765D',
  },

  borrowedText: {
    color: '#6946A5',
  },

  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },

  returnedBadge: {
    backgroundColor: '#DDF7EE',
  },

  overdueBadge: {
    backgroundColor: '#FFF0D9',
  },

  returned: {
    color: '#28765D',
    fontSize: 12,
    fontWeight: '800',
  },

  overdue: {
    color: '#A35D16',
    fontSize: 12,
    fontWeight: '800',
  },

  title: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.4,
  },

  person: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '500',
  },

  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 3,
  },

  meta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '500',
  },

  returnButton: {
    marginTop: 8,
    borderRadius: 15,
    backgroundColor: '#BCEBD8',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  returnLabel: {
    color: '#245C49',
    fontSize: 15,
    fontWeight: '800',
  },

  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
});
