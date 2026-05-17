import type { LeadSource, LeadStatus } from "../types/domain.js";

export interface CreateLeadInput {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export type UpdateLeadInput = Partial<CreateLeadInput>;

export interface ListLeadsQuery {
  page: number;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort: "latest" | "oldest";
}
