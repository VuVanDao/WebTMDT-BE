import { StatusCodes } from "http-status-codes";
import { categoryModel } from "~/models/categoryModel";
import ApiError from "~/utils/ApiError";

const createNewCategory = async (reqBody) => {
  try {
    const { name, image = "" } = reqBody;
    const category = await categoryModel.findOneCategory(name);
    if (category) {
      throw new ApiError(StatusCodes.CONFLICT, "Danh mục đã tồn tại");
    }
    const newCategory = {
      name,
      image,
    };
    const newCategoryCreated = await categoryModel.createNewCategory(
      newCategory
    );

    return newCategoryCreated;
  } catch (error) {
    throw error;
  }
};
const getAllCategory = async () => {
  try {
    const allCategory = await categoryModel.getAllCategory();
    return allCategory;
  } catch (error) {
    throw error;
  }
};
const searchCategory = async (queryFilter) => {
  try {
    const result = await categoryModel.searchCategory(queryFilter);
    return result;
  } catch (error) {
    throw error;
  }
};
const deleteCategory = async (id) => {
  try {
    const deletedCategory = await categoryModel.deleteCategory(id);
    return deletedCategory;
  } catch (error) {
    throw error;
  }
};
export const categoryService = {
  createNewCategory,
  getAllCategory,
  searchCategory,
  deleteCategory,
};
