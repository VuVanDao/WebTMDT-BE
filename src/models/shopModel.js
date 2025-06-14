import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import {
  DELIVERY_TYPE,
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  PHONE_RULE,
  PHONE_RULE_MESSAGE,
  SHOP_STATUS_STATE,
} from "~/utils/constants";
import { userModel } from "./userModel";
import { productModel } from "./productModel";
const SHOP_OWNER_COLLECTION_NAME = "shop";
const SHOP_OWNER_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().trim().min(2).strict(),
  description: Joi.string().required().trim().strict(),
  email: Joi.string()
    .required()
    .pattern(EMAIL_RULE)
    .message(EMAIL_RULE_MESSAGE),
  logo: Joi.string().required(),
  ownerId: Joi.required(),
  phoneNumber: Joi.string()
    .pattern(PHONE_RULE)
    .message(PHONE_RULE_MESSAGE)
    .default(""),
  address: Joi.string().required(),
  delivery_type: Joi.array()
    .items(Joi.valid(...Object.keys(DELIVERY_TYPE)))
    .default(DELIVERY_TYPE.FAST),
  ratingAverage: Joi.number().default(0),
  status: Joi.valid(...Object.keys(SHOP_STATUS_STATE)).default(
    SHOP_STATUS_STATE.PENDING
  ),
  ratingAverageVoted: Joi.number().default(0),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});
const validateBeforeCreate = async (data) => {
  return await SHOP_OWNER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};
const register = async (data) => {
  try {
    const validateData = await validateBeforeCreate(data);
    const createdUser = await GET_DB()
      .collection(SHOP_OWNER_COLLECTION_NAME)
      .insertOne(validateData);
    return createdUser;
  } catch (error) {
    throw new Error(error);
  }
};
const registerLogo = async (logoFile, id) => {
  try {
    const logoShop = await GET_DB()
      .collection(SHOP_OWNER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: logoFile },
        { returnDocument: "after" }
      );
    return logoShop;
  } catch (error) {
    throw new Error(error);
  }
};
const GetAllShop = async () => {
  try {
    const queryCondition = [
      {
        status: SHOP_STATUS_STATE.PENDING,
      },
    ];
    const result = await GET_DB()
      .collection(SHOP_OWNER_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            $and: queryCondition,
          },
        },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: "ownerId",
            foreignField: "_id",
            as: "Owner",
            pipeline: [
              {
                $project: {
                  password: 0,
                  verifyToken: 0,
                  createdAt: 0,
                  updatedAt: 0,
                },
              },
            ],
          },
        },
      ])
      .toArray();

    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const getDetailShop = async (id) => {
  try {
    const result = await GET_DB()
      .collection(SHOP_OWNER_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id), // hoặc điều kiện khác
          },
        },
        {
          // Lookup để join với products collection
          $lookup: {
            from: productModel.PRODUCT_COLLECTION_NAME,
            localField: "_id",
            foreignField: "shopId",
            as: "products",
            pipeline: [
              {
                $project: {
                  updatedAt: 0,
                },
              },
            ],
          },
        },
      ])
      .toArray();

    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const getDetailShopByOwnerId = async (id) => {
  try {
    const result = await GET_DB()
      .collection(SHOP_OWNER_COLLECTION_NAME)
      .findOne({
        ownerId: new ObjectId(id),
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const browseShop = async (shopId, dataSelection) => {
  try {
    const logoShop = await GET_DB()
      .collection(SHOP_OWNER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(shopId) },
        { $set: dataSelection },
        { returnDocument: "after" }
      );
    return logoShop;
  } catch (error) {
    throw new Error(error);
  }
};
const updateShop = async (shopId, shopData) => {
  try {
    const result = await GET_DB()
      .collection(SHOP_OWNER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(shopId) },
        { $set: shopData },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const getAllShop = async () => {
  try {
    const result = await GET_DB()
      .collection(SHOP_OWNER_COLLECTION_NAME)
      .aggregate([
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: "ownerId",
            foreignField: "_id",
            as: "Owner",
            pipeline: [
              {
                $project: {
                  password: 0,
                  verifyToken: 0,
                },
              },
            ],
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
export const shopModel = {
  SHOP_OWNER_COLLECTION_NAME,
  SHOP_OWNER_COLLECTION_SCHEMA,
  register,
  GetAllShop,
  getDetailShop,
  registerLogo,
  getDetailShopByOwnerId,
  browseShop,
  updateShop,
  getAllShop,
};
