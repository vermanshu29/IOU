
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export async function scheduleReminder(record) {
    const permission = await Notifications.requestPermissionsAsync();

    if (!permission.granted) {
        return null;
    }

    const reminderDate = new Date(record.date);
    reminderDate.setDate(reminderDate.getDate() + 1);
    reminderDate.setHours(9, 0, 0, 0);

    if (reminderDate <= new Date()) {
        return null;
    }

    return await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Reminder: Follow up!',
            body: `Remember to check on ${record.item} with ${record.person}.`,
            data: { recordId: record.id },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: reminderDate,
        },
    });
}
