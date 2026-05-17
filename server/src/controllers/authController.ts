import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { User, type UserDocument } from "../models/User.js";
import type { LoginInput, RegisterInput } from "../schemas/authSchemas.js";
import type { JwtPayload } from "../types/domain.js";

const createToken = (user: UserDocument): string => {
  const payload: JwtPayload = { userId: user.id, role: user.role };
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] };

  return jwt.sign(payload, env.JWT_SECRET, options);
};

const formatUser = (user: UserDocument) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const input = req.body as RegisterInput;
    const existingUser = await User.findOne({ email: input.email });

    if (existingUser) {
      res.status(409).json({ success: false, message: "Email is already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);
    const user = await User.create({ ...input, password: hashedPassword });

    res.status(201).json({
      success: true,
      data: {
        user: formatUser(user),
        token: createToken(user)
      }
    });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const input = req.body as LoginInput;
    const user = await User.findOne({ email: input.email }).select("+password");

    if (!user || !(await bcrypt.compare(input.password, user.password))) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: formatUser(user),
        token: createToken(user)
      }
    });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const me = (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Authentication is required" });
    return;
  }

  res.status(200).json({
    success: true,
    data: { user: req.user }
  });
};
