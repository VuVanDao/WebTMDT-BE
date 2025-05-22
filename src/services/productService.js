import { ObjectId } from "mongodb";
import { productModel } from "~/models/productModel";
import { cloudinaryProvider } from "~/providers/cloudinaryProvider";

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
            getProduct?._id
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
export const productService = {
  createNew,
  addImage,
  GetAllProduct,
};
