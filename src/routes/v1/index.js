import express from "express";
import { productRouters } from "./productRoutes";
import { StatusCodes } from "http-status-codes";
import { userRouters } from "./userRoutes";
import { shopRouters } from "./shopRoutes";
import { orderRouters } from "./orderRoutes";
import { categoryRouters } from "./categoryRoutes";
import { notificationRoutes } from "./notificationRoutes";
import { brandRouters } from "./brandsRouters";
import { formRegisterRouters } from "./FormRegisterRouters";

//server -> router -> middleware -> validation -> controllers -> services -> model
const Router = express.Router();

//productAPI
Router.use("/products", productRouters);

//userAPI
Router.use("/users", userRouters);

//shopAPI
Router.use("/shops", shopRouters);

//orderAPI
Router.use("/orders", orderRouters);

//categoryAPI
Router.use("/categories", categoryRouters);

//cartAPI
Router.use("/notifications", notificationRoutes);

//brandAPI
Router.use("/brands", brandRouters);

//form_register_shop_API
Router.use("/form_register_shop", formRegisterRouters);
export const APIs_V1 = Router;
