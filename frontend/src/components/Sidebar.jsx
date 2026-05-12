import { LayoutDashboard, ListChecks, UserCircle2, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const getNavClassName = ({ isActive }) =>
  isActive
    ? "bg-teal-50 dark:bg-teal-900/30 text-slate-950 dark:text-white"
    : "text-slate-300 hover:bg-white/5 hover:text-white";

export const SidebarContent = ({ onNavigate }) => {
  const items = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { label: "Tasks", icon: ListChecks, to: "/tasks" },
    { label: "Profile", icon: UserCircle2, to: "/profile" }
  ];

  return (
    <div className="flex h-full flex-col bg-slate-950 text-white">
      <div className="border-b border-white/5 dark:border-slate-800 px-5 py-5">
        <p className="text-xl font-bold tracking-normal">TaskFlow</p>
        <p className="mt-1 text-sm text-slate-400">Task Management System</p>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition ${getNavClassName({ isActive })}`
              }
              end={item.to === "/dashboard"}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="border-t border-white/5 dark:border-slate-800 px-5 py-5 text-sm text-slate-400">
        Secure workspace
      </div>
    </div>
  );
};

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
        <SidebarContent />
      </aside>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/80"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close navigation overlay"
            tabIndex={-1}
          />
          {/* Sidebar */}
          <div className="relative h-full w-72 shadow-xl bg-slate-950 text-white z-50">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-lg p-2 text-slate-300 transition hover:bg-white dark:bg-slate-800/10 hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onNavigate={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
