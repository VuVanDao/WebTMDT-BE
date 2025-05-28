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
export const notificationController = {
  addNewNotification,
};
