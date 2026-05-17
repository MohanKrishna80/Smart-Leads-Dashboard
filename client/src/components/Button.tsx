import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  children: ReactNode;
}

const variants = {
  primary: "bg-brand text-white hover:bg-[#0F5E59] focus:ring-brand",
  secondary: "bg-white text-ink border border-slate-200 hover:bg-slate-50 focus:ring-brand dark:bg-slate-900 dark:text-white dark:border-slate-700",
  danger: "bg-coral text-white hover:bg-[#C94E43] focus:ring-coral",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-brand dark:text-slate-200 dark:hover:bg-slate-800"
};

export const Button = ({ variant = "primary", className = "", children, ...props }: ButtonProps) => (
  <button
    className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-950 ${variants[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);
