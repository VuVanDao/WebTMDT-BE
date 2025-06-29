import { StatusCodes } from "http-status-codes";
import { formRegisterModel } from "~/models/formRegisterModel";
import ApiError from "~/utils/ApiError";

const createNew = async (reqBody) => {
  try {
    const result = await formRegisterModel.createNew(reqBody);
    return result;
  } catch (error) {
    throw error;
  }
};
const findOneById = async (id) => {
  try {
    const result = await formRegisterModel.findOneById(id);
    return result;
  } catch (error) {
    throw error;
  }
};
export const formRegisterService = {
  createNew,
  findOneById,
};
