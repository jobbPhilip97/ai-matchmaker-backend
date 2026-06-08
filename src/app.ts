import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/users", userRoutes);