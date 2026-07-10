import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { phoneNumber } from "better-auth/plugins";
import { db } from "../../db";
import * as schema from "../../db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-google-client-secret",
    },
  },
  plugins: [
    phoneNumber({
      sendOTP: async (data, request) => {
        // Mock SMS logger for development
        console.log(`[SMS AUTH MOCK] Sending OTP code [${data.code}] to phone number [${data.phoneNumber}]`);
      },
    }),
  ],
});
