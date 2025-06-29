import { StatusCodes } from "http-status-codes";
import { formRegisterRouters } from "~/routes/v1/FormRegisterRouters";
import { categoryService } from "~/services/categoryService";

const createNew = async (req, res, next) => {
  try {
    const result = await formRegisterRouters.createNew(req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const findOneById = async (req, res, next) => {
  try {
    const id = req.query.id;
    const result = await formRegisterRouters.findOneById(id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
export const formRegisterController = {
  createNew,
  findOneById,
};
