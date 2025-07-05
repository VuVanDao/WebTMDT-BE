import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";

const checkRole = (allowRoles) => async (req, res, next) => {
  try {
    const userRole = req.jwtDecoded.role;

    if (!userRole || !allowRoles.includes(userRole)) {
      res.status(StatusCodes.FORBIDDEN).json({
        message: "You are not allow to this endpoint",
      });
      return;
    }
    next();
  } catch (error) {
    //neu accessToken ko hop le: tra ve loi cho FE
    next(new ApiError(StatusCodes.UNAUTHORIZED, "unauthorized"));
  }
};
export const checkRoleMiddleware = {
  checkRole,
};
