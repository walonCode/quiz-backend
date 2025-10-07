import { Request, Response} from "express"
import Room from "../models/roomModel"

export async function createRoom(req:Request, res:Response){
    try{
        const { name } = req.body
        const id = req?.user?.id
        if(!name){
            return res.status(400).json({
                "ok":false,
                "message":"invalid data"
            })
        }

        const roomExist = await Room.findOne({ name })
        if(roomExist){
            return res.status(409).json({
                "ok":false,
                "message":"room already exist"
            })
        }

        const newRoom = new Room({
            name,
            creator:id
        })

        await newRoom.save()

        return res.status(201).json({
            "ok":false,
            "message":"room created",
            "data":newRoom
        })

    }catch(error){
        return res.status(500).json({
            "ok":false,
            "message":"internal server error"
        })
    }
}


export async function getAllRooms(req:Request, res:Response){
    try{
        const rooms = await Room.find({})
        if(rooms.length === 0){
            return res.status(200).json({
                'ok':true,
                "message":"no rooms at yets"
            })
        }

        return res.status(200).json({
            "ok":false,
            "message":"all created rooms",
            "data":rooms
        })
    }catch(err){
        return res.status(500).json({
            "ok":false,
            "message":"internal server error"
        })
    }
}