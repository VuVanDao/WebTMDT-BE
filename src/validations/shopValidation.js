import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ApiError from "~/utils/ApiError";
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PHONE_RULE,
  PHONE_RULE_MESSAGE,
} from "~/utils/constants";

export const register = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    email: Joi.string()
      .required()
      .pattern(EMAIL_RULE)
      .message(EMAIL_RULE_MESSAGE),
    phoneNumber: Joi.string().pattern(PHONE_RULE).message(PHONE_RULE_MESSAGE),
    address: Joi.string().required(),
  });
  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};
export const getDetailShop = async (req, res, next) => {
  try {
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};
export const shopValidation = {
  register,
  getDetailShop,
};
