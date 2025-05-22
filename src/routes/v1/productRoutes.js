import express from "express";
import { productController } from "~/controllers/productController";
import { multerMiddleware } from "~/middlewares/multerMiddleware";
import { productValidation } from "~/validations/productValidation";
const Router = express.Router();
Router.route("/create_new").post(
  productValidation.createNew,
  productController.createNew
);
Router.route("/add_image/:id").put(
  multerMiddleware.upload.array("imageProduct"),
  productController.addImage
);
Router.route("/get_All_Product/:id").get(productController.GetAllProduct);
export const productRouters = Router;
