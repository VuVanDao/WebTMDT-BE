import express from "express";
import { userController } from "~/controllers/userController";
import { authMiddleware } from "~/middlewares/authMiddlware";
import { multerMiddleware } from "~/middlewares/multerMiddleware";
import { userValidation } from "~/validations/userValidation";

const Router = express.Router();

Router.route("/register").post(
  userValidation.register,
  userController.register
);

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

//admin
Router.route("/get_all_shop").get(userController.GetAllShop);

export const userRouters = Router;
