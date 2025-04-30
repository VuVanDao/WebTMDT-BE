import Joi from "joi";
import {
  BOARD_INVITATION_STATUS,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  PAYMENT_METHOD,
} from "~/utils/constants";

const ORDER_COLLECTION_NAME = "order";
const ORDER_COLLECTION_SCHEMA = Joi.object({
  buyerId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  description: Joi.string().required().trim().strict(),
  totalPrice: Joi.number().required(),
  status: Joi.string()
    .required()
    .valid(...Object.values(BOARD_INVITATION_STATUS))
    .default(BOARD_INVITATION_STATUS.PENDING),
  paymentMethod: Joi.string()
    .required()
    .valid(...Object.values(PAYMENT_METHOD))
    .default(PAYMENT_METHOD.CASH),
  shippingAddress: Joi.string().required().trim().strict(),
  shippingFee: Joi.number().optional(),
  orderItems: Joi.array()
    .items({
      itemId: Joi.string()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      quantity: Joi.number(),
      price: Joi.number(),
      image: Joi.string(),
    })
    .required(),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});
export const orderModel = {
  ORDER_COLLECTION_NAME,
  ORDER_COLLECTION_SCHEMA,
};
