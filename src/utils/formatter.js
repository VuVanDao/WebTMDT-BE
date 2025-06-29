import { pick } from "lodash";

export const pickUser = (user) => {
  if (!user) return {};
  return pick(user, [
    "_id",
    "email",
    "username",
    "avatar",
    "role",
    "isActive",
    "online",
    "phoneNumber",
    "cartItem",
    "address",
    "sentForm",
    // "createdAt",
    // "updatedAt",
  ]);
};
