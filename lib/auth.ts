import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "@/lib/prisma";

const trustedOrigins = Array.from(
  new Set(
    [
      "http://localhost:3000",
      "http://192.168.15.12:3000",
      "https://belezy.adelbr.tech",
      process.env.BETTER_AUTH_URL,
      process.env.NEXT_PUBLIC_BASE_URL,
    ].filter((origin): origin is string => Boolean(origin))
  )
);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",   
  }),
  user: {
    modelName: "UsersTable",
  },
  session: {
    modelName: "SessionsTable",
  },
  account: {
    modelName: "AccountsTable",
  },
  verification: {
    modelName: "VerificationsTable",
  },
  
  socialProviders: {
    google: {      
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  
  trustedOrigins,
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://belezy.adelbr.tech"
      : "http://localhost:3000"),
});
