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

//express server
const app = express()
app.use(cors())
app.use(cookieParser())
const server = createServer(app)


// connectDB()
//socket
const io = new Server(server, {
    cors:{
        origin:"http://localhost:5173",
        methods:["POST","GET"]
    }
})

io.on("connection", (socket) => {
   roomSocket(io, socket)
   quizSocket(io, socket)
})

app.get("/", (req,res) => {
    res.send("hello world")
})

//user router
app.use("/api/v1/user", userRouter)
//rooms router
app.use("/api/v1/rooms", roomRouter)

server.listen(3000, () => {
    console.log(`server is running on http://localhost:3000`)
})