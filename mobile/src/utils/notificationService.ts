import notifee, {
    AndroidImportance,
    AndroidVisibility,
} from '@notifee/react-native';

export async function createNotificationChannel() {
    await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
    });
}

export async function showLocalNotification(
    title: string,
    body: string,
) {
    await notifee.displayNotification({
        title,
        body,
        android: {
            channelId: 'default',
            importance: AndroidImportance.HIGH,
            visibility: AndroidVisibility.PUBLIC,
            pressAction: {
                id: 'default',
            },
            smallIcon: 'ic_launcher',
            sound: 'default',
            vibrationPattern: [300, 500],
            timestamp: Date.now(),
            showTimestamp: true,
            autoCancel: true,
            ongoing: false,
        },
    });
}