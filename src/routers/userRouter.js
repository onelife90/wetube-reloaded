import express from "express";
import {
  startGithubLogin,
  finishGithubLogin,
  logout,
  edit,
  see,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/:id", see);

export default userRouter;
