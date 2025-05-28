import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ApiError from "~/utils/ApiError";

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    customerInfo: Joi.object().required(),
    category: Joi.string().required(),
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

export const orderValidation = {
  createNew,
};
