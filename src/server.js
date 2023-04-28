import express from "express";
import morgan from "morgan";
import session from "express-session";
import { localsMiddleware } from "./middlewares";
import globalRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "Wetube!",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(localsMiddleware);

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
