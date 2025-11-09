// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// const emailtosocketmapping = new Map()
// const sockettoemailmapping=new Map();
// const app = express();
// app.use(cors({
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST"]
// }));

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"]
//   }
// });

// io.on("connection", (socket) => {
//   console.log("User Connected:", socket.id);
//   socket.on("join-room",(data)=>{
//     const {email,roomId} =data
//     console.log(`user ${email} joined room ${roomId} `);
//     emailtosocketmapping.set(email,socket.id)
//     sockettoemailmapping.set(socket.id,email)
//     socket.join(roomId)
//     socket.emit('joined-room',{roomId})
//     socket.broadcast.to(roomId).emit('user-joined',{email})
//   });

//   socket.on('call-user',(data)=>{
//     console.log("called");
    
//     const {email,offer} = data
//     const fromEmail = sockettoemailmapping.get(socket.id)
//     const socketId= emailtosocketmapping.get(email)
//     socket.to(socketId).emit('incomming-call',{email:fromEmail,offer})

//   })

//   socket.on("call-accepted",(data)=>{
//     const {email,answer}=data
//     const socketId=emailtosocketmapping.get(email)
//     const femail=sockettoemailmapping.get(socket.id)
//     socket.to(socketId).emit("call-accepted",{answer,femail})
//   })


// });

// server.listen(7401, () => {
//   console.log("Socket server running on port 7401");
// });


const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// Maps to keep track of user <-> socket relationships
const emailtosocketmapping = new Map();
const sockettoemailmapping = new Map();

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User Connected:", socket.id);

  // When user joins a room
  socket.on("join-room", (data) => {
    const { email, roomId } = data;
    console.log(`👤 User ${email} joined room ${roomId}`);

    // Save mappings
    emailtosocketmapping.set(email, socket.id);
    sockettoemailmapping.set(socket.id, email);

    // Join socket room
    socket.join(roomId);

    // Notify the user
    socket.emit("joined-room", { roomId });

    // Notify others in room
    socket.broadcast.to(roomId).emit("user-joined", { email });
  });

  // When caller sends an offer
  socket.on("call-user", (data) => {
    const { email, offer } = data;
    const fromEmail = sockettoemailmapping.get(socket.id);
    const socketId = emailtosocketmapping.get(email);

    console.log(`📞 Call initiated from ${fromEmail} to ${email}`);

    if (socketId) {
      socket.to(socketId).emit("incomming-call", { email: fromEmail, offer });
    } else {
      console.warn(`⚠️ No socket found for ${email}`);
    }
  });

  // When receiver accepts the call
  socket.on("call-accepted", (data) => {
    const { email, answer } = data;
    const socketId = emailtosocketmapping.get(email);
    const femail = sockettoemailmapping.get(socket.id);

    console.log(`✅ Call accepted by ${femail}, sending answer to ${email}`);

    if (socketId) {
      socket.to(socketId).emit("call-accepted", { answer, femail });
    }
  });

  // ✅ Handle ICE candidate exchange
  socket.on("send-ice-candidate", (data) => {
    const { candidate, to } = data;
    const socketId = emailtosocketmapping.get(to);
    const fromEmail = sockettoemailmapping.get(socket.id);

    if (socketId && candidate) {
      console.log(`🌐 ICE candidate sent from ${fromEmail} → ${to}`);
      socket.to(socketId).emit("receive-ice-candidate", { candidate });
    }
  });

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    const email = sockettoemailmapping.get(socket.id);
    console.log("🔴 User disconnected:", socket.id, email);
    if (email) {
      emailtosocketmapping.delete(email);
    }
    sockettoemailmapping.delete(socket.id);
  });
});

// Start the signaling server
server.listen(7401, () => {
  console.log("🚀 Socket server running on port 7401");
});
