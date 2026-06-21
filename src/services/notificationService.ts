import notifee, {
  AndroidImportance,
  TriggerType,
  RepeatFrequency,
  TimestampTrigger,
  AndroidNotificationSetting,
  AuthorizationStatus,
} from '@notifee/react-native';

const CHANNEL_ID = 'weather-alerts';
const CHANNEL_DAILY = 'weather-daily';

export const setupNotifee = async () => {
  const settings = await notifee.requestPermission();
  if (settings.authorizationStatus < AuthorizationStatus.AUTHORIZED) return false;

  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Alerty pogodowe',
    importance: AndroidImportance.HIGH,
    vibration: true,
    sound: 'default',
  });

  await notifee.createChannel({
    id: CHANNEL_DAILY,
    name: 'Dzienny raport',
    importance: AndroidImportance.DEFAULT,
    sound: 'default',
  });

  return true;
};

export const sendAQIAlert = async (aqi: string, city: string, aqiColor: string) => {
  const bad = ['zła', 'bardzo zła', 'niebezpieczna', 'niezdrowa'];
  if (!bad.some(b => aqi.toLowerCase().includes(b))) return;

  await notifee.displayNotification({
    title: `😷 Słaba jakość powietrza — ${city}`,
    body: `AQI: ${aqi}. Rozważ pozostanie w domu lub załóż maskę.`,
    android: {
      channelId: CHANNEL_ID,
      color: aqiColor,
      importance: AndroidImportance.HIGH,
      smallIcon: 'ic_launcher',
      pressAction: { id: 'default' },
    },
  });
};

export const sendStormAlert = async (description: string, city: string) => {
  const storm = ['burza', 'thunder', 'storm', 'blizzard', 'zamieć'];
  if (!storm.some(s => description.toLowerCase().includes(s))) return;

  await notifee.displayNotification({
    title: `⛈️ Alert burzowy — ${city}`,
    body: `${description}. Unikaj otwartych terenów.`,
    android: {
      channelId: CHANNEL_ID,
      color: '#f44336',
      importance: AndroidImportance.HIGH,
      smallIcon: 'ic_launcher',
      pressAction: { id: 'default' },
    },
  });
};

export const scheduleDailyReport = async (hour: number = 7) => {
  await notifee.cancelAllNotifications();

  const now = new Date();
  const trigger = new Date();
  trigger.setHours(hour, 0, 0, 0);
  if (trigger <= now) trigger.setDate(trigger.getDate() + 1);

  const timestampTrigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: trigger.getTime(),
    repeatFrequency: RepeatFrequency.DAILY,
  };

  await notifee.createTriggerNotification(
    {
      title: '🌦️ Dziennik pogody',
      body: 'Sprawdź prognozę na dziś i jakość powietrza.',
      android: {
        channelId: CHANNEL_DAILY,
        smallIcon: 'ic_launcher',
        pressAction: { id: 'default' },
      },
    },
    timestampTrigger,
  );
};

export const cancelDailyReport = async () => {
  await notifee.cancelAllNotifications();
};
