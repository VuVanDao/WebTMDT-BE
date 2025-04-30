import { StatusCodes } from "http-status-codes";
import { productService } from "~/services/productService";

const createNew = async (req, res, next) => {
  try {
    const createdProduct = await productService.createNew(req.body);
    res.status(StatusCodes.CREATED).json(createdProduct);
  } catch (error) {
    next(error);
  }
};
export const productController = {
  createNew,
};
