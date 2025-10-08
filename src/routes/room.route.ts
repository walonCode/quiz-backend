import { Router } from "express";
import { createRoom, getAllRooms } from "../controllers/room";
import { authMiddleware } from "../middleware/authMiddleware";

export const roomRouter = Router()

roomRouter.post("/",authMiddleware, createRoom)
roomRouter.get("/", getAllRooms)