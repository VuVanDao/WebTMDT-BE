import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/constants";

import { ObjectId } from "mongodb";

const BRAND_COLLECTION_NAME = "brand";
const BRAND_COLLECTION_SCHEMA = Joi.object({
  brandName: Joi.string().required(),
  shopOwnerBrand: Joi.required(),
  brandImage: Joi.string().required(),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});
const validateBeforeCreate = async (data) => {
  return await BRAND_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
    allowUnknown: true,
  });
};
const createNew = async (orderData) => {
  const result = await validateBeforeCreate(orderData);
  try {
    const newBrand = await GET_DB()
      .collection(BRAND_COLLECTION_NAME)
      .insertOne(result);
    return newBrand;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const brand = await GET_DB()
      .collection(BRAND_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
    return brand;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllBrand = async () => {
  try {
    const brands = await GET_DB().collection(BRAND_COLLECTION_NAME).find();
    return brands;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (data, brandId) => {
  try {
    const result = await GET_DB()
      .collection(BRAND_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(brandId) },
        { $set: data },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const deleteOrder = async (brandId) => {
  try {
    const result = await GET_DB()
      .collection(BRAND_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(brandId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const brandModel = {
  BRAND_COLLECTION_NAME,
  BRAND_COLLECTION_SCHEMA,
  createNew,
  update,
  deleteOrder,
  findOneById,
};
