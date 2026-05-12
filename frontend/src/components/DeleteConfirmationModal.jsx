import { Loader2, Trash2, X } from "lucide-react";

const DeleteConfirmationModal = ({ isOpen, isSubmitting, onClose, onConfirm, task }) => {
  if (!isOpen || !task) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 dark:bg-slate-950/80 px-4 py-6">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-slate-800 p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
                Delete task
              </p>
              <h2 className="text-xl font-bold tracking-normal text-slate-950 dark:text-white">
                Confirm deletion
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 dark:text-slate-400 dark:text-slate-500 transition hover:bg-slate-100 dark:bg-slate-700 hover:text-slate-900"
            aria-label="Close delete confirmation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-5 text-slate-700 dark:text-slate-300">
          Delete <span className="font-semibold text-slate-950 dark:text-white">{task.title}</span>? This
          action cannot be undone.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(task._id)}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Trash2 className="h-5 w-5" />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
