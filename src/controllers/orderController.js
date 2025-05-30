import { StatusCodes } from "http-status-codes";
import { orderService } from "~/services/orderService";

const createNew = async (req, res, next) => {
  try {
    const orderData = { ...req.body };
    const result = await orderService.createNew(orderData);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getAllOrder = async (req, res, next) => {
  try {
    const statusOrder = req.query.statusOrder;
    const customerId = req.query.customerId;
    if (!statusOrder || !customerId) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing parameter" });
    }

    const result = await orderService.getAllOrder(statusOrder, customerId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getOrderByShopId = async (req, res, next) => {
  try {
    const shopId = req.query.id;

    if (!shopId) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing parameter" });
    }

    const result = await orderService.getOrderByShopId(shopId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const update = async (req, res, next) => {
  try {
    const data = req.body;
    const orderId = req.params.orderId;
    const result = await orderService.update(data, orderId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
export const orderController = {
  createNew,
  getAllOrder,
  getOrderByShopId,
  update,
};
