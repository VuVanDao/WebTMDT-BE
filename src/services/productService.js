import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import { productModel } from "~/models/productModel";
import { shopModel } from "~/models/shopModel";
import { cloudinaryProvider } from "~/providers/cloudinaryProvider";
import ApiError from "~/utils/ApiError";

const createNew = async (reqBody, shopId) => {
  try {
    const newShopId = new ObjectId(shopId);
    const newProduct = {
      ...reqBody,
      shopId: newShopId,
    };
    const productCreated = await productModel.createNew(newProduct);
    const productWasCreated = await productModel.findOneById(
      productCreated.insertedId
    );

    return productWasCreated;
  } catch (error) {
    throw error;
  }
};
const addImage = async (id, imageList) => {
  try {
    let checkAddImage = {};

    imageList.map(async (item) => {
      const uploadResult = await cloudinaryProvider.streamUpload(
        item.buffer,
        "imageProduct"
      );
      if (uploadResult) {
        const getProduct = await productModel.findOneById(id);
        if (getProduct) {
          checkAddImage = await productModel.addImage(
            uploadResult.secure_url,
            getProduct[0]?._id
          );
        }
      }
    });

    return checkAddImage;
  } catch (error) {
    throw error;
  }
};
const GetAllProduct = async (id) => {
  try {
    let AllProduct = await productModel.GetAllProduct(id);
    return AllProduct;
  } catch (error) {
    throw error;
  }
};

const update = async (productId, reqBody, productImage) => {
  try {
    const existsProduct = await productModel.findOneById(productId);
    if (!existsProduct) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Your product is not exist");
    }

    let updatedProduct = {};
    //th1:change name
    if (reqBody.name) {
      updatedProduct = await productModel.update(productId, {
        name: reqBody.name,
      });
    } else if (productImage) {
      //th2:change avatar, upload file len cloudinary
      productImage.map(async (item) => {
        const uploadResult = await cloudinaryProvider.streamUpload(
          item.buffer,
          "imageProduct"
        );
        if (uploadResult) {
          updatedProduct = await productModel.addImage(
            productId,
            uploadResult.secure_url
          );
        }
      });
      updatedProduct = await productModel.addImage(
        productId,
        uploadResult.secure_url
      );
    } else if (reqBody?.commentToAdd) {
      let targetProduct = await productModel.findOneById(productId);
      const { rating } = reqBody?.commentToAdd;
      //cap nhat rating cua product
      if (targetProduct[0]?.comments?.length > 0) {
        const totalRating = targetProduct[0]?.comments.reduce(
          (sum, item) => sum + (item?.rating || 0),
          0
        );
        targetProduct[0].ratingAverage =
          (totalRating + rating) / (targetProduct[0].comments.length + 1);
      } else {
        targetProduct[0].ratingAverage = rating;
      }
      console.log("🚀 ~ update ~ targetProduct[0]?.:", targetProduct[0]);

      //th update comment
      updatedProduct = await productModel.update(productId, {
        comments:
          existsProduct.comments?.length >= 1
            ? [
                ...existsProduct.comments,
                { ...reqBody?.commentToAdd, commentAt: Date.now() },
              ]
            : [{ ...reqBody?.commentToAdd, commentAt: Date.now() }],
        ratingAverage: targetProduct[0].ratingAverage,
      });
    } else if (reqBody?.newQuantity) {
      let newData = {
        ...reqBody,
        quantity: +existsProduct?.quantity - reqBody?.newQuantity,
        sold: +existsProduct?.sold + +reqBody?.newQuantity,
      };
      delete newData?.newQuantity;
      updatedProduct = await productModel.update(productId, newData);
    } else {
      //th3:change other fields
      updatedProduct = await productModel.update(productId, reqBody);
    }

    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

const getProductById = async (id) => {
  try {
    let detailProduct = await productModel.findOneById(id);
    let detailShop = await shopModel.getDetailShop(detailProduct[0]?.shopId);
    return { ...detailProduct[0], ShopInfo: detailShop };
  } catch (error) {
    throw error;
  }
};

const searchProduct = async (queryFilter) => {
  try {
    const result = await productModel.searchProduct(queryFilter);
    return result;
  } catch (error) {
    throw error;
  }
};
const deleteProduct = async (id) => {
  try {
    const result = await productModel.deleteProduct(id);
    return result;
  } catch (error) {
    throw error;
  }
};
const findProduct = async (findProduct) => {
  try {
    const { data } = findProduct;
    let result = [];
    let condition = [];
    if (data?.price) {
      condition.push({
        $expr: {
          $and: [
            { $gte: [{ $toDouble: "$price" }, data.price.from] },
            {
              $lte: [
                { $toDouble: "$price" },
                data.price.to === 0 ? 1000000000 : data.price.to,
              ],
            },
          ],
        },
      });
    }

    result = await productModel.findProduct({
      $and: [...condition, { name: { $regex: data.value, $options: "i" } }],
    });

    if (data.shop) {
      result = result?.find((item) => item?.name?.includes(data?.shop));
    }

    return result;
  } catch (error) {
    throw error;
  }
};
export const productService = {
  createNew,
  addImage,
  GetAllProduct,
  update,
  getProductById,
  searchProduct,
  deleteProduct,
  findProduct,
};
