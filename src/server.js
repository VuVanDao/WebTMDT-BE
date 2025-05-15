import express from "express";
import { CLOSE_DB, CONNECT_DB, GET_DB } from "./config/mongodb";
import exitHook from "async-exit-hook";
import "dotenv/config";
import cors from "cors";
import { env } from "./config/environment";
import { APIs_V1 } from "./routes/v1";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
import { corsOptions } from "./config/cors";
import "dotenv/config";

const START_SERVER = () => {
  const app = express();

  //enable req.body json data
  app.use(express.json());
  app.use(cors(corsOptions));

  app.use("/v1", APIs_V1);

  //middleware xu li loi tap chung, all error se chay vao day
  app.use(errorHandlingMiddleware);
  if (env.BUILD_MODE === "production") {
    //dung server.listen thay vi app.listen vi luc nay server da bao gom express app va socker.io
    app.listen(process.env.PORT, () => {
      console.log(
        `production 
        VanDaohehehe, I am running at ${process.env.PORT}`
      );
    });
  } else {
    app.listen(env.APP_PORT, () => {
      console.log(
        `Hello 
        VanDaohehehe, I am running at ${env.APP_HOST}:${env.APP_PORT}`
      );
    });
  }
};

//IIFE
(async () => {
  try {
    console.log("connecting to MongoDB server");
    await CONNECT_DB();
    console.log("connected to MongoDB server");
    START_SERVER();
  } catch (error) {
    console.log("🚀 ~ error:", error);
    process.exit(0);
  }
})();

exitHook(async () => {
  console.log("prepare to close sever and database");
  await CLOSE_DB().then(() => {
    console.log("close sever and database successfully");
  });
});
