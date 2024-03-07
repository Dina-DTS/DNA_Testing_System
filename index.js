process.on("uncaughtException", (err) => {
  console.log("error: ", err);
});

import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import connecttodb from "./db/connection.js";
import adminrouter from "./src/modules/Admin/routers/admin.router.js";
import labrouter from "./src/modules/Lab/routers/lab.router.js";
import technicalrouter from "./src/modules/Lab_Technical/routers/technical.router.js";
import { globalErrorHandling } from "./src/middlewares/asyncHandler.js";
import { AppError } from "./utilies/error.handler.js";
import populationrouter from "./src/modules/population/router/population.router.js"; 



dotenv.config();
const app = express();
const port = +process.env.PORT;
app.use(cors())

// Increase the limit for JSON payloads
app.use(express.json({ limit: '10mb' }));

// Increase the limit for URL-encoded payloads
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(adminrouter);
app.use(labrouter);
app.use(technicalrouter);
app.use(populationrouter)


app.use("*", (req, res, next) => {
  return next(
    new AppError(
      `the end point you are requesting: ${req.originalUrl} doesn't exist`,
      400
    )
  );
});

app.use(globalErrorHandling);

process.on("unhandledRejection", (err) => {
  console.log("error: ", err);
});

connecttodb();
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
