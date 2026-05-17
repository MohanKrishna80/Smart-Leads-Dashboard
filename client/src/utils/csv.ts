import type { Lead } from "../types/domain";

const escapeCell = (value: string): string => `"${value.replace(/"/g, '""')}"`;

export const exportLeadsToCsv = (leads: Lead[]): void => {
  const rows = [
    ["Name", "Email", "Status", "Source", "Created At"],
    ...leads.map((lead) => [
      lead.name,
      lead.email,
      lead.status,
      lead.source,
      new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(lead.createdAt))
    ])
  ];

  const csv = rows.map((row) => row.map(escapeCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `smart-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
