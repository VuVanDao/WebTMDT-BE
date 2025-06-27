import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import { brandModel } from "~/models/brandsModel";
import { shopModel } from "~/models/shopModel";
import { userModel } from "~/models/userModel";
import { cloudinaryProvider } from "~/providers/cloudinaryProvider";
import { SHOP_STATUS_STATE, USER_ROLES } from "~/utils/constants";

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
    if (detailShop[0].shopBrand) {
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
const browseShop = async (shopId, selection) => {
  try {
    const dataSelection = {
      status:
        selection === "accept"
          ? SHOP_STATUS_STATE.ACCEPT
          : SHOP_STATUS_STATE.DENIED,
    };
    const shopBrowsed = await shopModel.browseShop(shopId, dataSelection);
    if (selection === "accept") {
      await userModel.update(shopBrowsed?.ownerId, {
        role: USER_ROLES.SHOP_OWNER,
      });
    }
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
};
