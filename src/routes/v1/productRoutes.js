import express from "express";
import { productController } from "~/controllers/productController";
import { authMiddleware } from "~/middlewares/authMiddlware";
import { multerMiddleware } from "~/middlewares/multerMiddleware";
import { productValidation } from "~/validations/productValidation";
const Router = express.Router();
Router.route("/create_new").post(
  authMiddleware.isAuthorized,
  productValidation.createNew,
  productController.createNew
);
Router.route("/add_image/:id").put(
  multerMiddleware.upload.array("imageProduct"),
  productController.addImage
);
Router.route("/get_All_Product/:id").get(productController.GetAllProduct);
Router.route("/get_Product_By_Id/:id").get(productController.getProductById);

Router.route("/update").put(
  // authMiddleware.isAuthorized,
  multerMiddleware.upload.array("imageProduct"),
  productValidation.update,
  productController.update
);

Router.route("/")
  .get(productController.searchProduct)
  .delete(authMiddleware.isAuthorized, productController.deleteProduct)
  .post(productController.findProduct);
export const productRouters = Router;
