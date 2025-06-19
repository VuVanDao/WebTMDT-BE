import express from "express";
import { orderController } from "~/controllers/orderController";
import { authMiddleware } from "~/middlewares/authMiddlware";
import { orderValidation } from "~/validations/orderValidation";

const Router = express.Router();
Router.route("/")
  .post(
    authMiddleware.isAuthorized,
    orderValidation.createNew,
    orderController.createNew
  )
  .get(authMiddleware.isAuthorized, orderController.getAllOrder)
  .delete(authMiddleware.isAuthorized, orderController.deleteOrder);

Router.route("/get_by_shop_id").get(
  authMiddleware.isAuthorized,
  orderController.getOrderByShopId
);
Router.route("/update/:orderId").put(
  authMiddleware.isAuthorized,
  orderController.update
);
Router.route("/get_orders_by_admin").get(
  authMiddleware.isAuthorized,
  orderController.getOrderByAdmin
);
export const orderRouters = Router;
