import express from "express";
import { notificationController } from "~/controllers/notificationController";

const Router = express.Router();
Router.route("/").post(notificationController.addNewNotification);
export const notificationRoutes = Router;
