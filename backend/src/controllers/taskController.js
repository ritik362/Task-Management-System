import mongoose from "mongoose";
import Task from "../models/Task.js";

const allowedStatuses = ["pending", "completed"];

const validateTaskInput = ({ title, status }) => {
  if (title !== undefined && title.trim().length < 2) {
    return "Title must be at least 2 characters long";
  }

  if (status !== undefined && !allowedStatuses.includes(status)) {
    return "Status must be either pending or completed";
  }

  return null;
};

const assertValidTaskId = (taskId, res) => {
  if (!mongoose.isValidObjectId(taskId)) {
    res.status(400);
    throw new Error("Invalid task id");
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description = "", status = "pending", dueDate = null } = req.body;
    const validationError = validateTaskInput({ title, status });

    if (!title) {
      res.status(400);
      throw new Error("Title is required");
    }

    if (validationError) {
      res.status(400);
      throw new Error(validationError);
    }

    const task = await Task.create({
      title,
      description,
      status,
      dueDate: dueDate || null,
      userId: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task
    });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = { userId: req.user._id };

    const tasks = await Task.find(query)
      .sort({
        status: -1,
        dueDate: 1,
        createdAt: -1
      })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(query);
    const completed = await Task.countDocuments({ ...query, status: "completed" });
    const pending = total - completed;

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
      pagination: {
        page,
        limit,
        total,
        completed,
        pending,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const validationError = validateTaskInput({ title, status });

    assertValidTaskId(req.params.id, res);

    if (validationError) {
      res.status(400);
      throw new Error(validationError);
    }

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    if (title !== undefined) {
      task.title = title;
    }

    if (description !== undefined) {
      task.description = description;
    }

    if (status !== undefined) {
      task.status = status;
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate || null;
    }

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    assertValidTaskId(req.params.id, res);

    if (!allowedStatuses.includes(status)) {
      res.status(400);
      throw new Error("Status must be either pending or completed");
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    assertValidTaskId(req.params.id, res);

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      taskId: req.params.id
    });
  } catch (error) {
    next(error);
  }
};
