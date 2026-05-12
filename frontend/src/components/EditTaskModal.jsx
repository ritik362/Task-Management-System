import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  prepareTaskPayload,
  taskStatuses,
  toDateInputValue
} from "../utils/taskUtils.js";

const EditTaskModal = ({ isOpen, isSubmitting, onClose, onSubmit, task }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    dueDate: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "pending",
        dueDate: toDateInputValue(task.dueDate)
      });
      setErrors({});
    }
  }, [task]);

  if (!isOpen || !task) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (formData.title.trim().length < 2) {
      nextErrors.title = "Title must be at least 2 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit(task._id, prepareTaskPayload(formData));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 dark:bg-slate-950/80 px-4 py-6">
      <div className="w-full max-w-lg rounded-lg bg-white dark:bg-slate-800 p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-400">
              Edit task
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-normal text-slate-950 dark:text-white">
              Update details
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 dark:text-slate-400 dark:text-slate-500 transition hover:bg-slate-100 dark:bg-slate-700 hover:text-slate-900"
            aria-label="Close edit modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="edit-title" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Task title
            </label>
            <input
              id="edit-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-950 dark:text-white outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
            />
            {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
          </div>
          <div>
            <label
              htmlFor="edit-description"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Description
            </label>
            <textarea
              id="edit-description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="mt-2 w-full resize-none rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-950 dark:text-white outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-status" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Status
              </label>
              <select
                id="edit-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-950 dark:text-white outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              >
                {taskStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="edit-dueDate" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Due date
              </label>
              <input
                id="edit-dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-950 dark:text-white outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
            </div>
          </div>
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
