import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} from "~/utils/constants";
import { shopModel } from "./shopModel";

const PRODUCT_COLLECTION_NAME = "products";
const PRODUCT_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().trim().min(2),
  description: Joi.string().required().trim().min(3),
  price: Joi.string().required(),
  discount: Joi.optional().default(null),
  quantity: Joi.string().required(),
  image: Joi.array().items().default([]),
  shopId: Joi.required(),
  sold: Joi.number().default(0),
  ratingAverage: Joi.number().default(0),
  ratingAverageVoted: Joi.number().default(0),
  soldCount: Joi.number(),
  comments: Joi.array()
    .items({
      userId: Joi.string()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      userEmail: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
      userAvatar: Joi.string(),
      rating: Joi.number().required(),
      commentContent: Joi.string(),
      commentAt: Joi.date().timestamp(),
    })
    .default([]),
  categoryId: Joi.array()
    .items({
      id: Joi.string(),
      name: Joi.string(),
      image: Joi.string(),
    })
    .default([]),
  tagsId: Joi.array().items().default([]),
  size: Joi.array().items().default([]), //danh reing cho quan ao
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

const validateBeforeCreate = async (data) => {
  return await PRODUCT_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  const result = await validateBeforeCreate(data);
  try {
    const createdNewProduct = await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .insertOne(result);
    return createdNewProduct;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const createdNewProduct = await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $lookup: {
            from: shopModel.SHOP_OWNER_COLLECTION_NAME,
            localField: "shopId",
            foreignField: "_id",
            as: "ShopInfo",
          },
        },
      ])
      .toArray();
    return createdNewProduct;
  } catch (error) {
    throw new Error(error);
  }
};

const addImage = async (imageFile, id) => {
  try {
    const logoShop = await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $push: { image: imageFile } },
        { returnDocument: "after" }
      );

    return logoShop;
  } catch (error) {
    throw new Error(error);
  }
};

const GetAllProduct = async (id) => {
  try {
    let result = "";
    if (id) {
      const queryCondition = [
        {
          shopId: new ObjectId(id),
        },
      ];
      result = await GET_DB()
        .collection(PRODUCT_COLLECTION_NAME)
        .aggregate([
          {
            $match: {
              $and: queryCondition,
            },
          },
        ])
        .toArray();
    } else {
      const queryCondition = [
        {
          shopId: new ObjectId(id),
        },
      ];
      result = await GET_DB()
        .collection(PRODUCT_COLLECTION_NAME)
        .aggregate([])
        .toArray();
    }

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (productId, updateData) => {
  try {
    const result = await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(productId) },
        { $set: updateData },
        { returnDocument: "after" }
      );
    // console.log("result", result);

    return result || null;
  } catch (error) {
    throw new Error(error);
  }
};

const searchProduct = async (queryFilter) => {
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
    // const query = await GET_DB()
    //   .collection(PRODUCT_COLLECTION_NAME)
    //   .aggregate(
    //     [
    //       {
    //         $match: {
    //           $and: queryCondition,
    //         },
    //       },
    //       {
    //         //sort theo title theo A-Z
    //         $sort: {
    //           title: 1,
    //         },
    //       },
    //     ],
    //     {
    //       //colaation: dung de fix loi sort khong chinh xac
    //       collation: {
    //         locale: "en",
    //       },
    //     }
    //   )
    //   .toArray();

    //neu dung cach nay thi doi strict trong mongodb.js = false
    const query = await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .aggregate([
        {
          $search: {
            index: "default",
            text: {
              query: queryFilter?.name,
              path: ["name", "tagsId"],
            },
          },
        },
      ])
      .toArray();
    return query;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteProduct = async (id) => {
  try {
    const result = await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
// const searchProduct = async (queryFilter) => {
//   try {
//     const searchConditions = {
//       $or: [{ name: { $regex: queryFilter.name, $options: "i" } }],
//     };
//     const products = await GET_DB()
//       .collection(PRODUCT_COLLECTION_NAME)
//       .find(searchConditions)
//       .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo mới nhất
//       .toArray();

//     return products;
//   } catch (error) {
//     throw new Error(error);
//   }
// };
export const productModel = {
  PRODUCT_COLLECTION_NAME,
  PRODUCT_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  addImage,
  GetAllProduct,
  update,
  searchProduct,
  deleteProduct,
};
