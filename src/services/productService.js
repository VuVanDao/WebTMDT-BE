import { productModel } from "~/models/productModel";

const createNew = async (reqBody) => {
  try {
    const newProduct = {
      ...reqBody,
    };
    const productCreated = await productModel.createNew(newProduct);
    const productWasCreated = await productModel.findOneById(
      productCreated.insertedId
    );
    console.log("🚀 ~ createNew ~ productWasCreated:", productWasCreated);

    return productWasCreated;
  } catch (error) {
    throw error;
  }
};
export const productService = {
  createNew,
};
