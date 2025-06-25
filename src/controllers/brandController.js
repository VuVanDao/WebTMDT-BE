import { StatusCodes } from "http-status-codes";
import { brandService } from "~/services/brandsService";

const createNew = async (req, res, next) => {
  try {
    const { brandName, shopOwnerBrand, brandImage } = req.body;
    if (!brandName || !brandImage) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Missing parameter",
      });
    }
    const result = await brandService.createNew(req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getAllBrand = async (req, res, next) => {
  try {
    const result = await brandService.getAllBrand();
    res.status(StatusCodes.OK).json(result ?? []);
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
    const result = await brandService.findByAlphabet(id);
    res.status(StatusCodes.OK).json(result ?? []);
  } catch (error) {
    next(error);
  }
};
export const brandController = {
  createNew,
  getAllBrand,
  findByAlphabet,
};
