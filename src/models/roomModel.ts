import mongoose, { Schema } from "mongoose"


const rooms = new Schema({
    name:{ type:String, required:true},
    members: [{ type:mongoose.Schema.Types.ObjectId, ref: "User"}],
    creator:{ type:mongoose.Schema.Types.ObjectId, ref:"User"},
    isActive: { type:Boolean, default:false },
},{ timestamps:true })

const Room = mongoose.model("rooms", rooms)

export default Room