import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { ORDER_INVITATION_STATUS } from "~/utils/constants";
import { shopModel } from "./shopModel";
import { productModel } from "./productModel";
import { ObjectId } from "mongodb";

const ORDER_COLLECTION_NAME = "order";
const ORDER_COLLECTION_SCHEMA = Joi.object({
  customerId: Joi.required(),
  name: Joi.string().required(),
  category: Joi.string().required(),
  quantity: Joi.number().required(),
  price: Joi.number().required(),
  size: Joi.optional().default(null),
  shopId: Joi.required(),
  status: Joi.string()
    .valid(...Object.values(ORDER_INVITATION_STATUS))
    .default(ORDER_INVITATION_STATUS.PENDING),
  customerInfo: Joi.object().required(),
  textMessage: Joi.string().default(""),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});
const validateBeforeCreate = async (data) => {
  return await ORDER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
    allowUnknown: true,
  });
};
const createNew = async (orderData) => {
  const result = await validateBeforeCreate(orderData);
  try {
    const newOrder = await GET_DB()
      .collection(ORDER_COLLECTION_NAME)
      .insertOne(result);
    return newOrder;
  } catch (error) {
    throw new Error(error);
  }
};
const getAllOrder = async (statusOrder, customerId) => {
  try {
    const queryCondition = [
      {
        status: statusOrder,
        customerId: customerId,
      },
    ];
    const newOrder = await GET_DB()
      .collection(ORDER_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            $and: queryCondition,
          },
        },
        {
          $lookup: {
            from: shopModel.SHOP_OWNER_COLLECTION_NAME,
            localField: "shopId",
            foreignField: "_id",
            as: "ShopInfo",
            pipeline: [
              {
                $project: {
                  ratingAverage: 0,
                  ratingAverageVoted: 0,
                  ownerId: 0,
                  status: 0,
                  createdAt: 0,
                  updatedAt: 0,
                },
              },
            ],
          },
        },
      ])
      .toArray();
    return newOrder;
  } catch (error) {
    throw new Error(error);
  }
};
const getOrderByShopId = async (shopId) => {
  try {
    const queryCondition = [
      {
        shopId: new ObjectId(shopId),
      },
    ];
    const listOrders = await GET_DB()
      .collection(ORDER_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            $and: queryCondition,
          },
        },
        {
          $lookup: {
            from: productModel.PRODUCT_COLLECTION_NAME,
            localField: "productId",
            foreignField: "_id",
            as: "productInfo",
          },
        },
      ])
      .toArray();
    return listOrders;
  } catch (error) {
    throw new Error(error);
  }
};
const update = async (data, orderId) => {
  try {
    const result = await GET_DB()
      .collection(ORDER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(orderId) },
        { $set: data },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
export const orderModel = {
  ORDER_COLLECTION_NAME,
  ORDER_COLLECTION_SCHEMA,
  createNew,
  getAllOrder,
  getOrderByShopId,
  update,
};
