import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/components/screen';
import { colors } from '@/constants/palette';
import { useRecords } from '@/context/RecordsContext';
import { isISODate, todayISO } from '@/lib/records';

function firstParam(value) {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }
  return typeof value === 'string' ? value : '';
}

export default function AddRecordScreen() {
  const params = useLocalSearchParams();
  const { addRecord } = useRecords();
  const initialType = firstParam(params.type) === 'borrowed' ? 'borrowed' : 'lent';
  const [itemName, setItemName] = useState(firstParam(params.note));
  const [amount, setAmount] = useState('');
  const [person, setPerson] = useState('');
  const [type, setType] = useState(initialType);
  const [date, setDate] = useState(todayISO());
  const [returnDate, setReturnDate] = useState('');
  const [errors, setErrors] = useState({});

  function save() {
    const nextErrors = {};
    const cleanItem = itemName.trim();
    const cleanPerson = person.trim();
    const cleanAmount = amount.trim();
    let parsedAmount = null;

    if (!cleanItem && !cleanAmount) {
      nextErrors.itemName = 'Enter an item name or a money amount.';
      nextErrors.amount = 'Enter an item name or a money amount.';
    }

    if (cleanAmount) {
      if (!/^\d+(\.\d{1,2})?$/.test(cleanAmount) || Number(cleanAmount) <= 0) {
        nextErrors.amount = 'Use a number greater than 0, with up to 2 decimals.';
      } else {
        parsedAmount = Math.round(Number(cleanAmount) * 100) / 100;
      }
    }

    if (!cleanPerson) {
      nextErrors.person = 'Enter the person’s name.';
    }

    if (type !== 'lent' && type !== 'borrowed') {
      nextErrors.type = 'Choose I Lent or I Borrowed.';
    }

    if (!isISODate(date)) {
      nextErrors.date = 'Use a real date in YYYY-MM-DD format.';
    }

    const cleanReturn = returnDate.trim();
    if (cleanReturn && !isISODate(cleanReturn)) {
      nextErrors.returnDate = 'Use YYYY-MM-DD, or leave this blank.';
    } else if (cleanReturn && isISODate(date) && cleanReturn < date) {
      nextErrors.returnDate = 'The return date cannot be before the transaction date.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    addRecord({
      itemName: cleanItem,
      amount: parsedAmount,
      person: cleanPerson,
      type,
      date,
      returnDate: cleanReturn || null,
    });
    router.back();
  }

  return (
    <Screen
      bottomInset={24}
      footer={
        <View style={styles.footer}>
          {Object.keys(errors).length > 0 ? (
            <Text style={styles.footerError}>Check the highlighted fields, then save again.</Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            onPress={save}
            style={({ pressed }) => [styles.save, pressed && styles.pressed]}>
            <Text style={styles.saveLabel}>Save record</Text>
          </Pressable>
        </View>
      }>
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} hitSlop={8}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
      </View>
      <Text style={styles.title}>Add record</Text>
      <Text style={styles.subtitle}>A name, a person, and whether you lent or borrowed is enough.</Text>

      <Field
        label="Item name"
        value={itemName}
        onChangeText={setItemName}
        placeholder="Camera, jacket, textbook"
        error={errors.itemName}
      />
      <Field
        label="Money amount"
        value={amount}
        onChangeText={setAmount}
        placeholder="20.00"
        keyboardType="decimal-pad"
        error={errors.amount}
      />
      <Text style={styles.hint}>Fill in the item, the amount, or both.</Text>

      <Field
        label="Person"
        value={person}
        onChangeText={setPerson}
        placeholder="Alex"
        error={errors.person}
      />

      <Text style={styles.label}>Transaction</Text>
      <View style={styles.segment}>
        <SegmentButton label="I Lent" selected={type === 'lent'} onPress={() => setType('lent')} tone="teal" />
        <SegmentButton
          label="I Borrowed"
          selected={type === 'borrowed'}
          onPress={() => setType('borrowed')}
          tone="purple"
        />
      </View>
      {errors.type ? <Text style={styles.error}>{errors.type}</Text> : null}

      <Field
        label="Date"
        value={date}
        onChangeText={setDate}
        placeholder="2026-11-10"
        autoCapitalize="none"
        error={errors.date}
      />
      <Field
        label="Return date (optional)"
        value={returnDate}
        onChangeText={setReturnDate}
        placeholder="2026-11-20"
        autoCapitalize="none"
        error={errors.returnDate}
      />
    </Screen>
  );
}

function Field({ label, error, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.faint}
        style={[styles.input, error && styles.inputError]}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function SegmentButton({ label, selected, onPress, tone }) {
  const selectedStyle = tone === 'purple' ? styles.segmentPurple : styles.segmentTeal;
  const selectedText = tone === 'purple' ? styles.segmentPurpleText : styles.segmentTealText;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.segmentButton,
        selected && selectedStyle,
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.segmentLabel, selected && selectedText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancel: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: '700',
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: -8,
  },
  field: {
    gap: 8,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  hint: {
    color: colors.faint,
    fontSize: 13,
    marginTop: -8,
  },
  input: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    lineHeight: 18,
  },
  segment: {
    flexDirection: 'row',
    gap: 10,
  },
  segmentButton: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.input,
    paddingVertical: 14,
    alignItems: 'center',
  },
  segmentTeal: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  segmentPurple: {
    backgroundColor: colors.purple,
    borderColor: colors.purple,
  },
  segmentLabel: {
    color: colors.muted,
    fontWeight: '800',
    fontSize: 15,
  },
  segmentTealText: {
    color: colors.tealInk,
  },
  segmentPurpleText: {
    color: colors.purpleInk,
  },
  footer: {
    gap: 10,
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
  footerError: {
    color: colors.danger,
    fontSize: 13,
  },
  save: {
    backgroundColor: colors.teal,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveLabel: {
    color: colors.tealInk,
    fontSize: 17,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.82,
  },
});
