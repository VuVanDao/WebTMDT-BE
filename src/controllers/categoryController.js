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
const searchCategory = async (req, res, next) => {
  try {
    const { q } = req.query;
    const queryFilter = q;
    const result = await categoryService.searchCategory(queryFilter);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const deleteCategory = async (req, res, next) => {
  try {
    const id = req.query.id;

    const result = await categoryService.deleteCategory(id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const findByAlphabet = async (req, res, next) => {
  try {
    const id = req.query.id;
    if (!id) {
      res.status(StatusCodes.OK).json({
        message: "Missing parameter",
      });
    }
    const result = await categoryService.findByAlphabet(id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
export const categoryController = {
  createNewCategory,
  getAllCategory,
  searchCategory,
  deleteCategory,
  findByAlphabet,
};
