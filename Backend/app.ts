import cookieParser from "cookie-parser";
import cors from "cors";
import express, { json, urlencoded } from "express";

export const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.get("/", (req, res) => {
  res.send("working");
});

import partyRouter from "./src/router/party.router";
import userRouter from "./src/router/user.router";

app.use("/api/user", userRouter);
app.use("/api/party", partyRouter);
