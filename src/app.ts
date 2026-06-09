import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import matchRoutes from "./routes/match.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/users", userRoutes);

app.use("/matches", matchRoutes);