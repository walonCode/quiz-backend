import mongoose, { Schema } from "mongoose"


export const rooms = new Schema({
    name:{ type:String, required:true},
    members: [{ type:mongoose.Schema.Types.ObjectId, ref: "User"}],
    creator:{ type:mongoose.Schema.Types.ObjectId, ref:"User"},
},{ timestamps:true })