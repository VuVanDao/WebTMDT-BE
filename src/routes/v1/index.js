import express from "express";
import { productRouters } from "./productRoutes";
import { StatusCodes } from "http-status-codes";

//server -> router -> middleware -> validation -> controllers -> services -> model
const Router = express.Router();

//productAPI
Router.use("/products", productRouters);
// Router.get("/products", (req, res) => {
//   res.status(StatusCodes.ACCEPTED).json({ message: "ok" });
// });
export const APIs_V1 = Router;
