import { useState } from "react";
import {
  LockKeyhole,
  UserPlus,
  LoaderCircle,
} from "lucide-react";

import { Button } from "../components/Button";
import { TextField, SelectField } from "../components/Field";
import { useAuth } from "../context/AuthContext";

export const AuthPage = () => {
  const { login, register } = useAuth();

  // states
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("sales");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // submit function
  const handleSubmit = async () => {
    setError("");

    // validation
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    if (!isLogin && !name) {
      setError("Please enter your name");
      return;
    }

    setLoading(true);

    try {
      // login
      if (isLogin) {
        await login(email, password);
      }

      // register
      else {
        await register({
          name,
          email,
          password,
          role,
        });
      }
    } catch (error) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#F4F7F6] dark:bg-slate-950">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-2">
        
        {/* Left Side */}
        <section>
          <div className="mb-6 flex items-center gap-2 rounded-md bg-brand/10 px-3 py-2 text-sm font-bold text-brand">
            <LockKeyhole size={18} />
            Secure lead operations
          </div>

          <h1 className="text-4xl font-bold dark:text-white">
            Smart Leads Dashboard
          </h1>

          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Manage leads, track opportunities and grow your sales faster.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-4 dark:bg-slate-900 dark:text-white">
              JWT Auth
            </div>

            <div className="rounded-lg bg-white p-4 dark:bg-slate-900 dark:text-white">
              RBAC
            </div>

            <div className="rounded-lg bg-white p-4 dark:bg-slate-900 dark:text-white">
              CSV Export
            </div>
          </div>
        </section>

        {/* Right Side */}
        <section className="rounded-lg bg-white p-6 shadow-lg dark:bg-slate-900">
          
          {/* Login/Register buttons */}
          <div className="mb-6 flex rounded-md bg-slate-100 p-1 dark:bg-slate-800">
            <button
              className={`w-full rounded-md p-2 ${
                isLogin
                  ? "bg-white dark:bg-slate-950 dark:text-white"
                  : ""
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>

            <button
              className={`w-full rounded-md p-2 ${
                !isLogin
                  ? "bg-white dark:bg-slate-950 dark:text-white"
                  : ""
              }`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            
            {!isLogin && (
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {!isLogin && (
              <SelectField
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="sales">Sales</option>
                <option value="admin">Admin</option>
              </SelectField>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="mt-4 text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Button */}
          <Button
            className="mt-6 w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
                Loading...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                {isLogin ? "Login" : "Register"}
              </>
            )}
          </Button>
        </section>
      </div>
    </main>
  );
};
