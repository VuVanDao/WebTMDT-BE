import { userModel } from "~/models/userModel";
import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { env } from "~/config/environment";
import { BrevoProvider } from "~/providers/brevoProvider";
import { pickUser } from "~/utils/formatter";
import { v4 as uuidv4 } from "uuid";
import ApiError from "~/utils/ApiError";
import { shopModel } from "~/models/shopModel";
import { nodemailerProvider } from "~/providers/nodemailerProvider";
import { cloudinaryProvider } from "~/providers/cloudinaryProvider";
import { jwtProvider } from "~/providers/jwtProvider";
import { productModel } from "~/models/productModel";
import { USER_ROLES } from "~/utils/constants";

const refreshToken = async (clientRefreshToken) => {
  try {
    //giai ma refreshToken tu client
    const refreshTokenDecoded = await jwtProvider.verifyToken(
      clientRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    );
    // tao token tra ve phia fe
    //tao thong tin de dinh kem trong jwt: _id va email cua user
    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email,
      username: refreshTokenDecoded.username,
      avatar: refreshTokenDecoded.avatar,
      phoneNumber: refreshTokenDecoded.phoneNumber,
      address: refreshTokenDecoded.address,
      cartItem: refreshTokenDecoded.cartItem,
      shopId: refreshTokenDecoded.shopId,
    };
    //tao ra refresh token
    const accessToken = await jwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    );

    return { accessToken };
  } catch (error) {
    throw error;
  }
};

const register = async (reqBody) => {
  try {
    const existsUser = await userModel.findOneByEmail(reqBody.email);
    if (existsUser) {
      throw new ApiError(StatusCodes.CONFLICT, "Email is already exists");
    }
    const nameFromEmail = reqBody.email.split("@")[0];
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8),
      username: nameFromEmail,
      verifyToken: uuidv4(),
    };

    const createdUser = await userModel.register(newUser);
    const getUser = await userModel.findOneByID(createdUser.insertedId);
    const verificationLink = `${env.WEBSITE_DOMAIN_DEVELOPMENT}/account/verification?email=${getUser.email}&token=${getUser.verifyToken}`;

    nodemailerProvider.sendEmail(getUser.email, verificationLink);

    return pickUser(getUser);
  } catch (error) {
    throw error;
  }
};

const verifyAccount = async (reqBody) => {
  try {
    const existsUser = await userModel.findOneByEmail(reqBody.email);
    if (!existsUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Your account is not exist");
    }
    if (existsUser.isActive) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your account is already active"
      );
    }
    if (reqBody.token !== existsUser.verifyToken) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "Token is invalid");
    }
    const updateData = {
      isActive: true,
      verifyToken: null,
    };
    const updatedUser = await userModel.update(existsUser._id, updateData);

    return pickUser(updatedUser);
  } catch (error) {
    throw error;
  }
};

const login = async (reqBody) => {
  try {
    let result = {};
    const existsUser = await userModel.findOneByEmail(reqBody.email);
    if (!existsUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Your account is not exist");
    }
    if (!bcryptjs.compareSync(reqBody.password, existsUser.password)) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your email or password is incorrect"
      );
    }
    if (!existsUser.isActive) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your account is not active"
      );
    }
    let shopUserOwner = {};
    if (existsUser?.role === "shop_owner") {
      shopUserOwner = await shopModel.getDetailShopByOwnerId(existsUser?._id);
    }

    result = { ...pickUser(existsUser), shopId: shopUserOwner._id };
    const accessToken = await jwtProvider.generateToken(
      result,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      // 5
      env.ACCESS_TOKEN_LIFE
    );
    const refreshToken = await jwtProvider.generateToken(
      result,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      // 15
      env.REFRESH_TOKEN_LIFE
    );
    return { accessToken, refreshToken, result };
  } catch (error) {
    throw error;
  }
};

const GetAllShop = async () => {
  try {
    const allShop = await shopModel.GetAllShop();
    return allShop ? allShop : [];
  } catch (error) {
    throw error;
  }
};

const update = async (userId, reqBody, userAvatarFile) => {
  try {
    const existsUser = await userModel.findOneByID(userId);
    if (!existsUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Your account is not exist");
    }
    if (!existsUser.isActive) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your account is not active"
      );
    }
    let updatedUser = {};
    //th1:change password
    if (reqBody.currentPassword && reqBody.newPassword) {
      if (
        !bcryptjs.compareSync(reqBody.currentPassword, existsUser?.password)
      ) {
        throw new ApiError(
          StatusCodes.NOT_ACCEPTABLE,
          "Vui lòng nhập chính xác mật khẩu cũ để đổi mới"
        );
      }
      updatedUser = await userModel.update(userId, {
        password: bcryptjs.hashSync(reqBody.newPassword, 8),
      });
    } else if (userAvatarFile) {
      //th2:change avatar, upload file len cloudinary
      const uploadResult = await cloudinaryProvider.streamUpload(
        userAvatarFile.buffer,
        "users"
      );
      updatedUser = await userModel.update(userId, {
        avatar: uploadResult.secure_url,
      });
    } else {
      //th3:change other fields
      updatedUser = await userModel.update(userId, reqBody);
    }
    let res = "";
    if (updatedUser?.role === "shop_owner") {
      res = await shopModel.getDetailShopByOwnerId(updatedUser?._id);
    }
    let result = { ...pickUser(updatedUser), shopId: res._id };
    return result;
  } catch (error) {
    throw error;
  }
};

const GetAllProduct = async () => {
  try {
    const allProductAvailable = await productModel.GetAllProduct();
    return allProductAvailable ? allProductAvailable : [];
  } catch (error) {
    throw error;
  }
};

const GetAllAccount = async () => {
  try {
    const allAccountAvailable = await userModel.GetAllAccount();
    return allAccountAvailable
      ? allAccountAvailable.map((item) => {
          delete item["password"];
          delete item["verifyToken"];
          delete item["online"];
          delete item["cartItem"];
          return item;
        })
      : [];
  } catch (error) {
    throw error;
  }
};

const createNew = async (reqBody) => {
  try {
    const existsUser = await userModel.findOneByEmail(reqBody.email);
    if (existsUser) {
      throw new ApiError(StatusCodes.CONFLICT, "Email is already exists");
    }

    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8),
      username: reqBody.username,
      address: reqBody.address,
      phoneNumber: reqBody.phoneNumber,
      role: USER_ROLES.CUSTOMER,
      isActive: true,
    };
    const createdUser = await userModel.createNew(newUser);
    const getUser = await userModel.findOneByID(createdUser.insertedId);

    return pickUser(getUser);
  } catch (error) {
    throw error;
  }
};

const search = async (queryFilter) => {
  try {
    const result = await userModel.search(queryFilter);
    return result;
  } catch (error) {
    throw error;
  }
};
const deleteAccount = async (id) => {
  try {
    const result = await userModel.deleteAccount(id);
    return result;
  } catch (error) {
    throw error;
  }
};
export const userServices = {
  login,
  register,
  verifyAccount,
  GetAllShop,
  update,
  refreshToken,
  GetAllProduct,
  GetAllAccount,
  createNew,
  search,
  deleteAccount,
};
