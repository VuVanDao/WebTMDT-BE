import { StatusCodes } from "http-status-codes";
import { env } from "~/config/environment";
import { jwtProvider } from "~/providers/jwtProvider";
import { userServices } from "~/services/userService";
import ms from "ms";

const refreshToken = async (req, res, next) => {
  try {
    const result = await userServices.refreshToken(req.cookies?.refreshToken);
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"),
    });
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(new ApiError(StatusCodes.FORBIDDEN, "Plz sign in first"));
  }
};
const register = async (req, res, next) => {
  try {
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
    //tao ra 2 loai token, access token, refresh token
    const accessToken = await jwtProvider.generateToken(
      createdUser,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      // 5
      env.ACCESS_TOKEN_LIFE
    );
    const refreshToken = await jwtProvider.generateToken(
      createdUser,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      // 15
      env.REFRESH_TOKEN_LIFE
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"), //thoi gian song cua cookie
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"), //thoi gian song cua cookie
    });
    res.status(StatusCodes.CREATED).json(createdUser);
  } catch (error) {
    next(error);
  }
};
const logout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(StatusCodes.OK).json({ logged: true });
  } catch (error) {
    next(error);
  }
};

const GetAllShop = async (req, res, next) => {
  try {
    const allShop = await userServices.GetAllShop();
    res.status(StatusCodes.CREATED).json(allShop);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const idUpdate = req.body?.idUpdate;
    const userAvatarFile = req.file;
    const result = await userServices.update(
      idUpdate ? idUpdate : userId,
      req.body,
      userAvatarFile
    );
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const GetAllProduct = async (req, res, next) => {
  try {
    const allProductAvailable = await userServices.GetAllProduct();

    res.status(StatusCodes.CREATED).json(allProductAvailable);
  } catch (error) {
    next(error);
  }
};

const GetAllAccount = async (req, res, next) => {
  try {
    const allAccountAvailable = await userServices.GetAllAccount();
    res.status(StatusCodes.CREATED).json(allAccountAvailable);
  } catch (error) {
    next(error);
  }
};
const createNew = async (req, res, next) => {
  try {
    const createdUser = await userServices.createNew(req.body);
    res.status(StatusCodes.CREATED).json(createdUser);
  } catch (error) {
    next(error);
  }
};

export const userController = {
  login,
  register,
  verifyAccount,
  logout,
  GetAllShop,
  update,
  refreshToken,
  GetAllProduct,
  GetAllAccount,
  createNew,
};
