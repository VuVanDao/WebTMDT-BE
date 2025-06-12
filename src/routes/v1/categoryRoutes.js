import express from "express";
import { categoryController } from "~/controllers/categoryController";
import { categoryValidation } from "~/validations/categoryValidaiton";

const Router = express.Router();
Router.route("/")
  .post(
    categoryValidation.createNewCategory,
    categoryController.createNewCategory
  )
  .get(categoryController.getAllCategory);
Router.route("/search").get(categoryController.searchCategory);
export const categoryRouters = Router;
