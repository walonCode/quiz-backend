import { Router } from "express";
import { createRoom, getAllRooms } from "../controllers/room";

export const roomRouter = Router()

roomRouter.post("/", createRoom)
roomRouter.get("/", getAllRooms)