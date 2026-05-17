import type { NextFunction, Request, Response } from "express";
import { leadSources, leadStatuses, userRoles } from "../types/domain.js";

const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isObjectId = (value: string): boolean => /^[a-f\d]{24}$/i.test(value);

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, password, role = "sales" } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ success: false, message: "Name, email and password are required" });
    return;
  }

  if (String(name).trim().length < 2) {
    res.status(400).json({ success: false, message: "Name must be at least 2 characters" });
    return;
  }

  if (!isEmail(String(email))) {
    res.status(400).json({ success: false, message: "Please enter a valid email" });
    return;
  }

  if (String(password).length < 8) {
    res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    return;
  }

  if (!userRoles.includes(role)) {
    res.status(400).json({ success: false, message: "Invalid user role" });
    return;
  }

  req.body = {
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    password: String(password),
    role
  };

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: "Email and password are required" });
    return;
  }

  if (!isEmail(String(email))) {
    res.status(400).json({ success: false, message: "Please enter a valid email" });
    return;
  }

  req.body = {
    email: String(email).trim().toLowerCase(),
    password: String(password)
  };

  next();
};

export const validateLeadId = (req: Request, res: Response, next: NextFunction): void => {
  const id = req.params.id;

  if (typeof id !== "string" || !isObjectId(id)) {
    res.status(400).json({ success: false, message: "Invalid lead id" });
    return;
  }

  next();
};

export const validateCreateLead = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, status = "New", source } = req.body;

  if (!name || !email || !source) {
    res.status(400).json({ success: false, message: "Name, email and source are required" });
    return;
  }

  if (String(name).trim().length < 2) {
    res.status(400).json({ success: false, message: "Lead name must be at least 2 characters" });
    return;
  }

  if (!isEmail(String(email))) {
    res.status(400).json({ success: false, message: "Please enter a valid lead email" });
    return;
  }

  if (!leadStatuses.includes(status)) {
    res.status(400).json({ success: false, message: "Invalid lead status" });
    return;
  }

  if (!leadSources.includes(source)) {
    res.status(400).json({ success: false, message: "Invalid lead source" });
    return;
  }

  req.body = {
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    status,
    source
  };

  next();
};

export const validateUpdateLead = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, status, source } = req.body;

  if (!name && !email && !status && !source) {
    res.status(400).json({ success: false, message: "At least one field is required" });
    return;
  }

  if (name && String(name).trim().length < 2) {
    res.status(400).json({ success: false, message: "Lead name must be at least 2 characters" });
    return;
  }

  if (email && !isEmail(String(email))) {
    res.status(400).json({ success: false, message: "Please enter a valid lead email" });
    return;
  }

  if (status && !leadStatuses.includes(status)) {
    res.status(400).json({ success: false, message: "Invalid lead status" });
    return;
  }

  if (source && !leadSources.includes(source)) {
    res.status(400).json({ success: false, message: "Invalid lead source" });
    return;
  }

  req.body = {
    ...(name ? { name: String(name).trim() } : {}),
    ...(email ? { email: String(email).trim().toLowerCase() } : {}),
    ...(status ? { status } : {}),
    ...(source ? { source } : {})
  };

  next();
};

export const validateLeadFilters = (req: Request, res: Response, next: NextFunction): void => {
  const page = Number(req.query.page ?? 1);
  const status = req.query.status ? String(req.query.status) : undefined;
  const source = req.query.source ? String(req.query.source) : undefined;
  const search = req.query.search ? String(req.query.search).trim() : undefined;
  const sort = req.query.sort ? String(req.query.sort) : "latest";

  if (!Number.isInteger(page) || page < 1) {
    res.status(400).json({ success: false, message: "Page must be a positive number" });
    return;
  }

  if (status && !leadStatuses.includes(status as never)) {
    res.status(400).json({ success: false, message: "Invalid status filter" });
    return;
  }

  if (source && !leadSources.includes(source as never)) {
    res.status(400).json({ success: false, message: "Invalid source filter" });
    return;
  }

  if (sort !== "latest" && sort !== "oldest") {
    res.status(400).json({ success: false, message: "Invalid sort value" });
    return;
  }

  req.query = {
    page: String(page),
    ...(status ? { status } : {}),
    ...(source ? { source } : {}),
    ...(search ? { search } : {}),
    sort
  };

  next();
};
