import { auth } from "./config";

export const getSession = async (headers: Headers) => {
  return await auth.api.getSession({
    headers,
  });
};
