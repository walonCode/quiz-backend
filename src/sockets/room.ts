import { Server, Socket } from "socket.io";
import Room from "../models/roomModel";


export function roomSocket(io:Server, socket:Socket){
    socket.on("join room", async({ roomId}, cb) => {
        const room = await Room.findOne({ _id:roomId})
        if(!room){
            cb?.({ ok:false, error:"invalid room"})
        }
        if(!room?.members.includes(socket.data.id)){
            room?.members.push(socket.data.id)
        }

        socket.join(roomId)
        cb?.({ok:true})
        io.to(roomId).emit("player joined", room?.members)
    })

    socket.on("reconnect", async({ roomId }, cb) => {
        const room = await Room.findOne({ _id: roomId})
        if(!room || !room.members.includes(socket.data.id)){
            cb?.({ ok:false, error:"invalid room"})
        }

        socket.join(roomId)
        cb?.({ ok:true })
        io.to(roomId).emit("player is back", room?.members)
    })


    socket.on("leave room", async({ roomId }, cb) => {
        const room = await Room.updateOne({ _id:roomId}, { $pull: { members: socket.data.id}})
        if(!room){
            cb?.({ok:false, error:"invalid roomId"})
        }

        socket.leave(socket.data.id)
        io.to(roomId).emit("playerLeft", socket.data.userId);
        cb?.({ ok: true });
    })
}