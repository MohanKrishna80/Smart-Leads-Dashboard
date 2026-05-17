export const leadStatuses = ["New", "Contacted", "Qualified", "Lost"] as const;
export const leadSources = ["Website", "Instagram", "Referral"] as const;
export const userRoles = ["admin", "sales"] as const;

export type LeadStatus = (typeof leadStatuses)[number];
export type LeadSource = (typeof leadSources)[number];
export type UserRole = (typeof userRoles)[number];

export interface JwtPayload {
  userId: string;
  role: UserRole;
}
