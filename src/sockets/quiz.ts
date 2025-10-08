import { Server, Socket } from "socket.io";
import Room from "../models/roomModel";
import Quiz from "../models/quizModel";
import { questions } from "../utils/questionAndAnswer";
import User from "../models/userModel";

let activeQuiz = {
    roomId:"",
    currentIndex:0
}

export async function quizSocket(io:Server, socket:Socket){
    socket.on("start quiz", async({ roomId}, cb) => {
        //finding the room and setting it to isActive
        const room = await Room.findByIdAndUpdate({ roomId}, { isActive:true })
        if(!room){
            cb?.({ ok:false, error:"Room not found"})
        }

        //starting the quiz 
        const newQuiz = new Quiz({
            roomId,
            startTime:Date.now()
        })

        await newQuiz.save()

        //starting the quiz
        activeQuiz = {
            roomId,
            currentIndex:0
        }

        //sending the question
        io.to(roomId).emit("quiz-started",{
            question: questions[0],
            questionsNumber: 1
        })

        cb?.({ok:true})
    })

    socket.on("answer", async({ roomId, answer, userId}, cb) => {{
        const room = await Room.findOne({ id: roomId})
        if(!room || !room.isActive){
            cb?.({ ok:false, error:"invalid room"})
        }

        const user = await User.findOne({ _id: userId})
        if(!user){
            cb?.({ ok:false, error:"no user found"})
        }

        const question = questions[activeQuiz.currentIndex]
        let score = 0 
        if(question.answer === answer){
            score = 10;
        }

        await User.updateOne({id:userId}, { $inc: { currentScore:score, allTimeScore:score}})

        const players = await User.find({_id: {$in: room?.members}})

        io.to(roomId).emit("leaderboard update", players.map(p => ({ username:p.username, score:p.currentScore})))
        cb?.({ ok:true})

        activeQuiz.currentIndex ++;

        if(activeQuiz.currentIndex < questions.length){
            io.to(roomId).emit("next-question", {
                question: questions[activeQuiz.currentIndex],
                questionNumber: activeQuiz.currentIndex + 1,
            })
            cb?.({ ok:true })
        }else {
            io.to(roomId).emit("quiz-ended", players.map(p => ({ username:p.username, score:p.currentScore})))
            await User.updateMany({ _id: { $in:room?.members}}, { currentScore:0})
            await Quiz.findOneAndUpdate({ roomId:roomId}, { endTIme:Date.now(), })
            cb?.({ok:true})
        }
    }})
}