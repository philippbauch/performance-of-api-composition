import "antd/dist/antd.css";
import dotenv from "dotenv";
import React from "react";
import ReactDOM from "react-dom";
import App from "./core/App";

dotenv.config();

console.log(process.env);

ReactDOM.render(<App />, document.getElementById("root"));
