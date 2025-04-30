import express from "express";

const Router = express.Router();
Router.route("/").post();
export const userRouters = Router;
