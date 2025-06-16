import { ObjectId } from "mongodb";
import { orderModel } from "~/models/orderModel";
import { productModel } from "~/models/productModel";

const createNew = async (orderData) => {
  try {
    const { productId, customerId, shopId } = orderData;
    console.log("🚀 ~ createNew ~ orderData:", orderData);
    let newProductId = new ObjectId(productId);
    let newCustomerId = new ObjectId(customerId);
    const shopIdOwnerProduct = await productModel.findOneById(productId);
    const orderResult = await orderModel.createNew({
      ...orderData,
      shopId: new ObjectId(shopId),
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
    const existsOrder = await orderModel.findOneById(orderId);
    let ordersResult = "";
    if (data?.commentToAdd) {
      ordersResult = await orderModel.update(
        {
          comments:
            existsOrder.comments?.length >= 1
              ? [
                  ...existsOrder.comments,
                  { ...data?.commentToAdd, commentAt: Date.now() },
                ]
              : [{ ...data?.commentToAdd, commentAt: Date.now() }],
        },
        orderId
      );
    } else {
      ordersResult = await orderModel.update(data, orderId);
    }
    return ordersResult;
  } catch (error) {
    throw error;
  }
};
const deleteOrder = async (orderId) => {
  try {
    const ordersResult = await orderModel.deleteOrder(orderId);
    return ordersResult;
  } catch (error) {
    throw error;
  }
};
const getOrderByAdmin = async () => {
  try {
    const AllOrder = await orderModel.getOrderByAdmin();
    return AllOrder;
  } catch (error) {
    throw error;
  }
};
export const orderService = {
  createNew,
  getAllOrder,
  getOrderByShopId,
  update,
  deleteOrder,
  getOrderByAdmin,
};
