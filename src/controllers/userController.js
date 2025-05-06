import { StatusCodes } from "http-status-codes";
import { userServices } from "~/services/userService";

const register = async (req, res, next) => {
  try {
    // console.log("reqBody", req.body);

    const createdUser = await userServices.register(req.body);

    res.status(StatusCodes.CREATED).json(createdUser);
  } catch (error) {
    next(error);
  }
};

const verifyAccount = async (req, res, next) => {
  try {
    const result = await userServices.verifyAccount(req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const createdUser = await userServices.login(req.body);
    res.status(StatusCodes.CREATED).json(createdUser);
  } catch (error) {
    next(error);
  }
};
export const userController = {
  login,
  register,
  verifyAccount,
};
