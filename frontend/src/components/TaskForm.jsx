import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { getEmptyTaskForm, prepareTaskPayload, taskStatuses } from "../utils/taskUtils.js";

const TaskForm = ({ isSubmitting, onSubmit }) => {
  const [formData, setFormData] = useState(getEmptyTaskForm);
  const [errors, setErrors] = useState({});

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

    await onSubmit(prepareTaskPayload(formData));
    setFormData(getEmptyTaskForm());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm"
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <div>
          <label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Task title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-950 dark:text-white outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
            placeholder="Add a new task"
          />
          {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:w-80">
          <div>
            <label htmlFor="status" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Status
            </label>
            <select
              id="status"
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
            <label htmlFor="dueDate" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Due date
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-950 dark:text-white outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
            />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          className="mt-2 w-full resize-none rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-950 dark:text-white outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          placeholder="Optional notes"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
      >
        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
        Add task
      </button>
    </form>
  );
};

export default TaskForm;
