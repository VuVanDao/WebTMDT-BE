import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
const STATUS_ITEM = {
  BOUGHT: "bought",
  NOT_BUY: "not_buy",
};
const NOTIFICATION_COLLECTION_NAME = "notification";
const NOTIFICATION_COLLECTION_SCHEMA = Joi.object({
  content: Joi.string().required(),
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
export const notificationModel = {
  NOTIFICATION_COLLECTION_NAME,
  NOTIFICATION_COLLECTION_SCHEMA,
  addNewNotification,
};
