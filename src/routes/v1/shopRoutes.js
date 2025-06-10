import express from "express";
import { shopController } from "~/controllers/shopController";
import { authMiddleware } from "~/middlewares/authMiddlware";
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
Router.route("/browseShop").post(shopController.browseShop);
Router.route("/get_detail_shop/:id").get(shopController.getDetailShop);
Router.route("/")
  .put(
    authMiddleware.isAuthorized,
    multerMiddleware.upload.single("logo"),
    shopController.updateShop
  )
  .get(shopController.getAllShop);
export const shopRouters = Router;
