import cors from "cors";
import express from "express";
import reviewApi from "./rest.api";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(reviewApi);

export default app;
