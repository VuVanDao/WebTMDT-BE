import { userModel } from "~/models/userModel";
import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { env } from "~/config/environment";
import { BrevoProvider } from "~/providers/brevoProvider";
import { pickUser } from "~/utils/formatter";
import { v4 as uuidv4 } from "uuid";
import ApiError from "~/utils/ApiError";

const register = async (reqBody) => {
  try {
    const existsUser = await userModel.findOneByEmail(reqBody.email);
    if (existsUser) {
      throw new Error(StatusCodes.CONFLICT, "Email is already exists");
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
    const customSubject = "plz verify your email before using our services";
    const htmlContent = `
    <h3>Here is your verification link</h3>
    <h3>${verificationLink}</h3> 
    <h3>From Admin: Van Dao</h3>
    `;
    await BrevoProvider.sendEmail(getUser.email, customSubject, htmlContent);

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

    // tao token tra ve phia fe
    //tao thong tin de dinh kem trong jwt: _id va email cua user
    // const userInfo = {
    //   _id: existsUser._id,
    //   email: existsUser.email,
    //   role: existsUser.role,
    //   address: existsUser.address,
    //   phoneNumber: existsUser.phoneNumber,
    //   avatar: existsUser.avatar,
    //   online: existsUser.online,
    // };

    // return { accessToken, refreshToken, ...pickUser(existsUser) };
    return { ...pickUser(existsUser) };
  } catch (error) {
    throw error;
  }
};
export const userServices = {
  login,
  register,
  verifyAccount,
};
