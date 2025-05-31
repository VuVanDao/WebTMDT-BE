import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PHONE_RULE,
  PHONE_RULE_MESSAGE,
} from "~/utils/constants";
const USER_ROLES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
  SHOP_OWNER: "shop_owner",
};
const USER_COLLECTION_NAME = "user";
const USER_COLLECTION_SCHEMA = Joi.object({
  username: Joi.string().required().trim().min(2).strict(),
  email: Joi.string()
    .required()
    .pattern(EMAIL_RULE)
    .message(EMAIL_RULE_MESSAGE),
  password: Joi.string().required(),
  avatar: Joi.string().default(""),
  phoneNumber: Joi.string()
    .pattern(PHONE_RULE)
    .message(PHONE_RULE_MESSAGE)
    .default(""),
  role: Joi.string()
    .valid(...Object.values(USER_ROLES))
    .default(USER_ROLES.ADMIN),
  address: Joi.array().items(Joi.string()).default(""),
  isActive: Joi.boolean().default(false),
  online: Joi.boolean().default(false),
  verifyToken: Joi.string(),
  cartItem: Joi.array().default([]),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});
const invalidUpdateFields = ["_id"];
const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};
const register = async (data) => {
  try {
    const validateData = await validateBeforeCreate(data);
    const createdUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne(validateData);
    return createdUser;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneByID = async (userId) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(userId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneByEmail = async (emailValue) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ email: emailValue });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (userId, updateData) => {
  try {
    Object.keys(updateData).forEach((fieldName) => {
      if (invalidUpdateFields.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });
    // console.log("updateData", updateData);
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updateData },
        { returnDocument: "after" }
      );
    // console.log("result", result);

    return result || null;
  } catch (error) {
    throw new Error(error);
  }
};

const GetAllAccount = async () => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .aggregate([
        {
          $match: {},
        },
      ])
      .toArray();

    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const createNew = async (data) => {
  try {
    const createdUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne(data);
    return createdUser;
  } catch (error) {
    throw new Error(error);
  }
};
export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  findOneByID,
  findOneByEmail,
  register,
  update,
  GetAllAccount,
  createNew,
};
