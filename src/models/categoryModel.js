import Joi from "joi";
import { GET_DB } from "~/config/mongodb";

const CATEGORY_COLLECTION_NAME = "category";
const CATEGORY_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().trim().min(2).strict(),
  image: Joi.string().optional().default(null),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});
const createNewCategory = async (data) => {
  try {
    const createdCategory = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .insertOne(data);
    return createdCategory;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneCategory = async (name) => {
  try {
    const result = await GET_DB().collection(CATEGORY_COLLECTION_NAME).findOne({
      name: name,
    });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const getAllCategory = async () => {
  try {
    const result = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const searchCategory = async (queryFilter) => {
  try {
    const queryCondition = [];
    //xu ly query cho tung truong hop
    if (queryFilter) {
      Object.keys(queryFilter).forEach((key) => {
        //ko phan biet chu hoa chu thuong
        queryCondition.push({
          [key]: { $regex: new RegExp(queryFilter[key], "i") },
        });
      });
    }
    const query = await GET_DB()
      .collection(CATEGORY_COLLECTION_NAME)
      .aggregate(
        [
          {
            $match: {
              $and: queryCondition,
            },
          },
          {
            //sort theo title theo A-Z
            $sort: {
              name: 1,
            },
          },
        ],
        {
          //colaation: dung de fix loi sort khong chinh xac
          collation: {
            locale: "en",
          },
        }
      )
      .toArray();
    return query;
  } catch (error) {
    throw new Error(error);
  }
};
export const categoryModel = {
  CATEGORY_COLLECTION_NAME,
  CATEGORY_COLLECTION_SCHEMA,
  createNewCategory,
  findOneCategory,
  getAllCategory,
  searchCategory,
};
