import { AuthProvider, useAuth } from "./context/AuthContext";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";

const AppContent = () => {
  const { user, isBooting } = useAuth();

  if (isBooting) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F5F7F8] text-ink dark:bg-slate-950 dark:text-white">
        <div className="rounded-lg bg-white px-5 py-4 text-sm font-bold shadow-panel dark:bg-slate-900">Loading workspace</div>
      </main>
    );
  }

  return user ? <DashboardPage /> : <AuthPage />;
};

export const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);
