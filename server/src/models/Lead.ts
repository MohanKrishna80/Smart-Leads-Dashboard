import mongoose, { Schema, type HydratedDocument } from "mongoose";
import { leadSources, leadStatuses, type LeadSource, type LeadStatus } from "../types/domain.js";

export interface ILead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type LeadDocument = HydratedDocument<ILead>;

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    status: { type: String, enum: leadStatuses, required: true, default: "New", index: true },
    source: { type: String, enum: leadSources, required: true, index: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

leadSchema.index({ name: "text", email: "text" });
leadSchema.index({ createdAt: -1 });

export const Lead = mongoose.model<ILead>("Lead", leadSchema);
