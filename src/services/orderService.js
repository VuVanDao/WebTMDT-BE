import { orderModel } from "~/models/orderModel";
import { productModel } from "~/models/productModel";

const createNew = async (orderData) => {
  try {
    const { productId } = orderData;
    const shopIdOwnerProduct = await productModel.findOneById(productId);
    const orderResult = await orderModel.createNew({
      ...orderData,
      shopId: shopIdOwnerProduct.shopId,
    });
    return orderResult;
  } catch (error) {
    throw error;
  }
};
const getAllOrder = async (statusOrder, customerId) => {
  try {
    const orderResult = await orderModel.getAllOrder(statusOrder, customerId);
    return orderResult;
  } catch (error) {
    throw error;
  }
};

export const orderService = {
  createNew,
  getAllOrder,
};
