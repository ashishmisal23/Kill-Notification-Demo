import notifee, {
    AndroidImportance,
    AndroidVisibility,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'NOTIFICATIONS_ENABLED';

export async function createNotificationChannel() {
    try {
        const enabled = await AsyncStorage.getItem(STORAGE_KEY);
        if (enabled === 'false') return; // don't create channel if disabled
    } catch (e) {
        // proceed if storage read fails
    }
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
    try {
        const enabled = await AsyncStorage.getItem(STORAGE_KEY);
        if (enabled === 'false') return; // skip if disabled
    } catch (e) {
        // ignore storage errors and continue
    }

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