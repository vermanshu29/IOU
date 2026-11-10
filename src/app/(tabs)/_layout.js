import { NativeTabs } from 'expo-router/native-tabs';

import { colors } from '@/constants/palette';

export default function TabLayout() {
  return (
    <NativeTabs
      backgroundColor={colors.background}
      tintColor={colors.teal}
      indicatorColor={colors.teal}
      iconColor={{ default: colors.faint, selected: colors.teal }}
      labelVisibilityMode="labeled"
      rippleColor={colors.teal}
      labelStyle={{
        default: { color: colors.faint, fontSize: 11, fontWeight: '600' },
        selected: { color: colors.teal, fontSize: 11, fontWeight: '700' },
      }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="they-owe">
        <NativeTabs.Trigger.Label>They Owe</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="arrow.up.right" md="call_made" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="i-owe">
        <NativeTabs.Trigger.Label>I Owe</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="arrow.down.left" md="call_received" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="history">
        <NativeTabs.Trigger.Label>History</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="clock.fill" md="history" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
