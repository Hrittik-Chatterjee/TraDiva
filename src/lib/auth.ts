import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { phoneNumber } from "better-auth/plugins";
import { db } from "../../db";
import * as schema from "../../db/schema";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          console.log(`[Better Auth Hook] New user created: ${user.email} (${user.id}). Merging guest orders...`);
          try {
            await db
              .update(schema.orders)
              .set({
                userId: user.id,
                guestEmail: null,
                updatedAt: new Date(),
              })
              .where(eq(schema.orders.guestEmail, user.email));
            console.log(`[Better Auth Hook] Merged guest orders successfully for ${user.email}.`);
          } catch (err) {
            console.error(`[Better Auth Hook] Failed to merge guest orders for ${user.email}:`, err);
          }
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false, // Client cannot manually set role during signup
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-google-client-secret",
    },
  },
  plugins: [
    phoneNumber({
      sendOTP: async (data) => {
        // Mock SMS logger for development
        console.log(`[SMS AUTH MOCK] Sending OTP code [${data.code}] to phone number [${data.phoneNumber}]`);
      },
    }),
  ],
});
