import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Edit3,
  Trash2
} from "lucide-react";
import { formatDueDate, isOverdue } from "../utils/taskUtils.js";

const statusStyles = {
  pending: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 ring-amber-200",
  completed: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-emerald-200"
};

const TaskList = ({ isLoading, onDelete, onEdit, onToggleStatus, tasks }) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center text-slate-600 dark:text-slate-400 shadow-sm">
        Loading tasks...
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-8 text-center shadow-sm">
        <h2 className="text-xl font-bold tracking-normal text-slate-950 dark:text-white">No tasks yet</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Create your first task to start organizing work.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 lg:hidden">
        {tasks.map((task) => (
          <article key={task._id} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold tracking-normal text-slate-950 dark:text-white">
                  {task.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {task.description || "No description"}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${statusStyles[task.status]}`}
              >
                {task.status}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <CalendarDays className="h-4 w-4" />
              <span className={isOverdue(task) ? "font-semibold text-red-600" : ""}>
                {formatDueDate(task.dueDate)}
              </span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onToggleStatus(task)}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:bg-slate-700"
                aria-label="Toggle task status"
              >
                {task.status === "completed" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => onEdit(task)}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:bg-slate-700"
                aria-label="Edit task"
              >
                <Edit3 className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(task)}
                className="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-red-600 transition hover:bg-red-50"
                aria-label="Delete task"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </article>
        ))}
      </div>
      <div className="hidden overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm lg:block">
        <table className="w-full table-fixed">
          <thead className="bg-slate-100 dark:bg-slate-700 text-left text-sm text-slate-600 dark:text-slate-400">
            <tr>
              <th className="w-[34%] px-5 py-4 font-semibold">Task</th>
              <th className="w-[24%] px-5 py-4 font-semibold">Description</th>
              <th className="w-[14%] px-5 py-4 font-semibold">Due date</th>
              <th className="w-[14%] px-5 py-4 font-semibold">Status</th>
              <th className="w-[14%] px-5 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {tasks.map((task) => (
              <tr key={task._id} className="align-top">
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-950 dark:text-white">{task.title}</p>
                </td>
                <td className="px-5 py-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  <p className="line-clamp-2">{task.description || "No description"}</p>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
                  <span className={isOverdue(task) ? "font-semibold text-red-600" : ""}>
                    {formatDueDate(task.dueDate)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${statusStyles[task.status]}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(task)}
                      className="rounded-lg border border-slate-300 dark:border-slate-600 p-2 text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:bg-slate-700"
                      aria-label="Toggle task status"
                    >
                      {task.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(task)}
                      className="rounded-lg border border-slate-300 dark:border-slate-600 p-2 text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:bg-slate-700"
                      aria-label="Edit task"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(task)}
                      className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                      aria-label="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TaskList;
