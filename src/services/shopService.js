import { shopModel } from "~/models/shopModel";

const register = async (reqBody) => {
  try {
    const { name, email, address, phoneNumber, delivery_type, logo, ownerId } =
      reqBody;

    const newShop = {
      name,
      email,
      address,
      phoneNumber,
      delivery_type,
      logo,
      ownerId,
    };
    const registeredShop = await shopModel.register(newShop);
    console.log("🚀 ~ register ~ registeredShop:", registeredShop);
    return registeredShop;
  } catch (error) {
    throw error;
  }
};

export const shopService = {
  //   login,
  register,
  //   verifyAccount,
};
