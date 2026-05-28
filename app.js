//req express
const express = require("express");

const http = require("http");
const { Server } = require("socket.io");

const { initSocket } = require("./utils/socket");

const app = express();

const server = http.createServer(app);

initSocket(server);

const path = require("path");

//data base
const { Connetion } = require("./Config/dbConfig");

//dotenv
const dotenv = require("dotenv").config();

//port
const port = process.env.PORT || 3000;

//cors
const cors = require("cors");

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Routes
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
Connetion();
