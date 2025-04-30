import express from "express";
import { productController } from "~/controllers/productController";
import { productValidation } from "~/validations/productValidation";
const Router = express.Router();
Router.route("/").post(
  productValidation.createNew,
  productController.createNew
);
export const productRouters = Router;
