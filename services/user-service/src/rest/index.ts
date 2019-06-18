import cors from "cors";
import express from "express";
import { expressLogger } from "../utils/logger";
import userApi from "./user.api";

const app = express();

// Middleware
app.use(cors());
app.use(expressLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(userApi);

export default app;
