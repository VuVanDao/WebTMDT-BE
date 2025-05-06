import express from "express";
import { CLOSE_DB, CONNECT_DB, GET_DB } from "./config/mongodb";
import exitHook from "async-exit-hook";
import "dotenv/config";
import cors from "cors";
import { env } from "./config/environment";
import { APIs_V1 } from "./routes/v1";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
import { corsOptions } from "./config/cors";
const START_SERVER = () => {
  const app = express();

  //enable req.body json data
  app.use(express.json());
  app.use(cors(corsOptions));

  app.use("/v1", APIs_V1);

  //middleware xu li loi tap chung, all error se chay vao day
  app.use(errorHandlingMiddleware);
  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(
      `Hello VanDaoDev, I am running at http://${env.APP_HOST}:${env.APP_PORT}`
    );
  });
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
