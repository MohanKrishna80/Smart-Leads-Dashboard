import { Download, LogOut, Moon, Pencil, Plus, RefreshCcw, Search, Sun, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { LeadModal } from "../components/LeadModal";
import { useAuth } from "../context/AuthContext";
import { useDebounce } from "../hooks/useDebounce";
import { api, type LeadFilters } from "../services/api";
import { exportLeadsToCsv } from "../utils/csv";
import { leadSources, leadStatuses, type Lead, type LeadInput, type PaginationMeta } from "../types/domain";

const defaultPagination: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false
};

const statusStyles: Record<Lead["status"], string> = {
  New: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  Contacted: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-200",
  Qualified: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200",
  Lost: "bg-red-50 text-coral dark:bg-red-950/40"
};

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(defaultPagination);
  const [filters, setFilters] = useState<LeadFilters>({ page: 1, status: "", source: "", search: "", sort: "latest" });
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [modalLead, setModalLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem("smart_leads_theme") === "dark");
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("smart_leads_theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    setFilters((current) => ({ ...current, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  const loadLeads = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await api.listLeads(filters);
      setLeads(result.leads);
      setPagination(result.pagination);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load leads.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadLeads();
  }, [filters]);

  const totalLeads = pagination.total;
  const qualifiedLeads = leads.filter((lead) => lead.status === "Qualified").length;
  const contactedLeads = leads.filter((lead) => lead.status === "Contacted").length;

  const saveLead = async (input: LeadInput) => {
    if (modalLead) {
      await api.updateLead(modalLead._id, input);
    } else {
      await api.createLead(input);
    }
    await loadLeads();
  };

  const removeLead = async (lead: Lead) => {
    await api.deleteLead(lead._id);
    await loadLeads();
  };

  return (
    <main className="min-h-screen bg-[#F5F7F8] text-ink dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <h1 className="text-xl font-black dark:text-white">Smart Leads</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.name} / {user?.role === "admin" ? "Admin" : "Sales User"}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setIsDark((current) => !current)} aria-label="Toggle dark mode">
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </Button>
            <Button variant="secondary" onClick={logout}>
              <LogOut size={17} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-6">
        <section className="grid gap-4 md:grid-cols-3">
          <Metric label="Total leads" value={totalLeads} tone="brand" />
          <Metric label="Qualified on page" value={qualifiedLeads} tone="gold" />
          <Metric label="Contacted on page" value={contactedLeads} tone="coral" />
        </section>

        <section className="mt-6 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-3 border-b border-slate-200 p-4 dark:border-slate-800 lg:grid-cols-[1fr_160px_160px_140px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                className="h-11 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                placeholder="Search name or email"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <FilterSelect value={filters.status} onChange={(value) => setFilters({ ...filters, status: value as LeadFilters["status"], page: 1 })} options={leadStatuses} placeholder="All statuses" />
            <FilterSelect value={filters.source} onChange={(value) => setFilters({ ...filters, source: value as LeadFilters["source"], page: 1 })} options={leadSources} placeholder="All sources" />
            <FilterSelect value={filters.sort} onChange={(value) => setFilters({ ...filters, sort: value as LeadFilters["sort"], page: 1 })} options={["latest", "oldest"]} placeholder="Sort" />
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => void loadLeads()} aria-label="Refresh leads">
                <RefreshCcw size={17} />
              </Button>
              <Button variant="secondary" onClick={() => exportLeadsToCsv(leads)} disabled={leads.length === 0}>
                <Download size={17} />
                CSV
              </Button>
              <Button onClick={() => { setModalLead(null); setIsModalOpen(true); }}>
                <Plus size={17} />
                Lead
              </Button>
            </div>
          </div>

          {error ? <div className="m-4 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-coral dark:bg-red-950/30">{error}</div> : null}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4" colSpan={5}>
                        <div className="h-9 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800" />
                      </td>
                    </tr>
                  ))
                ) : leads.length === 0 ? (
                  <tr>
                    <td className="px-4 py-12 text-center text-slate-500 dark:text-slate-400" colSpan={5}>
                      No leads match the current filters.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead._id} className="dark:text-slate-100">
                      <td className="px-4 py-4">
                        <div className="font-bold">{lead.name}</div>
                        <div className="text-slate-500 dark:text-slate-400">{lead.email}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${statusStyles[lead.status]}`}>{lead.status}</span>
                      </td>
                      <td className="px-4 py-4">{lead.source}</td>
                      <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(lead.createdAt))}</td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="secondary" onClick={() => { setModalLead(lead); setIsModalOpen(true); }} aria-label="Edit lead">
                            <Pencil size={16} />
                          </Button>
                          {user?.role === "admin" ? (
                            <Button variant="danger" onClick={() => void removeLead(lead)} aria-label="Delete lead">
                              <Trash2 size={16} />
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
            <span>
              Page {pagination.page} of {pagination.totalPages} / {pagination.total} total
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={!pagination.hasPreviousPage} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>
                Previous
              </Button>
              <Button variant="secondary" disabled={!pagination.hasNextPage} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>
                Next
              </Button>
            </div>
          </div>
        </section>
      </div>

      <LeadModal isOpen={isModalOpen} lead={modalLead} onClose={() => setIsModalOpen(false)} onSubmit={saveLead} />
    </main>
  );
};

const Metric = ({ label, value, tone }: { label: string; value: number; tone: "brand" | "gold" | "coral" }) => {
  const color = tone === "brand" ? "text-brand" : tone === "gold" ? "text-gold" : "text-coral";
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</div>
      <div className={`mt-2 text-3xl font-black ${color}`}>{value}</div>
    </div>
  );
};

const FilterSelect = ({
  value,
  onChange,
  options,
  placeholder
}: {
  value?: string;
  onChange(value: string): void;
  options: readonly string[];
  placeholder: string;
}) => (
  <select
    className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
    value={value}
    onChange={(event) => onChange(event.target.value)}
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option} value={option}>
        {option === "latest" ? "Latest" : option === "oldest" ? "Oldest" : option}
      </option>
    ))}
  </select>
);
