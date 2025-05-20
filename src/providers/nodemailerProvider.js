import nodemailer from "nodemailer";
import { env } from "~/config/environment";
import { getToken } from "~/utils/getToken";
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     type: "OAuth2",
//     user: "dao28901@gmail.com", // Gmail bạn dùng gửi
//     clientId: env.GOOGLE_CLIENT_ID,
//     clientSecret: env.GOOGLE_CLIENT_SECRET,
//     refreshToken: env.GOOGLE_REFRESH_TOKEN,
//     accessToken: getToken.getAccessToken, // (tùy chọn, Nodemailer sẽ tự tạo lại nếu có refresh_token)
//   },
// });
const transporter = nodemailer.createTransport({
  service: "gmail", // hoặc SMTP riêng của bạn
  port: 587,
  secure: false,
  auth: {
    user: "dao28901@gmail.com",
    pass: "zeyi qrvv fxdn stlv", // Với Gmail, bạn cần dùng "App password"
  },
});
const sendEmail = (receiverEmail, verifyToken) => {
  const verificationLink = `${env.WEBSITE_DOMAIN_DEVELOPMENT}/account/verification?email=${receiverEmail}&token=${verifyToken}`;
  const mailOptions = {
    from: "dao28905@gmail.com",
    to: receiverEmail,
    subject: "plz verify your email before using our services",
    text: `
    <h3>Here is your verification link</h3>
    <h3>${verificationLink}</h3> 
    <h3>From Admin: Van Dao</h3>
    `,
  };
  console.log("10");

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.error("Gửi thất bại:", err);
    }
    console.log("Đã gửi:", info.response);
  });
};
export const nodemailerProvider = {
  sendEmail,
};
