import Joi from "joi";
import { StatusCodes } from "http-status-codes";

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required().trim().min(2).strict(),
    description: Joi.string().required().trim().min(3).strict(),
    price: Joi.number().required(),
  });
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ error: new Error(error).message });
  }
};
export const productValidation = {
  createNew,
};
