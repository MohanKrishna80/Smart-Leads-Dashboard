import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required in .env");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required in .env");
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 5000),
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN ?? "http://localhost:5173"
};
