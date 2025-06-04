import express from "express";
import { CLOSE_DB, CONNECT_DB, GET_DB } from "./config/mongodb";
import exitHook from "async-exit-hook";
import "dotenv/config";
import cors from "cors";
import { env } from "./config/environment";
import { APIs_V1 } from "./routes/v1";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
import { corsOptions } from "./config/cors";
import cookieParser from "cookie-parser";

//socket.io
import socketIo from "socket.io";
import http from "http";

const START_SERVER = () => {
  const app = express();

  app.use(cookieParser());

  //enable req.body json data
  app.use(express.json());

  //xu li cors
  app.use(cors(corsOptions));

  app.use("/v1", APIs_V1);

  //middleware xu li loi tap chung, all error se chay vao day
  app.use(errorHandlingMiddleware);

  //config socket
  const server = http.createServer(app);
  //khoi tao bien io voi server va cors
  const io = socketIo(server, { cors: corsOptions });
  io.on("connection", (socket) => {
    //lang nghe su kien emit tu client (place_an_order)
    socket.on("user_place_an_order_fe", (dataToEmit) => {
      // console.log("🚀 ~ socket.on ~ dataToEmit:", dataToEmit);
      // socket.broadcast.emit("shop_accept_an_order", dataToEmit); // ko gui cho user emit len ma gui cho cac user khac
      socket.broadcast.emit(
        `user_place_an_order_be_${dataToEmit?.shopId}`,
        dataToEmit
      );
    });
    socket.on("notification_place_order_from_fe", (dataToEmit) => {
      socket.emit(
        `notification_place_order_from_be_${dataToEmit?.customerId}`,
        dataToEmit
      );
    });
  });

  if (env.BUILD_MODE === "production") {
    //dung server.listen thay vi app.listen vi luc nay server da bao gom express app va socker.io
    server.listen(process.env.PORT, () => {
      console.log(
        `production 
        VanDaohehehe, I am running at ${process.env.PORT}`
      );
    });
  } else {
    server.listen(env.APP_PORT, () => {
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
