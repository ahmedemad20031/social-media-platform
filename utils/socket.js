const { Server } = require("socket.io");
let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "https://social-media-platform-frontend-five.vercel.app",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("addUser", (userId) => {
      if (userId) {
        socket.join(userId.toString());
        console.log(`🏠 User [${userId}] joined their notification room.`);
      }
    });

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log("📦 joined chat room:", chatId);
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};

module.exports = {
  initSocket,
  getIO: () => io,
};
