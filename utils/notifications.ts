import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export async function registerForPushNotificationsAsync() {
  try {
    if (!Device.isDevice) {
      alert("Must use physical device for Push Notifications");
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    alert(existingStatus);
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token");
      return null;
    }

    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "be812c0e-2d3f-4ee2-8452-8b51c76af8f3",
      })
    ).data;

    alert(token);

    return token;
  } catch (error) {
    console.error("Error registering for push notifications:", error);
    alert(
      "An unexpected error occurred while registering for push notifications."
    );
    return null;
  }
}
