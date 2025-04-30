import Joi from "joi";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/constants";
const SHOP_OWNER_COLLECTION_NAME = "shop";
const SHOP_OWNER_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().trim().min(2).strict(),
  description: Joi.string().required().trim().strict(),
  image: Joi.string().required(),
  bannerUrl: Joi.string().required(),
  ownerId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  address: Joi.array().items(Joi.string()).required(),
  ratingAverage: Joi.number().default(0),
  ratingAverageVoted: Joi.number().default(0),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});
export const shopOwnerModel = {
  SHOP_OWNER_COLLECTION_NAME,
  SHOP_OWNER_COLLECTION_SCHEMA,
};
