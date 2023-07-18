import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";

import initializeClient from "./database/config";

import routes from "./routes";

initializeClient();

const app = express();

app.use(express.static(path.resolve(__dirname, "..", "uploads")));
app.use(express.json());
app.use(routes);

export default app;
