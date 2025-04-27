import express from "express";
import { CLOSE_DB, CONNECT_DB, GET_DB } from "./config/mongodb";
import exitHook from "async-exit-hook";
import "dotenv/config";
import { env } from "./config/environment";
const START_SERVER = () => {
  const app = express();
  app.get("/", async (req, res) => {
    console.log(">>>", await GET_DB().listCollections().toArray());

    res.send("vuvandao");
  });

  //ket noi toi mongodb server https://www.youtube.com/watch?v=BYpHB5LnRCQ&list=PLP6tw4Zpj-RIMgUPYxhLBVCpaBs94D73V&index=9

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
