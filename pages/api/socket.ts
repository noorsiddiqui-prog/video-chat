import { Server } from "socket.io";

const SocketHandler = (req: any, res: any, next: any) => {
  if (res.socket.server.io) {
    console.log("This socket is already running");
  } else {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("Sever is connected");
      socket.on("join-room", (roomId: string, userId: any) => {
        console.log(`a new user ${userId} joined room ${roomId} `);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-connected", userId);
      });

      socket.on("user-toggle-audio", (userId: any, roomId: any) => {
        console.log(`a user toggle audio ${userId} of  ${roomId} `);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-toggle-audio", userId);
      });

      socket.on("user-toggle-video", (userId: any, roomId: any) => {
        console.log(`a user toggle video ${userId} of  ${roomId} `);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-toggle-video", userId);
      });

      socket.on("user-leave", (userId: any, roomId: any) => {
        console.log(`a user left with ${userId} of  ${roomId} `);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-leave", userId);
      });
    });
  }
  res.end();
};

export default SocketHandler;
