import express from "express";
import { shopController } from "~/controllers/shopController";
import { shopValidation } from "~/validations/shopValidation";

const Router = express.Router();
Router.route("/register_shop").post(
  shopValidation.register,
  shopController.register
);
export const shopRouters = Router;
