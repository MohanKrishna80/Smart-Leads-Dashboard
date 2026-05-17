import type { Request, Response } from "express";
import type { FilterQuery } from "mongoose";
import { Lead, type ILead } from "../models/Lead.js";
import type { CreateLeadInput, ListLeadsQuery, UpdateLeadInput } from "../schemas/leadSchemas.js";

const PAGE_LIMIT = 10;

export const listLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query as unknown as ListLeadsQuery;
    const page = query.page;
    const skip = (page - 1) * PAGE_LIMIT;
    const filter: FilterQuery<ILead> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.source) {
      filter.source = query.source;
    }

    if (query.search) {
      const searchText = query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [{ name: { $regex: searchText, $options: "i" } }, { email: { $regex: searchText, $options: "i" } }];
    }

    const sortDirection = query.sort === "oldest" ? 1 : -1;
    const leads = await Lead.find(filter).sort({ createdAt: sortDirection }).skip(skip).limit(PAGE_LIMIT).lean();
    const total = await Lead.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(total / PAGE_LIMIT), 1);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        page,
        limit: PAGE_LIMIT,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication is required" });
      return;
    }

    const input = req.body as CreateLeadInput;
    const lead = await Lead.create({ ...input, owner: req.user.id });

    res.status(201).json({ success: true, data: lead });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).lean();

    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }

    res.status(200).json({ success: true, data: lead });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const input = req.body as UpdateLeadInput;
    const lead = await Lead.findByIdAndUpdate(req.params.id, input, {
      new: true,
      runValidators: true
    });

    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }

    res.status(200).json({ success: true, data: lead });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }

    res.status(200).json({ success: true, data: { id: lead.id } });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
