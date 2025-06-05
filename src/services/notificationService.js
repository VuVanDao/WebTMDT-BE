import { ObjectId } from "mongodb";
import { notificationModel } from "~/models/notificationModel";

export const addNewNotification = async (notificationData) => {
  try {
    let newOwnerNotificationId = new ObjectId(
      notificationData.ownerNotificationId
    );
    const result = await notificationModel.addNewNotification({
      ...notificationData,
      ownerNotificationId: newOwnerNotificationId,
    });
    return result;
  } catch (error) {
    throw error;
  }
};
export const getNotification = async (id) => {
  try {
    const result = await notificationModel.getNotification(id);
    return result;
  } catch (error) {
    throw error;
  }
};
export const deleteNotification = async (notificationId) => {
  try {
    const result = await notificationModel.deleteNotification(notificationId);
    return result;
  } catch (error) {
    throw error;
  }
};
export const notificationService = {
  addNewNotification,
  getNotification,
  deleteNotification,
};
