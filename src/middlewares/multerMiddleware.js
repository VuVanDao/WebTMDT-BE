import multer from "multer";
import ApiError from "~/utils/ApiError";
import {
  ALLOW_COMMON_FILE_TYPES,
  LIMIT_COMMON_FILE_SIZE,
} from "~/utils/constants";
//function kiem tra dinh dang file
const customFilter = (req, file, callback) => {
  //doi voi multer kiem tra file bang mimetype
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errMessage = "File type is invalid. Only accept jpg, jpeg and png";
    return callback(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errMessage),
      null
    );
  }
  //neu nhu kieu file hop le
  return callback(null, true);
};

//function upload duoc boc boi multer
const upload = multer({
  limits: {
    //gioi han kich thuoc file
    fieldSize: LIMIT_COMMON_FILE_SIZE,
  },
  fileFilter: customFilter,
});
export const multerMiddleware = {
  upload,
};
