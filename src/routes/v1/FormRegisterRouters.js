import express from "express";
import { formRegisterController } from "~/controllers/formRegisterController";
import { formRegisterValidation } from "~/validations/formRegisterValidation";

const Router = express.Router();
Router.route("/")
  .post(formRegisterValidation.createNew, formRegisterController.createNew)
  .get(formRegisterController.findOneById);

export const formRegisterRouters = Router;
