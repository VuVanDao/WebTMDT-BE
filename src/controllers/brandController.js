import { StatusCodes } from "http-status-codes";
import { brandService } from "~/services/brandsService";

const createNew = async (req, res, next) => {
  try {
    const { brandName, shopOwnerBrand, brandImage } = req.body;
    if (!brandName || !shopOwnerBrand || !brandImage) {
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
export const brandController = {
  createNew,
};
