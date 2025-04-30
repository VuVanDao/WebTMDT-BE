import Joi from "joi";

const CATEGORY_COLLECTION_NAME = "category";
const CATEGORY_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().trim().min(2).strict(),
  description: Joi.string().required().trim().strict(),
  image: Joi.string().required(),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});
export const categoryModel = {
  CATEGORY_COLLECTION_NAME,
  CATEGORY_COLLECTION_SCHEMA,
};
