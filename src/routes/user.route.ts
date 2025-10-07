import { Router } from "express";
import { login, signup } from "../controllers/user";

export const userRouter = Router()

userRouter.post("/login", login)
userRouter.post("/signup", signup)