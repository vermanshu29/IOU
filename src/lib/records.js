import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'who-has-my-stuff.records.v1';

const RATINGS_KEY = 'who-has-my-stuff.ratings.v1';

export async function loadRecords() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.filter((record) => record && typeof record.id === 'string');
}

export async function saveRecords(records) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function todayISO() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function isISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function formatDisplayDate(value) {
  if (!isISODate(value)) {
    return value || '';
  }

  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatMoney(amount) {
  const value = Number(amount) || 0;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function recordTitle(record) {
  if (record.itemName) {
    return record.itemName;
  }
  if (typeof record.amount === 'number') {
    return formatMoney(record.amount);
  }
  return 'Record';
}

export function isOverdue(record) {
  return Boolean(record.returnDate) && !record.returned && record.returnDate < todayISO();
}

export function sumOutstanding(records, type) {
  return records.reduce((total, record) => {
    if (record.type !== type || record.returned || typeof record.amount !== 'number') {
      return total;
    }
    return total + record.amount;
  }, 0);
}

export function countOpen(records, type) {
  return records.filter((record) => record.type === type && !record.returned).length;
}
export async function loadRatings() {
  const raw = await AsyncStorage.getItem(RATINGS_KEY);
  if (!raw) return [];

  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

export async function saveRatings(ratings) {
  await AsyncStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
}

