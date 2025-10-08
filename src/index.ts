import  express  from "express"
import { createServer } from "node:http"
import { Server } from "socket.io"
import cors  from "cors"
import connectDB from "./config/db"
import cookieParser from "cookie-parser"
import { userRouter } from "./routes/user.route"
import { roomRouter } from "./routes/room.route"
import { roomSocket } from "./sockets/room"
import { quizSocket } from "./sockets/quiz"
import { jwtVerify } from "jose"
import { corsOptions } from "./config/corOptions"
import { config } from "./config/config"

//secret for the token
const secret = new TextEncoder().encode(config.JWT_SECRET)

//express server
const app = express()

//for getting and sending json 
app.use(express.json())

//using cors
app.use(cors(corsOptions))

//for sending cookie
app.use(cookieParser())

//creating the server for the socket
const server = createServer(app)


// connectDB()
//socket
const io = new Server(server, {
    //making the  socket use cors
    cors:{
        origin:"http://localhost:5173",
        methods:["POST","GET"]
    }
})

//socket middleware to handle auth
io.use(async(socket, next) => {
    try{
        const token = socket.handshake.auth.token
        if(!token){
            return next(new Error("no token found"))
        }

        const { payload } = await jwtVerify(token, secret)

        socket.data.id = payload.id
        next()
    }catch(error){
        console.log(error)
    }
})


//the two need connection
io.on("connection", (socket) => {

    //Room socket for room join, leaving and rejoin
    roomSocket(io, socket)

    //Quiz socket for quiz starting, ending and scoring 
   quizSocket(io, socket)
})

//health route
app.get("/", (req,res) => {
    res.send("hello world")
})


//user router for authentication
app.use("/api/v1/user", userRouter)

//rooms router for room creation and getting all rooms
app.use("/api/v1/rooms", roomRouter)


//server starting point 
server.listen(3000, () => {
    console.log(`server is running on http://localhost:3000`)
})