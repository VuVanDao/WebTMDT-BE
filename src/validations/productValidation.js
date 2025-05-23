import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required().trim().min(2),
    description: Joi.string().required().trim().min(3),
    price: Joi.string().required(),
    quantity: Joi.string().required(),
    tagsId: Joi.array().min(1).required(),
    shopId: Joi.string().required(),
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
export const productValidation = {
  createNew,
};
