import express from "express";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import { apiCors, securityHeaders, apiRateLimiter } from "./middlewares/securityMiddleware.js";

const app = express();


app.use(apiCors);
app.use(securityHeaders);
app.use(apiRateLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Management API is running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/auth", (await import("./routes/profileRoutes.js")).default);
app.use("/api/tasks", taskRoutes);


app.use(notFound);
app.use(errorHandler);

export default app;
