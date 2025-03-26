import cookieParser from "cookie-parser";
import cors from "cors";
import express, { json, urlencoded } from "express";

export const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("working");
});

import userRouter from "./src/router/user.router";

app.use("/api/user", userRouter);
