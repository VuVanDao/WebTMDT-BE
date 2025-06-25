import express from "express";
import { brandController } from "~/controllers/brandController";
import { authMiddleware } from "~/middlewares/authMiddlware";
import { brandValidation } from "~/validations/brandValidation";

const Router = express.Router();
Router.route("/").post(
  authMiddleware.isAuthorized,
  brandValidation.createNew,
  brandController.createNew
);

export const brandRouters = Router;
