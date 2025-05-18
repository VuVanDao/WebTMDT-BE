import { StatusCodes } from "http-status-codes";
import { shopService } from "~/services/shopService";

const register = async (req, res, next) => {
  try {
    const registeredShop = await shopService.register(req.body);
    res.status(StatusCodes.CREATED).json(registeredShop);
  } catch (error) {
    next(error);
  }
};
export const shopController = {
  //   login,
  register,
  //   verifyAccount,
  //   logout,
};
