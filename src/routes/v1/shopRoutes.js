import express from "express";
import { shopController } from "~/controllers/shopController";
import { multerMiddleware } from "~/middlewares/multerMiddleware";
import { shopValidation } from "~/validations/shopValidation";

const Router = express.Router();
Router.route("/register_shop").post(
  shopValidation.register,
  shopController.register
);
Router.route("/register_shop_logo/:id").post(
  multerMiddleware.upload.single("logo"),
  shopController.registerLogo
);
Router.route("/get_detail_shop/:id").get(
  shopValidation.getDetailShop,
  shopController.getDetailShop
);
export const shopRouters = Router;
