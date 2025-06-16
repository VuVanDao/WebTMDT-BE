import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  ORDER_INVITATION_STATUS,
} from "~/utils/constants";
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
  comments: Joi.array()
    .items({
      userId: Joi.string()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      userEmail: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
      userAvatar: Joi.string(),
      username: Joi.string(),
      rating: Joi.number().required(),
      commentContent: Joi.string(),
      commentAt: Joi.date().timestamp(),
    })
    .default([]),
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

const findOneById = async (id) => {
  try {
    const order = await GET_DB()
      .collection(ORDER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
    return order;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllOrder = async (statusOrder, customerId) => {
  try {
    if (statusOrder === "All") {
      const queryCondition = [
        {
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
            $sort: {
              createdAt: -1,
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
    } else {
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
            $sort: {
              createdAt: -1,
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
    }
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
          $sort: {
            createdAt: -1,
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
const deleteOrder = async (orderId) => {
  try {
    const result = await GET_DB()
      .collection(ORDER_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(orderId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const getOrderByAdmin = async () => {
  try {
    const AllOrder = await GET_DB()
      .collection(ORDER_COLLECTION_NAME)
      .aggregate([
        {
          $lookup: {
            from: shopModel.SHOP_OWNER_COLLECTION_NAME,
            localField: "shopId",
            foreignField: "_id",
            as: "ShopInfo",
          },
        },
      ])
      .sort({ createdAt: -1 })
      .toArray();
    return AllOrder;
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
  deleteOrder,
  findOneById,
  getOrderByAdmin,
};
