/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from "express";
import { CONNECT_DB, GET_DB } from "./config/mongodb";

const START_SERVER = () => {
  const app = express();
  app.get("/", async (req, res) => {
    console.log(">>>", await GET_DB().listCollections().toArray());

    res.send("vuvandao");
  });
  const hostname = "localhost";
  const port = 8017;
  //ket noi toi mongodb server https://www.youtube.com/watch?v=BYpHB5LnRCQ&list=PLP6tw4Zpj-RIMgUPYxhLBVCpaBs94D73V&index=9

  app.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(
      `Hello Trung Quan Dev, I am running at http://${hostname}:${port}`
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

// CONNECT_DB()
//   .then(() => {
//     console.log("connected to MongoDB server");
//   })
//   .then(() => {
//     START_SERVER();
//   })
//   .catch((error) => {
//     console.log("error", error);
//     process.exit(0);
//   });
