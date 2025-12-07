import cors from "cors";
import express from "express";

import globalErrorHandler from "./middlewares/errors.js";
import userRoutes from "./routes/userRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);

app.all(/.*/, (req, res) => {
  return res
    .status(404)
    .json({ message: `Can't find ${req.originalUrl} on this server.` });
});

app.use(globalErrorHandler);

export default app;
