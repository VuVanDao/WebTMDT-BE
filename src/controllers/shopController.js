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
const getDetailShopByOwnerId = async (req, res, next) => {
  try {
    const ownerId = req.query.id;
    if (!ownerId) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing parameter (id)" });
    }
    const detailShop = await shopService.getDetailShopByOwnerId(ownerId);
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
const verifyShop = async (req, res, next) => {
  try {
    const shopBrowsed = await shopService.verifyShop(req.body);
    if (!shopBrowsed) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Not found" });
    }
    res.status(StatusCodes.OK).json(shopBrowsed);
  } catch (error) {
    next(error);
  }
};
const cancelRegisterShop = async (req, res, next) => {
  try {
    const shopBrowsed = await shopService.cancelRegisterShop(req.query.id);
    if (!shopBrowsed) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Not found" });
    }
    res.status(StatusCodes.OK).json(shopBrowsed);
  } catch (error) {
    next(error);
  }
};
const updateShop = async (req, res, next) => {
  try {
    const shopId = req.jwtDecoded.shopId;
    const shopLogo = req.file;
    const shopData = req.body;
    if (!shopId || !shopData) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing parameter" });
    }
    const updatedShop = await shopService.updateShop(
      shopId,
      shopData,
      shopLogo
    );
    res.status(StatusCodes.OK).json(updatedShop);
  } catch (error) {
    next(error);
  }
};
const getAllShop = async (req, res, next) => {
  try {
    const allShop = await shopService.getAllShop();
    res.status(StatusCodes.OK).json(allShop);
  } catch (error) {
    next(error);
  }
};
const deleteShop = async (req, res, next) => {
  try {
    const id = req.query.id;
    const result = await shopService.deleteShop(id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
export const shopController = {
  register,
  getDetailShop,
  registerLogo,
  browseShop,
  updateShop,
  getAllShop,
  deleteShop,
  getDetailShopByOwnerId,
  verifyShop,
  cancelRegisterShop,
};
