// =====================
// dotenv (لازم أول سطر)
// =====================
const dotenv = require("dotenv");
dotenv.config();

// =====================
// req express
// =====================
const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");

// =====================
// socket
// =====================
const { initSocket } = require("./utils/socket");

// =====================
// app + server
// =====================
const app = express();
const server = http.createServer(app);

// =====================
// DB connection
// =====================
const connectDB = require("./Config/dbConfig");

// =====================
// socket init
// =====================
initSocket(server);

// =====================
// TEST ENV (بعد dotenv)
// =====================
console.log("ENV TEST:", {
  MONGO_URI: process.env.MONGO_URI ? "OK" : "MISSING",
  PORT: process.env.PORT,
});

// =====================
// middlewares
// =====================
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =====================
// Routes
// =====================
app.use("/api/v1/auth", require("./Routes/AuthRoutes"));
app.use("/api/v1/post", require("./Routes/PostRoutes"));
app.use("/api/v1/chat", require("./Routes/ChatRoutes"));
app.use("/api/v1/message", require("./Routes/MessageRoutes"));
app.use("/api/v1/follow", require("./Routes/FollowRoutes"));
app.use("/api/v1/suggest", require("./Routes/SuggestRoutes"));
app.use("/api/v1/notifications", require("./Routes/NotificatioRoutes"));

// =====================
// DB connect (بعد dotenv)
// =====================
connectDB();

// =====================
// PORT
// =====================
const port = process.env.PORT || 3000;

// =====================
// server start
// =====================
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
