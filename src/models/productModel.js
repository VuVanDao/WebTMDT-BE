import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} from "~/utils/constants";

const PRODUCT_COLLECTION_NAME = "products";
const PRODUCT_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().trim().min(2).strict(),
  description: Joi.string().required().trim().min(3).strict(),
  price: Joi.number().required(),
  discount: Joi.optional().default(null),
  quantity: Joi.number().required(),
  image: Joi.array().items().default([]),
  shopId: Joi.string().required(),
  sold: Joi.number().default(0),
  color: Joi.array().items({
    // = category ben FE
    name: Joi.string().required(),
    image: Joi.string().required(),
  }),
  ratingAverage: Joi.number().default(0),
  ratingAverageVoted: Joi.number().default(0),
  soldCount: Joi.number().required(),
  comments: Joi.array()
    .items({
      userId: Joi.string()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      userEmail: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
      userAvatar: Joi.string(),
      rating: Joi.number().required(),
      commentContent: Joi.string(),
      commentAt: Joi.date().timestamp(),
    })
    .default([]),
  categoryId: Joi.array().items().default([]),
  size: Joi.array().items().default([]), //danh reing cho quan ao
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

const validateBeforeCreate = async (data) => {
  return await PRODUCT_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};
const createNew = async (data) => {
  const result = await validateBeforeCreate(data);
  try {
    const createdNewProduct = await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .insertOne(result);
    return createdNewProduct;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneById = async (id) => {
  try {
    const createdNewProduct = await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
    return createdNewProduct;
  } catch (error) {
    throw new Error(error);
  }
};
export const productModel = {
  PRODUCT_COLLECTION_NAME,
  PRODUCT_COLLECTION_SCHEMA,
  createNew,
  findOneById,
};
