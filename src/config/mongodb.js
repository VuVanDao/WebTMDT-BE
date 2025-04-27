/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
//IWnF1VI5Lwmsm4H3
const mongoDBUri = env.MONGODB_URI;
const databaseName = env.DATABASE_NAME;

import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "./environment";

//khoi tao doi tuong webShopDatabaseInstance ban dau la null (vi cung ta chua connect)
let webShopDatabaseInstance = null;

//khoi tao doi tuong mongoClientInstance de ket noi toi MongoDB
const mongoClientInstance = new MongoClient(mongoDBUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//ket noi toi database
export const CONNECT_DB = async () => {
  //ket noi toi MongoDB Atlas voi URI da khai bao trong than cua clientInstance
  await mongoClientInstance.connect();

  //ket noi thanh cong thi lay database theo ten va gan nguoc lai vao webShopDatabaseInstance o tren
  webShopDatabaseInstance = mongoClientInstance.db(databaseName);
};

//GET_DB (khong async) co nhiem vu export ra webShopDatabaseInstance sau khi connect thanh cong toi MongoDB de su dung nhieu noi khac nhau
//phai dam bao chi goi GET_DB sau khi ket noi thanh cong toi MongoDB
export const GET_DB = () => {
  if (!webShopDatabaseInstance) {
    throw new Error("Must connect to database first");
  }
  return webShopDatabaseInstance;
};

//dong ken noi khi can
export const CLOSE_DB = async () => {
  //ket noi toi MongoDB Atlas voi URI da khai bao trong than cua clientInstance
  await mongoClientInstance.close();
};
