import express from "express";
import { notificationController } from "~/controllers/notificationController";

const Router = express.Router();
Router.route("/")
  .post(notificationController.addNewNotification)
  .get(notificationController.getNotification)
  .delete(notificationController.deleteNotification);
export const notificationRoutes = Router;
