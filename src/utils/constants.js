export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/;
export const OBJECT_ID_RULE_MESSAGE =
  "Your string fails to match the Object Id pattern!";
export const EMAIL_RULE = /^\S+@\S+\.\S+$/;
export const EMAIL_RULE_MESSAGE = "Email is invalid. (example@vandaohehe.com)";
export const PHONE_RULE = /^0[0-9]{9}$/;
export const PHONE_RULE_MESSAGE = "Plz supply your phoneNumber";
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/;
export const PASSWORD_RULE_MESSAGE =
  "Password must include at least 1 letter, a number, and at least 8 characters.";
export const ORDER_INVITATION_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  DELIVERING: "DELIVERING",
  CANCELLED: "CANCELLED",
  DONE: "DONE",
  REFUND: "REFUND",
};
// export const PAYMENT_METHOD = {
//   CASH: "cash",
//   CREDIT_CARD: "CREDIT_CARD",
//   TRANSFER: "transfer",
// };
export const DELIVERY_TYPE = {
  FAST: "Vận chuyển nhanh",
  SUPER_FAST: "Hoả tốc",
};
export const WHITELIST_DOMAINS = [
  "http://localhost:5173",
  "https://web-tmdt-fe.vercel.app",
];
export const LIMIT_COMMON_FILE_SIZE = 10485760; // byte = 10 MB
export const ALLOW_COMMON_FILE_TYPES = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
];

export const SHOP_STATUS_STATE = {
  ACCEPT: "accept",
  DENIED: "denied",
  PENDING: "pending",
  CLOSED: "closed",
};
export const USER_ROLES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
  SHOP_OWNER: "shop_owner",
};
