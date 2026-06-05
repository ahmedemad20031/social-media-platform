const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv").config();

const connectDB = require("./Config/dbConfig");

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "https://social-media-platform-frontend-five.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   2️⃣ SOCKET.IO CONFIG
========================= */
const io = require("socket.io")(server, {
  cors: {
    origin: "https://social-media-platform-frontend-five.vercel.app",

    credentials: true,
  },
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
});

/* =========================
   3️⃣ STATIC FILES & DB
========================= */
app.use("/uploads", express.static("uploads"));
connectDB();

/* =========================
   4️⃣ HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* =========================
   5️⃣ ROUTES
========================= */
app.use("/api/v1/auth", require("./Routes/AuthRoutes"));
app.use("/api/v1/post", require("./Routes/PostRoutes"));
app.use("/api/v1/chat", require("./Routes/ChatRoutes"));
app.use("/api/v1/message", require("./Routes/MessageRoutes"));
app.use("/api/v1/follow", require("./Routes/FollowRoutes"));
app.use("/api/v1/suggest", require("./Routes/SuggestRoutes"));
app.use("/api/v1/notifications", require("./Routes/NotificatioRoutes"));

/* =========================
   6️⃣ START SERVER
========================= */
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
