import { LoaderCircle, LockKeyhole, UserPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/Button";
import { SelectField, TextField } from "../components/Field";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types/domain";

export const AuthPage = () => {
  const { login, register } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("sales");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    setError("");

    if (
      !email.trim() ||
      !password.trim() ||
      (mode === "register" && !name.trim())
    ) {
      setError("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register({ name, email, password, role });
      }
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Authentication failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F7F6] text-ink dark:bg-slate-950">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[1fr_440px]">
        <section>
          <div className="mb-6 inline-flex items-center gap-2 rounded-md bg-brand/10 px-3 py-2 text-sm font-bold text-brand dark:bg-brand/20 dark:text-teal-200">
            <LockKeyhole size={17} />
            Secure lead operations
          </div>

          <h1 className="max-w-2xl text-4xl font-black leading-tight text-ink dark:text-white sm:text-5xl">
            Smart Leads Dashboard
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            A focused workspace for sales teams to capture leads, track
            qualification, filter opportunities, and move quickly from inquiry
            to action.
          </p>

          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {["JWT Auth", "RBAC", "CSV Export"].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-slate-200 bg-white p-4 text-sm font-bold dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg bg-white p-6 shadow-panel dark:bg-slate-900">
          <div className="mb-6 flex rounded-md bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              className={`h-10 flex-1 rounded-md text-sm font-bold ${
                mode === "login"
                  ? "bg-white shadow-sm dark:bg-slate-950 dark:text-white"
                  : "text-slate-500"
              }`}
              onClick={() => setMode("login")}
            >
              Login
            </button>

            <button
              type="button"
              className={`h-10 flex-1 rounded-md text-sm font-bold ${
                mode === "register"
                  ? "bg-white shadow-sm dark:bg-slate-950 dark:text-white"
                  : "text-slate-500"
              }`}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          <div className="grid gap-4">
            {mode === "register" ? (
              <TextField
                label="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            ) : null}

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            {mode === "register" ? (
              <SelectField
                label="Role"
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
              >
                <option value="sales">Sales User</option>
                <option value="admin">Admin</option>
              </SelectField>
            ) : null}
          </div>

          {error ? (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-coral dark:bg-red-950/30">
              {error}
            </p>
          ) : null}

          <Button
            type="button"
            className="mt-6 w-full"
            onClick={submit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
                Please wait...
              </>
            ) : (
              <>
                <UserPlus size={17} />
                {mode === "login" ? "Login" : "Create account"}
              </>
            )}
          </Button>
        </section>
      </div>
    </main>
  );
};
