import { brandModel } from "~/models/brandsModel";

const createNew = async (brandData) => {
  try {
    const { brandName, shopOwnerBrand, brandImage } = brandData;
    if (!brandName || !brandImage) {
      return {
        message: "Missing parameter",
      };
    }
    const newBrand = await brandModel.createNew(brandData);
    return newBrand;
  } catch (error) {
    throw error;
  }
};

const getAllBrand = async () => {
  try {
    const Brands = await brandModel.getAllBrand();
    return Brands ?? [];
  } catch (error) {
    throw error;
  }
};
export const brandService = {
  createNew,
  getAllBrand,
};
