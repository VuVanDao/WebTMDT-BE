import express from "express";
import { userController } from "~/controllers/userController";
import { authMiddleware } from "~/middlewares/authMiddlware";
import { multerMiddleware } from "~/middlewares/multerMiddleware";
import { userValidation } from "~/validations/userValidation";

const Router = express.Router();

//admin

Router.route("/getAllShops").get(
  authMiddleware.isAuthorized,
  userController.GetAllShop
);
Router.route("/get_all_accounts").get(
  authMiddleware.isAuthorized,
  userController.GetAllAccount
);
//token

Router.route("/refresh_token").post(userController.refreshToken);

Router.route("/register").post(
  userValidation.register,
  userController.register
);
Router.route("/")
  .post(userValidation.createNew, userController.createNew)
  .get(userController.search)
  .delete(userController.deleteAccount);

Router.route("/verify").put(
  userValidation.verifyAccount,
  userController.verifyAccount
);
Router.route("/login").post(userValidation.login, userController.login);
Router.route("/logout").delete(userController.logout);

Router.route("/update").put(
  authMiddleware.isAuthorized,
  multerMiddleware.upload.single("avatar"),
  userValidation.update,
  userController.update
);

Router.route("/get_All_Product").get(userController.GetAllProduct);

export const userRouters = Router;
