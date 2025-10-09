import { createAuthClient } from "better-auth/react";
import { BASE_URL } from "./api";

export const auth = createAuthClient({
  baseURL: BASE_URL,
})