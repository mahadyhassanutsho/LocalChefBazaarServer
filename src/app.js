import cors from "cors";
import express from "express";

import globalErrorHandler from "./middlewares/errors.js";
import { logRequest } from "./middlewares/logger.js";

import generalRoutes from "./routes/generalRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(logRequest);

// Routes
app.get("/", (_req, res) => {
  res.json({ message: "Welcome to LocalChefBazaar Server." });
});

app.use("/api", generalRoutes);

app.use("/api/users", userRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/requests", requestRoutes);

app.all(/.*/, (req, res) => {
  return res
    .status(404)
    .json({ message: `Can't find ${req.originalUrl} on this server.` });
});

app.use(globalErrorHandler);

export default app;
