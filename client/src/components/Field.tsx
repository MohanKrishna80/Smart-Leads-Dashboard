import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

interface FieldShellProps {
  label: string;
  error?: string;
  children: ReactNode;
}

const FieldShell = ({ label, error, children }: FieldShellProps) => (
  <label className="grid gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
    <span>{label}</span>
    {children}
    {error ? <span className="text-xs font-medium text-coral">{error}</span> : null}
  </label>
);

export const TextField = ({ label, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) => (
  <FieldShell label={label} error={error}>
    <input
      className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      {...props}
    />
  </FieldShell>
);

export const SelectField = ({
  label,
  error,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) => (
  <FieldShell label={label} error={error}>
    <select
      className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      {...props}
    >
      {children}
    </select>
  </FieldShell>
);
