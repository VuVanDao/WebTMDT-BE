import { StatusCodes } from "http-status-codes";
import { shopService } from "~/services/shopService";

const register = async (req, res, next) => {
  try {
    const registeredShop = await shopService.register(req.body);
    res.status(StatusCodes.OK).json(registeredShop);
  } catch (error) {
    next(error);
  }
};
const registerLogo = async (req, res, next) => {
  try {
    const id = req.params.id;
    const logoFile = req.file;
    if (!id || !logoFile) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing parameter" });
    }
    // console.log("🚀 ~ registerLogo ~ logoFile:", logoFile);
    const registeredShopLogo = await shopService.registerLogo(logoFile, id);
    res.status(StatusCodes.OK).json(registeredShopLogo);
  } catch (error) {
    next(error);
  }
};
const getDetailShop = async (req, res, next) => {
  try {
    const shopId = req.params.id;
    if (!shopId) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing parameter (id)" });
    }
    const detailShop = await shopService.getDetailShop(shopId);
    if (!detailShop) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Not found" });
    }
    res.status(StatusCodes.OK).json(detailShop);
  } catch (error) {
    next(error);
  }
};
const browseShop = async (req, res, next) => {
  try {
    const shopId = req.body.shopId;
    const selection = req.body.selection;
    if (!shopId || !selection) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing parameter " });
    }
    const shopBrowsed = await shopService.browseShop(shopId, selection);
    if (!shopBrowsed) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Not found" });
    }
    res.status(StatusCodes.OK).json(shopBrowsed);
  } catch (error) {
    next(error);
  }
};
export const shopController = {
  register,
  getDetailShop,
  registerLogo,
  browseShop,
};
