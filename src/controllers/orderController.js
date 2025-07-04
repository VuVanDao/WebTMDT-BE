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
    if (!customerId) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing parameter" });
    }

    const result = await orderService.getAllOrder(
      statusOrder ? statusOrder : "All",
      customerId
    );
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
    if (!result.message) {
      res.status(StatusCodes.OK).json(result);
    } else {
      res.status(StatusCodes.CONFLICT).json(result);
    }
  } catch (error) {
    next(error);
  }
};
const deleteOrder = async (req, res, next) => {
  try {
    const orderId = req.query.orderId;
    if (!orderId) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Missing parameter" });
    }

    const result = await orderService.deleteOrder(orderId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getOrderByAdmin = async (req, res, next) => {
  try {
    const result = await orderService.getOrderByAdmin();
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const checkout = async (req, res, next) => {
  try {
    const result = await orderService.checkout(req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const findOneById = async (req, res, next) => {
  try {
    const id = req.query.id;
    const result = await orderService.findOneById(id);
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
  deleteOrder,
  getOrderByAdmin,
  checkout,
  findOneById,
};
