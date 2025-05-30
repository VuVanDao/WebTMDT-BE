import express from "express";
import { orderController } from "~/controllers/orderController";
import { orderValidation } from "~/validations/orderValidation";

const Router = express.Router();
Router.route("/").post(orderValidation.createNew, orderController.createNew);
Router.route("/").get(orderController.getAllOrder);
Router.route("/get_by_shop_id").get(orderController.getOrderByShopId);
Router.route("/update/:orderId").put(orderController.update);
export const orderRouters = Router;
