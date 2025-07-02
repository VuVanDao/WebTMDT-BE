import express from "express";
import { shopController } from "~/controllers/shopController";
import { authMiddleware } from "~/middlewares/authMiddlware";
import { multerMiddleware } from "~/middlewares/multerMiddleware";
import { shopValidation } from "~/validations/shopValidation";

const Router = express.Router();
Router.route("/register_shop").post(
  authMiddleware.isAuthorized,
  shopValidation.register,
  shopController.register
);
Router.route("/register_shop_logo/:id").post(
  multerMiddleware.upload.single("logo"),
  shopController.registerLogo
);
Router.route("/browseShop").post(
  authMiddleware.isAuthorized,
  shopController.browseShop
);
Router.route("/verifyShop")
  .post(shopController.verifyShop)
  .delete(shopController.cancelRegisterShop);
Router.route("/get_detail_shop/:id").get(shopController.getDetailShop);
Router.route("/get_detail_shop_by_owner").get(
  shopController.getDetailShopByOwnerId
);
Router.route("/")
  .put(
    authMiddleware.isAuthorized,
    multerMiddleware.upload.single("logo"),
    shopController.updateShop
  )
  .get(authMiddleware.isAuthorized, shopController.getAllShop)
  .delete(authMiddleware.isAuthorized, shopController.deleteShop);
export const shopRouters = Router;
