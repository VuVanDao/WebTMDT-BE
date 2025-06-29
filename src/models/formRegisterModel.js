import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";

const FORM_REGISTER_COLLECTION_NAME = "formRegister";
const FORM_REGISTER_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().trim().min(2).strict(),
  address: Joi.string().required().default(null),
  email: Joi.string().required().default(null),
  phoneNumber: Joi.string().required().default(null),
  description: Joi.string().required().default(null),
  image: Joi.string().required().default(null),
  delivery_type: Joi.array().default([]),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});
const validateBeforeCreate = async (data) => {
  return await FORM_REGISTER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
    allowUnknown: true,
  });
};
const createNew = async (data) => {
  const result = await validateBeforeCreate(data);
  try {
    const newForm = await GET_DB()
      .collection(FORM_REGISTER_COLLECTION_NAME)
      .insertOne(result);
    return newForm;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(FORM_REGISTER_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id),
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
export const formRegisterModel = {
  FORM_REGISTER_COLLECTION_NAME,
  FORM_REGISTER_COLLECTION_SCHEMA,
  createNew,
  findOneById,
};
