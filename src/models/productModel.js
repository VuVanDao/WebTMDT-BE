import Joi from "joi";
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
  stock: Joi.number().required(),
  image: Joi.array().items(Joi.string()).default([]),
  shopId: Joi.string().required(),
  categoryId: Joi.string().required(),
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
  categoryId: Joi.array().items(),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});
export const productModel = {
  PRODUCT_COLLECTION_NAME,
  PRODUCT_COLLECTION_SCHEMA,
};
