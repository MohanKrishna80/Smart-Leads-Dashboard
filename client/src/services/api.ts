import type { ApiResponse, Lead, LeadInput, LeadSource, LeadStatus, PaginationMeta, User, UserRole } from "../types/domain";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://smart-leads-dashboard-backend-7z07.onrender.com/api";
const TOKEN_KEY = "smart_leads_token";

export interface AuthPayload {
  user: User;
  token: string;
}

export interface LeadFilters {
  page: number;
  status?: LeadStatus | "";
  source?: LeadSource | "";
  search?: string;
  sort: "latest" | "oldest";
}

export interface LeadListResult {
  leads: Lead[];
  pagination: PaginationMeta;
}

export const tokenStore = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY)
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const token = tokenStore.get();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    throw new Error(payload.message ?? "Request failed");
  }

  return payload.data;
};

export const api = {
  register: (body: { name: string; email: string; password: string; role: UserRole }) =>
    request<AuthPayload>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request<AuthPayload>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request<{ user: User }>("/auth/me"),
  listLeads: async (filters: LeadFilters): Promise<LeadListResult> => {
    const params = new URLSearchParams({ page: String(filters.page), sort: filters.sort });
    if (filters.status) params.set("status", filters.status);
    if (filters.source) params.set("source", filters.source);
    if (filters.search) params.set("search", filters.search);

    const token = tokenStore.get();
    const response = await fetch(`${API_BASE_URL}/leads?${params.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const payload = (await response.json()) as ApiResponse<Lead[]>;

    if (!response.ok || !payload.pagination) {
      throw new Error(payload.message ?? "Unable to load leads");
    }

    return { leads: payload.data, pagination: payload.pagination };
  },
  createLead: (body: LeadInput) => request<Lead>("/leads", { method: "POST", body: JSON.stringify(body) }),
  updateLead: (id: string, body: Partial<LeadInput>) =>
    request<Lead>(`/leads/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteLead: (id: string) => request<{ id: string }>(`/leads/${id}`, { method: "DELETE" })
};
