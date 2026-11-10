import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { colors } from '@/constants/palette';
import { RecordsProvider, useRecords } from '@/context/RecordsContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <RecordsProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </RecordsProvider>
  );
}

function RootNavigator() {
  const { hydrated } = useRecords();

  useEffect(() => {
    if (hydrated) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [hydrated]);

  if (!hydrated) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="add" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
