import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";

const NOTIFICATION_COLLECTION_NAME = "notification";
const NOTIFICATION_COLLECTION_SCHEMA = Joi.object({
  content: Joi.string().required(),
  ownerNotificationId: Joi.string().required(),
  createdAp: Joi.date().timestamp("javascript").default(null),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});
export const addNewNotification = async (data) => {
  try {
    const newOrder = await GET_DB()
      .collection(NOTIFICATION_COLLECTION_NAME)
      .insertOne(data);
    return newOrder;
  } catch (error) {
    throw new Error(error);
  }
};

export const getNotification = async (id) => {
  try {
    const newOrder = await GET_DB()
      .collection(NOTIFICATION_COLLECTION_NAME)
      .find({
        ownerNotificationId: new ObjectId(id),
      })
      .toArray();
    return newOrder;
  } catch (error) {
    throw new Error(error);
  }
};
export const deleteNotification = async (notificationId) => {
  try {
    const deletedNotification = await GET_DB()
      .collection(NOTIFICATION_COLLECTION_NAME)
      .deleteOne({
        _id: new ObjectId(notificationId),
      });

    return deletedNotification;
  } catch (error) {
    throw new Error(error);
  }
};
export const notificationModel = {
  NOTIFICATION_COLLECTION_NAME,
  NOTIFICATION_COLLECTION_SCHEMA,
  addNewNotification,
  getNotification,
  deleteNotification,
};
