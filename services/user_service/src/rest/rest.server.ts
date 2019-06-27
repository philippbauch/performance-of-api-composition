import cors from "cors";
import express from "express";
import userApi from "./rest.api";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userApi);

export default app;
