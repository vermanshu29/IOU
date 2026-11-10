import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { RecordCard } from '@/components/record-card';
import { Screen } from '@/components/screen';
import { colors } from '@/constants/palette';
import { useRecords } from '@/context/RecordsContext';

export function RecordListScreen({
  title,
  subtitle,
  filter,
  emptyTitle,
  emptyBody,
  showReturn = false,
  addType,
  sort,
}) {
  const { records } = useRecords();
  const [search, setSearch] = useState('');

  const visible = records
    .filter(filter)
    .filter((record) =>
      (record.person || '').toLowerCase().includes(search.trim().toLowerCase())
    );

  const ordered = sort ? [...visible].sort(sort) : visible;
  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {addType ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/add', params: { type: addType } })}
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
            <Text style={styles.addLabel}>Add</Text>
          </Pressable>
        ) : null}
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by person's name..."
        placeholderTextColor={colors.faint}
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
      />
      <Text style={styles.count}>
        {ordered.length} {ordered.length === 1 ? 'record' : 'records'}
      </Text>

      {ordered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>{emptyTitle}</Text>
          <Text style={styles.emptyBody}>{emptyBody}</Text>
        </View>
      ) : (
        ordered.map((record) => (
          <RecordCard key={record.id} record={record} showReturn={showReturn} />
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerCopy: {
    flex: 1,
    gap: 6,
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
  },
  addButton: {
    backgroundColor: colors.teal,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 4,
  },
  addLabel: {
    color: colors.tealInk,
    fontWeight: '800',
    fontSize: 15,
  },
  count: {
    color: colors.faint,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  empty: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 22,
    gap: 8,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: colors.text,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  emptyBody: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  pressed: {
    opacity: 0.8,
  },
});
