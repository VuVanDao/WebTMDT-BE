import Joi from "joi";
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
  avatar: Joi.string().default(null),
  phoneNumber: Joi.string()
    .required()
    .pattern(PHONE_RULE)
    .message(PHONE_RULE_MESSAGE),
  role: Joi.string()
    .valid(...Object.values(USER_ROLES))
    .default(USER_ROLES.CUSTOMER),
  address: Joi.array().items(Joi.string()).required(),
  verifyToken: Joi.string(),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});
export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
};
