import { ApiError } from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";

export const createNewCategory = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().min(2).required(),
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
export const categoryValidation = {
  createNewCategory,
};
