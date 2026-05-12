import {
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  ListChecks,
  ListTodo,
  LogOut,
  Menu,
  Search,
  UserCircle2,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  updateTaskStatus
} from "../api/taskApi.js";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal.jsx";
import EditTaskModal from "../components/EditTaskModal.jsx";
import TaskForm from "../components/TaskForm.jsx";
import TaskList from "../components/TaskList.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { formatDueDate } from "../utils/taskUtils.js";
import { getAvatarUrl } from "../utils/avatarUtils.js";

const StatCard = ({ accent, icon: Icon, label, value }) => (
  <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <p className="mt-4 text-3xl font-bold tracking-normal text-slate-950 dark:text-white">{value}</p>
  </div>
);
const DashboardPage = () => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const stats = useMemo(() => {
    if (pagination.total !== undefined) {
      return {
        total: pagination.total,
        completed: pagination.completed,
        pending: pagination.pending
      };
    }
    return { total: 0, completed: 0, pending: 0 };
  }, [pagination]);

  const recentTasks = useMemo(() => tasks.slice(0, 5), [tasks]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 350);

    return () => clearTimeout(t);
  }, [searchQuery]);

  const filteredTasks = useMemo(() => {
    if (!debouncedQuery) return tasks;

    const q = debouncedQuery.toLowerCase();

    return tasks.filter((task) => {
      const title = (task.title || "").toLowerCase();
      const description = (task.description || "").toLowerCase();
      const status = (task.status || "").toLowerCase();

      return title.includes(q) || description.includes(q) || status.includes(q);
    });
  }, [debouncedQuery, tasks]);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const data = await getTasks(page, 10);
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [page]);


  const handleCreateTask = async (payload) => {
    setIsCreating(true);
    try {
      const data = await createTask(payload);
      setTasks((current) => [data.task, ...current]);
      await loadTasks(); // Update stats and pagination
      toast.success("Task created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateTask = async (taskId, payload) => {
    setIsMutating(true);
    try {
      const data = await updateTask(taskId, payload);
      setTasks((current) =>
        current.map((task) => (task._id === taskId ? data.task : task))
      );
      setEditingTask(null);
      toast.success("Task updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
      throw error;
    } finally {
      setIsMutating(false);
    }
  };

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";

    setIsMutating(true);
    try {
      const data = await updateTaskStatus(task._id, nextStatus);
      setTasks((current) =>
        current.map((currentTask) =>
          currentTask._id === task._id ? data.task : currentTask
        )
      );
      await loadTasks(); // Update stats
      toast.success("Task status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    setIsMutating(true);
    try {
      await deleteTask(taskId);
      setTasks((current) => current.filter((task) => task._id !== taskId));
      setDeletingTask(null);
      await loadTasks(); // Update stats
      toast.success("Task deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task");
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-950 dark:text-white">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/95 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-lg border border-slate-300 dark:border-slate-600 p-2 text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:bg-slate-700 lg:hidden"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-400">
                  Dashboard
                </p>
                <h1 className="truncate text-xl font-bold tracking-normal">
                  Welcome, {user?.name || "User"}
                </h1>
              </div>

            </div>
            <div className="hidden min-w-72 items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-500 dark:text-slate-400 md:flex">
              <Search className="h-4 w-4" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks (title, description, status)"
                className="w-full bg-transparent text-sm outline-none"
                aria-label="Search tasks"
              />
            </div>


            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:bg-slate-700 dark:hover:bg-slate-800"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700">
                <img 
                  src={getAvatarUrl(user?.avatar)} 
                  alt="Avatar" 
                  className="h-full w-full object-cover"
                />
              </div>
              <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:bg-slate-700 sm:px-4"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
            </div>
          </div>
        </header>

        <section className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-normal text-slate-950 dark:text-white">
                My tasks
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Track current work, review recent tasks, and manage your queue.
              </p>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              accent="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400"
              icon={ListTodo}
              label="Total tasks"
              value={stats.total}
            />
            <StatCard
              accent="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
              icon={CheckCircle2}
              label="Completed tasks"
              value={stats.completed}
            />
            <StatCard
              accent="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
              icon={Clock3}
              label="Pending tasks"
              value={stats.pending}
            />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <TaskForm isSubmitting={isCreating} onSubmit={handleCreateTask} />
              <TaskList
                isLoading={isLoading}
                onDelete={setDeletingTask}
                onEdit={setEditingTask}
                onToggleStatus={handleToggleStatus}
                tasks={filteredTasks}
              />

              {!isLoading && filteredTasks.length === 0 && (
                <p className="rounded-lg bg-slate-50 dark:bg-slate-900 p-4 text-sm text-slate-600 dark:text-slate-400">
                  No tasks found
                </p>
              )}

            </div>

            <aside className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-400">
                    Recent
                  </p>
                  <h3 className="mt-1 text-xl font-bold tracking-normal text-slate-950 dark:text-white">
                    Recent tasks
                  </h3>
                </div>
                <ListChecks className="h-5 w-5 text-slate-400" />
              </div>
              <div className="mt-5 space-y-3">
                {isLoading ? (
                  <p className="rounded-lg bg-slate-50 dark:bg-slate-900 p-4 text-sm text-slate-600 dark:text-slate-400">
                    Loading recent tasks...
                  </p>
                ) : recentTasks.length ? (
                  recentTasks.map((task) => (
                    <div
                      key={task._id}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-semibold text-slate-950 dark:text-white">{task.title}</p>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                            task.status === "completed"
                              ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                              : "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Due {formatDueDate(task.dueDate)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-lg bg-slate-50 dark:bg-slate-900 p-4 text-sm text-slate-600 dark:text-slate-400">
                    No recent tasks yet.
                  </p>
                )}
              </div>
            </aside>
          </div>
        </section>
      </div>
      <EditTaskModal
        isOpen={Boolean(editingTask)}
        isSubmitting={isMutating}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdateTask}
        task={editingTask}
      />
      <DeleteConfirmationModal
        isOpen={Boolean(deletingTask)}
        isSubmitting={isMutating}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteTask}
        task={deletingTask}
      />
    </main>
  );
};

export default DashboardPage;
