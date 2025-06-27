import { brandModel } from "~/models/brandsModel";
import { shopModel } from "~/models/shopModel";

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
const findByAlphabet = async (id) => {
  try {
    let Brands = [];
    if (!id) {
      return {
        message: "Missing parameter",
      };
    }
    if (id === "All") {
      Brands = await brandModel.getAllBrand();
    } else {
      Brands = await brandModel.findByAlphabet(id);
    }
    return Brands ?? [];
  } catch (error) {
    throw error;
  }
};
const deleteBrand = async (id) => {
  try {
    if (!id) {
      return {
        message: "Missing parameter",
      };
    }
    const result = await brandModel.deleteBrand(id);
    return result;
  } catch (error) {
    throw error;
  }
};
const update = async (data, id) => {
  try {
    if (!id) {
      return {
        message: "Missing parameter",
      };
    }
    const result = await brandModel.update(
      { ...data, updatedAt: Date.now() },
      id
    );
    if (data.shopOwnerBrand?.length > 0 && result) {
      await shopModel.updateShop(data?.shopOwnerBrand[0]?.id, {
        shopBrand: result?._id,
        updatedAt: Date.now(),
      });
    }

    return result;
  } catch (error) {
    throw error;
  }
};
const findBrand = async (findBrand) => {
  try {
    let result = [];
    let condition = [];
    if (findBrand?.tags) {
      condition.push({ tags: { $in: [findBrand?.tags] } });
    }
    result = await brandModel.findBrand({
      $and: [...condition],
    });

    return result;
  } catch (error) {
    throw error;
  }
};
export const brandService = {
  createNew,
  getAllBrand,
  findByAlphabet,
  deleteBrand,
  update,
  findBrand,
};
