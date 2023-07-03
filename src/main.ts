import express from "express";
import path from "path";

import dotenv from "dotenv";
dotenv.config();

import initializeClient from "./database/config";

import routes from "./routes";

initializeClient();

const app = express();

app.use(express.static(path.resolve(__dirname, "..", "uploads")));
app.use(express.json());
app.use(routes);

const port = process.env.PORT;
app.listen(port, () => console.log("Server listening on port " + port));
