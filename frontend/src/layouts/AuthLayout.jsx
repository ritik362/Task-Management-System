import { CheckCircle2 } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-950 dark:text-white">
      <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
        <section className="hidden bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <Link to="/" className="text-xl font-bold tracking-normal">
            TaskFlow
          </Link>
          <div className="max-w-lg">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-300">
              Stay organized
            </p>
            <h1 className="mt-4 text-5xl font-bold leading-tight tracking-normal">
              Manage work with clarity and momentum.
            </h1>
            <div className="mt-8 space-y-4 text-slate-300">
              {["Secure JWT authentication", "Private dashboard access", "Fast task workflows"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-teal-300" />
                    <span>{item}</span>
                  </div>
                )
              )}
            </div>
          </div>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Built with React, Express, MongoDB, and JWT.
          </p>
        </section>
        <section className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link to="/" className="text-xl font-bold tracking-normal text-slate-950 dark:text-white">
                TaskFlow
              </Link>
            </div>
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;
