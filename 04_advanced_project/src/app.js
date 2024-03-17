// express package to initialize the express server
import express from "express";

// cors package to resolve the cors issue from our backend
import cors from "cors";

// cookie-parser package to help us send and receive cookies in our app
import cookieParser from "cookie-parser";

// Here we are initializing our expressa app
const app = express();

// NOTE : .use() is used to use middleware to our entire express app

// Here we are using the cors as a middleware
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

// -----------------------------------------------------------------


// routes import 
import userRouter from "./routes/user.routes.js";

// routes declaration
// app.use('/users', userRouter);
// http://localhost:8080/users/register

// GOOD PRACTICE
app.use("/api/v1/users", userRouter);
// http://localhost:8080/api/v1/users/----


export default app;
