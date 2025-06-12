import { StatusCodes } from "http-status-codes";
import { categoryService } from "~/services/categoryService";

const createNewCategory = async (req, res, next) => {
  try {
    const newCategory = await categoryService.createNewCategory(req.body);
    res.status(StatusCodes.OK).json(newCategory);
  } catch (error) {
    next(error);
  }
};
const getAllCategory = async (req, res, next) => {
  try {
    const AllCategory = await categoryService.getAllCategory();
    res.status(StatusCodes.OK).json(AllCategory);
  } catch (error) {
    next(error);
  }
};
export const categoryController = {
  createNewCategory,
  getAllCategory,
};
