import { notificationModel } from "~/models/notificationModel";

export const addNewNotification = async (notificationData) => {
  try {
    const result = await notificationModel.addNewNotification(notificationData);
    return result;
  } catch (error) {
    throw error;
  }
};
export const notificationService = {
  addNewNotification,
};
