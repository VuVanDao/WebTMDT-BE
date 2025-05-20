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
} from "~/utils/constants";
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
    .required()
    .default(DELIVERY_TYPE.FAST),
  ratingAverage: Joi.number().default(0),
  status: Joi.boolean().default(false),
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
    // throw new Error(error);
  }
};
const GetAllShop = async () => {
  try {
    const queryCondition = [
      {
        status: false,
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
      .findOne({
        _id: new ObjectId(id),
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const getDetailShopByOwnerId = async (id) => {
  console.log("🚀 ~ getDetailShopByOwnerId ~ id:", id);
  try {
    const result = await GET_DB()
      .collection(SHOP_OWNER_COLLECTION_NAME)
      .findOne({
        ownerId: new ObjectId(id),
      });
    console.log("🚀 ~ getDetailShopByOwnerId ~ result:", result);
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
};
