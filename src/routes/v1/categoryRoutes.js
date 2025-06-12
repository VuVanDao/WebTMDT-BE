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
export const categoryRouters = Router;
