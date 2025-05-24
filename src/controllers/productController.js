import { StatusCodes } from "http-status-codes";
import { productService } from "~/services/productService";

const createNew = async (req, res, next) => {
  try {
    const { shopId } = req.body;
    if (!shopId) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Missing id" });
    }
    const createdProduct = await productService.createNew(req.body, shopId);
    res.status(StatusCodes.CREATED).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

const addImage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const imageFile = req.files;
    if (!id || !imageFile) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Missing id" });
    }
    const createdImageProduct = await productService.addImage(id, imageFile);
    res.status(StatusCodes.CREATED).json(createdImageProduct);
  } catch (error) {
    next(error);
  }
};

const GetAllProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Missing id" });
    }
    const AllProduct = await productService.GetAllProduct(id);
    res.status(StatusCodes.CREATED).json(AllProduct);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const productId = req.body.id;
    const productImage = req.file;
    const result = await productService.update(
      productId,
      req.body,
      productImage
    );
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Missing id" });
    }
    const detailProduct = await productService.getProductById(id);
    res.status(StatusCodes.CREATED).json(detailProduct);
  } catch (error) {
    next(error);
  }
};
export const productController = {
  createNew,
  addImage,
  GetAllProduct,
  update,
  getProductById,
};
