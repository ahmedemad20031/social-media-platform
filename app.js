// req express
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { initSocket } = require("./utils/socket");
const path = require("path");
const cors = require("cors");

const dotenv = require("dotenv").config();

// database
const connectDB = require("./Config/dbConfig");

const app = express();
const server = http.createServer(app);

initSocket(server);

// port
const port = process.env.PORT || 3000;

const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV === "production"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Backend is running perfectly 🚀");
});

app.use("/api/v1/auth", require("./Routes/AuthRoutes"));
app.use("/api/v1/post", require("./Routes/PostRoutes"));
// app.use("/api/v1/user", require("./Routes/UserRoutes"));
app.use("/api/v1/chat", require("./Routes/ChatRoutes"));
app.use("/api/v1/message", require("./Routes/MessageRoutes"));
app.use("/api/v1/follow", require("./Routes/FollowRoutes"));
app.use("/api/v1/suggest", require("./Routes/SuggestRoutes"));
app.use("/api/v1/notifications", require("./Routes/NotificatioRoutes"));

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
