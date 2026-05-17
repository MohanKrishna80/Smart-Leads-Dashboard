import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { authRouter } from "./routes/authRoutes.js";
import { leadRouter } from "./routes/leadRoutes.js";

export const app = express();

app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

app.use("/api/auth", authRouter);
app.use("/api/leads", leadRouter);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});
