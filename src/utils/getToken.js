import { google } from "googleapis";
import { env } from "~/config/environment";
const oAuth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.WEBSITE_DOMAIN_DEVELOPMENT // hoặc URI redirect bạn đăng ký
);

oAuth2Client.setCredentials({
  refresh_token: env.GOOGLE_REFRESH_TOKEN,
});

const getAccessToken = async () => {
  const accessToken = await oAuth2Client.getAccessToken();
  console.log("Access Token:", accessToken.token);
};
export const getToken = {
  getAccessToken,
};
