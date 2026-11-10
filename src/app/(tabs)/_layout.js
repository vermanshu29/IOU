
import { NativeTabs } from 'expo-router/native-tabs';


export default function TabLayout() {
  return (
    <NativeTabs
      backgroundColor="#FFFFFF"
      tintColor="#7652B5"
      indicatorColor="#EDE4FC"
      iconColor={{
        default: '#A99DB5',
        selected: '#7652B5',
      }}
      labelVisibilityMode="labeled"
      rippleColor="#EDE4FC"
      labelStyle={{
        default: {
          color: '#95889F',
          fontSize: 11,
          fontWeight: '600',
        },
        selected: {
          color: '#6946A5',
          fontSize: 11,
          fontWeight: '800',
        },
      }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="they-owe">
        <NativeTabs.Trigger.Label>Cash out</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="arrow.up.right" md="call_made" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="i-owe">
        <NativeTabs.Trigger.Label>Cash in</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="arrow.down.left" md="call_received" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="history">
        <NativeTabs.Trigger.Label>History</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="clock.fill" md="history" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="hall-of-shame">
        <NativeTabs.Trigger.Label>Wanted</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="star.fill" md="star" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
