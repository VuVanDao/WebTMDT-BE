import express from "express";
import { productRouters } from "./productRoutes";
import { StatusCodes } from "http-status-codes";
import { userRouters } from "./userRoutes";
import { shopRouters } from "./shopRoutes";
import { orderRouters } from "./orderRoutes";
import { categoryRouters } from "./categoryRoutes";
import { cartRouters } from "./cartRoutes";

//server -> router -> middleware -> validation -> controllers -> services -> model
const Router = express.Router();

//productAPI
Router.use("/products", productRouters);

//userAPI
Router.use("/users", userRouters);

//shopAPI
Router.use("/users", shopRouters);

//orderAPI
Router.use("/users", orderRouters);

//categoryAPI
Router.use("/users", categoryRouters);

//cartAPI
Router.use("/users", cartRouters);
export const APIs_V1 = Router;
