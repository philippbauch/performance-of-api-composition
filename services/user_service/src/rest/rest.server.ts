import cors from "cors";
import express from "express";
import { expressLogger } from "../logger";
import userApi from "./rest.api";

const app = express();

// Middleware
app.use(cors());
app.use(expressLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(userApi);

export default app;
