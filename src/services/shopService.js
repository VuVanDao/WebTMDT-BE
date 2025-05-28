import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import { shopModel } from "~/models/shopModel";
import { userModel } from "~/models/userModel";
import { cloudinaryProvider } from "~/providers/cloudinaryProvider";

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
    };
    const registeredShop = await shopModel.register(newShop);
    console.log("🚀 ~ register ~ registeredShop:", registeredShop);
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
    return detailShop;
  } catch (error) {
    throw error;
  }
};
const browseShop = async (shopId, selection) => {
  try {
    const dataSelection = {
      status: selection === "accept" ? true : "denied",
    };
    const shopBrowsed = await shopModel.browseShop(shopId, dataSelection);
    if (shopBrowsed) {
      await userModel.update(shopBrowsed?.ownerId, { role: "shop_owner" });
    }
    return shopBrowsed;
  } catch (error) {
    throw error;
  }
};

export const shopService = {
  register,
  getDetailShop,
  registerLogo,
  browseShop,
};
