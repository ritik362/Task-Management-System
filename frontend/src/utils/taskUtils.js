export const taskStatuses = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" }
];

export const getEmptyTaskForm = () => ({
  title: "",
  description: "",
  status: "pending",
  dueDate: ""
});

export const toDateInputValue = (date) => {
  if (!date) {
    return "";
  }

  return new Date(date).toISOString().slice(0, 10);
};

export const formatDueDate = (date) => {
  if (!date) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
};

export const isOverdue = (task) => {
  if (!task.dueDate || task.status === "completed") {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(task.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate < today;
};

export const prepareTaskPayload = (formData) => ({
  title: formData.title.trim(),
  description: formData.description.trim(),
  status: formData.status,
  dueDate: formData.dueDate || null
});
