import { createServer } from "node:http";
import { Server } from "socket.io";

import express from "express";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
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
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
