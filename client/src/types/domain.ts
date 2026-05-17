export const leadStatuses = ["New", "Contacted", "Qualified", "Lost"] as const;
export const leadSources = ["Website", "Instagram", "Referral"] as const;
export const userRoles = ["admin", "sales"] as const;

export type LeadStatus = (typeof leadStatuses)[number];
export type LeadSource = (typeof leadSources)[number];
export type UserRole = (typeof userRoles)[number];

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  updatedAt: string;
}

export interface LeadInput {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: PaginationMeta;
  message?: string;
}
