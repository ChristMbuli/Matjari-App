import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import productRoute from "./routes/productRoute.js";
import authRoute from "./routes/authRoute.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use("/api/products", productRoute);
app.use("/api/auth", authRoute);

app.listen(1100, () => {
  console.log("server is running");
});
