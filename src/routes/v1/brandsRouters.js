import express from "express";
import { brandController } from "~/controllers/brandController";
import { authMiddleware } from "~/middlewares/authMiddlware";
import { brandValidation } from "~/validations/brandValidation";

const Router = express.Router();
Router.route("/")
  .post(
    authMiddleware.isAuthorized,
    brandValidation.createNew,
    brandController.createNew
  )
  .get(authMiddleware.isAuthorized, brandController.getAllBrand);

Router.route("/find").get(brandController.findByAlphabet);

export const brandRouters = Router;
