import { ObjectId } from "mongodb";
import { orderModel } from "~/models/orderModel";
import { productModel } from "~/models/productModel";

const createNew = async (orderData) => {
  try {
    const { productId, customerId } = orderData;
    let newProductId = new ObjectId(productId);
    let newCustomerId = new ObjectId(customerId);
    const shopIdOwnerProduct = await productModel.findOneById(productId);
    const orderResult = await orderModel.createNew({
      ...orderData,
      shopId: shopIdOwnerProduct.shopId,
      productId: newProductId,
      customerId: newCustomerId,
    });
    return orderResult;
  } catch (error) {
    throw error;
  }
};
const getAllOrder = async (statusOrder, customerId) => {
  try {
    const orderResult = await orderModel.getAllOrder(
      statusOrder,
      new ObjectId(customerId)
    );
    return orderResult;
  } catch (error) {
    throw error;
  }
};
const getOrderByShopId = async (shopId) => {
  try {
    const ordersResult = await orderModel.getOrderByShopId(shopId);
    return ordersResult;
  } catch (error) {
    throw error;
  }
};
const update = async (data, orderId) => {
  try {
    const ordersResult = await orderModel.update(data, orderId);
    return ordersResult;
  } catch (error) {
    throw error;
  }
};

export const orderService = {
  createNew,
  getAllOrder,
  getOrderByShopId,
  update,
};
