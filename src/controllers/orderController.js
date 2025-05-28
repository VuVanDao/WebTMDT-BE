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
export const orderController = {
  createNew,
  getAllOrder,
};
