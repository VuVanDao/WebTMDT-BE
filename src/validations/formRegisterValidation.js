import { ApiError } from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";

export const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required().default(null),
    email: Joi.string().required().default(null),
    phoneNumber: Joi.string().required().default(null),
    description: Joi.string().required().default(null),
    image: Joi.string().required().default(null),
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
export const formRegisterValidation = {
  createNew,
};
