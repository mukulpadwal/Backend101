import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Form Data
// body-parser is now included in express. So, no need to install it separately
app.use(
  express.json({
    limit: "20kb",
  })
);

// Url Encoded Data
app.use(
  express.urlencoded({
    extended: true,
    limit: "20kb",
  })
);

// For storing and using static files
app.use(express.static("public"));

// For setting and using cookies
app.use(cookieParser());

// Routes Import
import userRouter from "./routes/user.routes.js";

// Routes Declaration
app.use("/api/v1/users", userRouter);

export default app;

// Notes for middlewrare
