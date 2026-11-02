
import { betterAuth } from "better-auth";
import {
  APIError,
  createAuthMiddleware,
} from "better-auth/api";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";

import { db } from "./mongo";

const baseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  appName: "BookNook",

  baseURL,

  secret: process.env.BETTER_AUTH_SECRET,

  database: mongodbAdapter(db),

  trustedOrigins: [
    baseURL,
    "http://localhost:3000",
  ],

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 6,
  },

  ...(googleClientId && googleClientSecret
    ? {
        socialProviders: {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        },
      }
    : {}),

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;

      const password = String(
        ctx.body?.password ?? ""
      );

      if (!/[A-Z]/.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message:
            "Password must include an uppercase letter.",
        });
      }

      if (!/[a-z]/.test(password)) {
        throw new APIError("BAD_REQUEST", {
          message:
            "Password must include a lowercase letter.",
        });
      }
    }),
  },

  plugins: [nextCookies()],
});
