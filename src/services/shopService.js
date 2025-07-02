import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import { brandModel } from "~/models/brandsModel";
import { shopModel } from "~/models/shopModel";
import { userModel } from "~/models/userModel";
import { cloudinaryProvider } from "~/providers/cloudinaryProvider";
import { SHOP_STATUS_STATE, USER_ROLES } from "~/utils/constants";
import { v4 as uuidv4 } from "uuid";
import { nodemailerProvider } from "~/providers/nodemailerProvider";
import { env } from "~/config/environment";
import ApiError from "~/utils/ApiError";

const register = async (reqBody) => {
  try {
    const {
      name,
      email,
      address,
      phoneNumber,
      delivery_type,
      logo,
      ownerId,
      description,
    } = reqBody;
    const newOwnerId = new ObjectId(ownerId);
    const newShop = {
      name,
      email,
      address,
      phoneNumber,
      delivery_type,
      logo,
      ownerId: newOwnerId,
      description,
      verifyShopToken: uuidv4(),
    };
    const registeredShop = await shopModel.register(newShop);
    await userModel.update(ownerId, {
      sentForm: true,
    });

    return registeredShop;
  } catch (error) {
    throw error;
  }
};
const registerLogo = async (logoFile, id) => {
  try {
    const uploadResult = await cloudinaryProvider.streamUpload(
      logoFile.buffer,
      "logoShop"
    );

    let logoShop = {};
    if (uploadResult) {
      const getOwnerShop = await shopModel.getDetailShopByOwnerId(id);
      if (getOwnerShop) {
        logoShop = await shopModel.registerLogo(
          {
            logo: uploadResult.secure_url,
          },
          getOwnerShop?._id
        );
      }
    }
    return logoShop;
  } catch (error) {
    throw error;
  }
};
const getDetailShop = async (id) => {
  try {
    const detailShop = await shopModel.getDetailShop(id);
    if (detailShop && detailShop[0]?.shopBrand) {
      const res = await brandModel.findOneById(detailShop[0].shopBrand);
      if (res) {
        detailShop[0].shopBrand = res;
        return detailShop;
      }
    }
    return detailShop;
  } catch (error) {
    throw error;
  }
};
const getDetailShopByOwnerId = async (id) => {
  try {
    const detailShop = await shopModel.getDetailShopByOwnerId(id);
    return detailShop;
  } catch (error) {
    throw error;
  }
};
const browseShop = async (shopId, selection) => {
  try {
    const findShop = await shopModel.getDetailShop(shopId);
    if (!findShop) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Your shop is not exist");
    }
    if (findShop[0].status === SHOP_STATUS_STATE.ACCEPT) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your shop is already verified"
      );
    }

    const dataSelection = {
      status:
        selection === "accept"
          ? SHOP_STATUS_STATE.ACCEPT
          : SHOP_STATUS_STATE.DENIED,
    };
    const shopBrowsed = await shopModel.browseShop(shopId, dataSelection);

    const verificationLink = `${env.WEBSITE_DOMAIN_DEVELOPMENT}/account/upgradeToShopOwner?id=${shopBrowsed._id}&token=${shopBrowsed.verifyShopToken}`;
    nodemailerProvider.sendEmail(shopBrowsed.email, verificationLink);

    return shopBrowsed;
  } catch (error) {
    throw error;
  }
};
const verifyShop = async (reqBody) => {
  try {
    const existsShop = await shopModel.getDetailShop(reqBody.id);
    if (!existsShop) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Your shop is not exist");
    }
    if (reqBody.token !== existsShop[0].verifyShopToken) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "Token is invalid");
    }
    const updateData = {
      verifyShopToken: null,
    };
    const shopBrowsed = await shopModel.updateShop(reqBody.id, updateData);
    await userModel.update(existsShop[0]?.ownerId, {
      role: USER_ROLES.SHOP_OWNER,
    });

    return shopBrowsed;
  } catch (error) {
    throw error;
  }
};
const updateShop = async (shopId, shopData, shopLogo) => {
  try {
    let updatedShop = {};
    if (shopLogo) {
      const uploadResult = await cloudinaryProvider.streamUpload(
        shopLogo.buffer,
        "logoShop"
      );
      updatedShop = await shopModel.updateShop(shopId, {
        logo: uploadResult.secure_url,
      });
    } else {
      updatedShop = await shopModel.updateShop(shopId, shopData);
    }
    return updatedShop;
  } catch (error) {
    throw error;
  }
};
const getAllShop = async () => {
  try {
    const allShop = await shopModel.getAllShop();
    return allShop;
  } catch (error) {
    throw error;
  }
};
const deleteShop = async (id) => {
  try {
    const result = await shopModel.deleteShop(id);
    return result;
  } catch (error) {
    throw error;
  }
};
export const shopService = {
  register,
  getDetailShop,
  registerLogo,
  browseShop,
  updateShop,
  getAllShop,
  deleteShop,
  getDetailShopByOwnerId,
  verifyShop,
};
