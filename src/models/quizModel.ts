import mongoose, { Schema } from "mongoose";

const quiz = new Schema({
    roomId:{ type:mongoose.Schema.Types.ObjectId, ref:"Room", required:true},
    startTime:{ type:Date, required:true},
    endTIme: { type:Date },
    highScore: { 
        userId: { type:String},
        score: { type:Number, default:0}
    }
}, { timestamps:true })

const Quiz = mongoose.model("quiz", quiz)

export default Quiz; 