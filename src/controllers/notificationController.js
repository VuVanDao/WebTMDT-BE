import { StatusCodes } from "http-status-codes";
import { notificationService } from "~/services/notificationService";

export const addNewNotification = async (req, res, next) => {
  try {
    const notificationData = req.body;
    const result = await notificationService.addNewNotification(
      notificationData
    );
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
export const getNotification = async (req, res, next) => {
  try {
    const result = await notificationService.getNotification(req.query.id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
export const deleteNotification = async (req, res, next) => {
  try {
    const notificationId = req.query.notificationId;
    const result = await notificationService.deleteNotification(notificationId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
export const notificationController = {
  addNewNotification,
  getNotification,
  deleteNotification,
};
