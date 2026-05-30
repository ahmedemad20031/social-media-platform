const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv").config();

const connectDB = require("./Config/dbConfig");
const { initSocket } = require("./utils/socket");

const app = express();
const server = http.createServer(app);

// Socket
initSocket(server);

// PORT
const port = process.env.PORT || 5000;

/* =========================
   CORS FIX (IMPORTANT)
========================= */

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL, // frontend production URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow tools like Postman or server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, true);
    },
    credentials: true,
  }),
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   STATIC FILES
========================= */
app.use("/uploads", express.static("uploads"));

/* =========================
   DB CONNECTION (SAFE)
========================= */
connectDB();

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* =========================
   ROUTES
========================= */
app.use("/api/v1/auth", require("./Routes/AuthRoutes"));
app.use("/api/v1/post", require("./Routes/PostRoutes"));
app.use("/api/v1/chat", require("./Routes/ChatRoutes"));
app.use("/api/v1/message", require("./Routes/MessageRoutes"));
app.use("/api/v1/follow", require("./Routes/FollowRoutes"));
app.use("/api/v1/suggest", require("./Routes/SuggestRoutes"));
app.use("/api/v1/notifications", require("./Routes/NotificatioRoutes"));

/* =========================
   START SERVER
========================= */
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
