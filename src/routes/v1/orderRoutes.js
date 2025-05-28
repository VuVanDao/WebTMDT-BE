import express from "express";
import { orderController } from "~/controllers/orderController";
import { orderValidation } from "~/validations/orderValidation";

const Router = express.Router();
Router.route("/").post(orderValidation.createNew, orderController.createNew);
Router.route("/").get(orderController.getAllOrder);
export const orderRouters = Router;
