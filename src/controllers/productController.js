import { StatusCodes } from "http-status-codes";

const createNew = async (req, res, next) => {
  try {
    console.log("🚀 ~ createNew ~ req:", req.body);
    console.log("🚀 ~ createNew ~ req.query:", req.query);
    console.log("🚀 ~ createNew ~ req.params:", req.params);
    res.status(StatusCodes.CREATED).json({ message: "complete" });
  } catch (error) {
    res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ error: new Error(error).message });
  }
};
export const productController = {
  createNew,
};
