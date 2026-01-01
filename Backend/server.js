import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from 'cors';
import express from "express";
import { configDotenv } from "dotenv";

configDotenv();
const app = express();
const server = createServer(app);

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

const ROOM='group'
app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
//   console.log(socket);
  console.log("a user connected", socket.id);

  socket.on('joinRoom',async (userName)=>{
    console.log(`${userName} is joining the group.`);
    await socket.join(ROOM);

    //send to all
    // io.to(ROOM).emit("roomNotice",userName);

    //broadcast 
    socket.to(ROOM).emit("roomNotice",userName);
    
  })

  socket.on('chatMessage',(msg)=>{
    //broadcast  
    console.log(msg);
    
    socket.to(ROOM).emit("chatMessage",msg);
  });

  socket.on('typing',(userName)=>{
    socket.to(ROOM).emit("typing",userName);

  })

  socket.on('stopTyping',(userName)=>{
    socket.to(ROOM).emit('stopTyping',userName);
  })
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`server running at ${PORT} Port`);
});
