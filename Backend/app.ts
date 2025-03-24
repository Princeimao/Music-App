import cors from "cors";
import express, { json, urlencoded } from "express";

export const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("working");
});
