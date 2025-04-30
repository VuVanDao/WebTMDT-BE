import Joi from "joi";
import {
  BOARD_INVITATION_STATUS,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  PAYMENT_METHOD,
} from "~/utils/constants";
const STATUS_ITEM = {
  BOUGHT: "bought",
  NOT_BUY: "not_buy",
};
const CART_COLLECTION_NAME = "cart";
const CART_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  listItems: Joi.array()
    .items({
      itemId: Joi.string()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      quantity: Joi.number(),
      price: Joi.number(),
      image: Joi.string(),
      status: Joi.valid(...Object.values(STATUS_ITEM)).default(
        STATUS_ITEM.NOT_BUY
      ),
    })
    .default([]),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

export const cartModel = {
  CART_COLLECTION_NAME,
  CART_COLLECTION_SCHEMA,
};
