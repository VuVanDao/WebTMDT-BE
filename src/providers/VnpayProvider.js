import { env } from "~/config/environment";

const { StatusCodes } = require("http-status-codes");

import { v4 as uuidv4 } from "uuid";
import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } from "vnpay";

const handleCheckout = async (Price, orderId) => {
  try {
    const vnpay = new VNPay({
      tmnCode: env.tmnCode,
      secureSecret: env.secureSecret,
      vnpayHost: env.vnpayHost,
      testMode: true,
      hashAlgorithm: "SHA512",
      loggerFn: ignoreLogger,
    });
    const vnpayRes = await vnpay.buildPaymentUrl({
      vnp_Amount: Price,
      vnp_IpAddr: env.vnp_IpAddr,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderId,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: `${env.WEBSITE_DOMAIN_DEVELOPMENT}/checkoutOrder`,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      // vnp_ExpireDate:
    });
    return vnpayRes;
  } catch (error) {
    console.log("🚀 ~ app.post ~ error:", error);
    res.status(StatusCodes.BAD_GATEWAY).json({ error });
  }
};
export const VnpayProvider = {
  handleCheckout,
};
