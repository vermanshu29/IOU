import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/components/screen';
import { colors } from '@/constants/palette';
import { useRecords } from '@/context/RecordsContext';
import { isISODate, todayISO } from '@/lib/records';
import { scheduleReminder } from '@/lib/reminders';

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

  async function save() {
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

    const record = addRecord({
      itemName: cleanItem,
      amount: parsedAmount,
      person: cleanPerson,
      type,
      date,
      returnDate: cleanReturn || null,
    });

    try {
      await scheduleReminder({
        ...record,
        item: record.itemName,
      });
    } catch (error) {
      console.log('Reminder scheduling failed:', error);
    }

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
      marginBottom: 4,
    },
    cancel: {
      color: '#7652B5',
      fontSize: 15,
      fontWeight: '700',
      padding: 6,
    },
    title: {
      color: '#302744',
      fontSize: 32,
      fontWeight: '800',
      letterSpacing: -0.8,
    },
    subtitle: {
      color: '#82758F',
      fontSize: 15,
      lineHeight: 23,
      marginTop: -8,
      marginBottom: 8,
    },
    field: {
      gap: 9,
      marginBottom: 5,
    },
    label: {
      color: '#503879',
      fontSize: 15,
      fontWeight: '800',
    },
    hint: {
      color: '#95889F',
      fontSize: 13,
      marginTop: -10,
      marginBottom: 4,
    },
    input: {
      backgroundColor: '#F5F0FC',
      borderWidth: 1,
      borderColor: '#E7DDF3',
      borderRadius: 17,
      color: '#302744',
      fontSize: 16,
      paddingHorizontal: 17,
      paddingVertical: 17,
    },
    inputError: {
      borderColor: '#F28B9B',
    },
    error: {
      color: '#D65C75',
      fontSize: 13,
      lineHeight: 18,
    },
    segment: {
      flexDirection: 'row',
      gap: 12,
    },
    segmentButton: {
      flex: 1,
      borderRadius: 17,
      borderWidth: 1.5,
      borderColor: '#E7DDF3',
      backgroundColor: '#F5F0FC',
      paddingVertical: 17,
      alignItems: 'center',
    },
    segmentTeal: {
      backgroundColor: '#BCEBD8',
      borderColor: '#BCEBD8',
    },
    segmentPurple: {
      backgroundColor: '#CDB9F4',
      borderColor: '#CDB9F4',
    },
    segmentLabel: {
      color: '#82758F',
      fontWeight: '800',
      fontSize: 15,
    },
    segmentTealText: {
      color: '#245C49',
    },
    segmentPurpleText: {
      color: '#503879',
    },
    footer: {
      gap: 10,
      maxWidth: 640,
      width: '100%',
      alignSelf: 'center',
    },
    footerError: {
      color: '#D65C75',
      fontSize: 13,
    },
    save: {
      backgroundColor: '#7652B5',
      borderRadius: 17,
      paddingVertical: 17,
      alignItems: 'center',
      shadowColor: '#7652B5',
      shadowOpacity: 0.2,
      shadowRadius: 9,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    saveLabel: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '800',
    },
    pressed: {
      opacity: 0.78,
    },
  });

