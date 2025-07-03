import { ObjectId } from "mongodb";
import { orderModel } from "~/models/orderModel";
import { productModel } from "~/models/productModel";
import { VnpayProvider } from "~/providers/VnpayProvider";
import { ORDER_INVITATION_STATUS } from "~/utils/constants";

const createNew = async (orderData) => {
  try {
    const { productId, customerId, shopId } = orderData;
    let newProductId = new ObjectId(productId);
    let newCustomerId = new ObjectId(customerId);
    const shopIdOwnerProduct = await productModel.findOneById(productId);
    const orderResult = await orderModel.createNew({
      ...orderData,
      shopId: new ObjectId(shopId),
      productId: newProductId,
      customerId: newCustomerId,
    });
    const result = await findOneById(orderResult?.insertedId);
    return result;
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
          updatedAt: Date.now(),
        },
        orderId
      );
    } else if (
      data?.status === ORDER_INVITATION_STATUS.DONE ||
      data?.status === ORDER_INVITATION_STATUS.REJECTED ||
      data?.status === ORDER_INVITATION_STATUS.ACCEPTED
    ) {
      if (data?.status === ORDER_INVITATION_STATUS.DONE) {
        //tim order duoc update voi status DONE
        let targetOrder = await orderModel.findOneById(orderId);
        //tim product co id la productId cua order
        let targetProduct = await productModel.findOneById(
          targetOrder?.productId
        );

        //tim categoryId trung voi category cua order
        let dataCategoryToUpdate = targetProduct[0]?.categoryId?.find(
          (item) => item?.name === targetOrder?.category
        );
        //cap nhat quantity cua categoryId trong product
        dataCategoryToUpdate.quantity -= targetOrder?.quantity;

        //cap nhat categoryId cua product
        targetProduct[0].categoryId = targetProduct[0]?.categoryId?.filter(
          (item) => item?.name !== targetOrder?.category
        );
        targetProduct[0].categoryId.push(dataCategoryToUpdate);

        //cap nhat product
        let updateQuantityProduct = await productModel.update(
          targetOrder?.productId,
          {
            categoryId: targetProduct[0]?.categoryId,
            sold: targetProduct[0]?.sold + targetOrder?.quantity,
            updatedAt: Date.now(),
          }
        );
        if (updateQuantityProduct)
          //cap nhat order
          ordersResult = await orderModel.update(
            { ...data, updatedAt: Date.now() },
            orderId
          );
      } else if (data?.status === ORDER_INVITATION_STATUS.REJECTED) {
        //tim order duoc update voi status REJECTED tu phia client gui len
        let targetOrder = await orderModel.findOneById(orderId);
        if (targetOrder?.status === ORDER_INVITATION_STATUS.ACCEPTED) {
          ordersResult = {
            message: "Đơn hàng đã được xác nhận bởi người bán, không thể huỷ",
          };
        } else {
          ordersResult = await orderModel.update(
            { ...data, updatedAt: Date.now() },
            orderId
          );
        }
      } else {
        //tim order duoc update voi status ACCEPTED tu phia client gui len
        let targetOrder = await orderModel.findOneById(orderId);
        if (targetOrder?.status === ORDER_INVITATION_STATUS.REJECTED) {
          ordersResult = {
            message: "Đơn hàng đã bị huỷ",
          };
        } else {
          ordersResult = await orderModel.update(
            { ...data, updatedAt: Date.now() },
            orderId
          );
        }
      }
    } else {
      ordersResult = await orderModel.update(
        { ...data, updatedAt: Date.now() },
        orderId
      );
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
const checkout = async (reqBody) => {
  try {
    const res = await VnpayProvider.handleCheckout(
      reqBody.price,
      reqBody.orderId
    );
    // const AllOrder = await orderModel.getOrderByAdmin();
    return res;
  } catch (error) {
    throw error;
  }
};
const findOneById = async (id) => {
  try {
    const result = await orderModel.findOneById(id);
    return result;
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
  checkout,
  findOneById,
};
