import mongoose, { Schema } from "mongoose"

const user = new Schema({
    username: { type:String,required:true,},
    password: { type:String,required:true },
    allTimeScore: { type:Number,default:0},
    currentScore: { type:Number, default:0 },
}, { timestamps:true })

const User = mongoose.model("user", user)

export default User