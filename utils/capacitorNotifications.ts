import { Capacitor } from '@capacitor/core';

export async function initPushNotifications() {
  // Gracefully exit if not running in the native shell (desktop or mobile web browser)
  if (typeof window === 'undefined' || !Capacitor.isNativePlatform()) {
    return;
  }

  try {
    const { PushNotifications } = await import('@capacitor/push-notifications');
    const { Posthog } = await import('@capawesome/capacitor-posthog');

    // 1. Check and request push notification permissions
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive !== 'granted') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive === 'granted') {
      // 2. Register for push notifications
      await PushNotifications.register();
    } else {
      console.warn('Push notification permissions were denied.');
    }

    // 3. Listen to the 'registration' event
    await PushNotifications.addListener('registration', (token) => {
      console.log('🔥 Firebase Token Is: ', token.value);
    });

    // 4. Listen to the 'registrationError' event
    await PushNotifications.addListener('registrationError', (error) => {
      console.error('Push notification registration error:', error);
    });

    // 5. Listen to the 'pushNotificationActionPerformed' event (notification clicked)
    await PushNotifications.addListener('pushNotificationActionPerformed', async (action) => {
      console.log('Push notification action performed:', action);

      const notificationData = action.notification?.data || {};
      const campaignName = notificationData.campaign_name || null;
      const offerId = notificationData.offer_id || null;
      const actionId = action.actionId || null;

      try {
        await Posthog.capture({
          event: 'Notification Clicked',
          properties: {
            campaign_name: campaignName,
            offer_id: offerId,
            action_id: actionId,
          },
        });
        console.log('Successfully captured "Notification Clicked" event via Capawesome PostHog:', {
          campaign_name: campaignName,
          offer_id: offerId,
          action_id: actionId,
        });
      } catch (posthogError) {
        console.error('Failed to capture event via Capawesome PostHog:', posthogError);
      }
    });

  } catch (error) {
    console.error('Error initializing push notifications / Capawesome PostHog:', error);
  }
}
