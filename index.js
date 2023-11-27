import express from "express";
import { jwtSignIn } from "./jwt.js";
import { Server } from "socket.io";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
configDotenv();
import cors from "cors";
const app = express();
const httpServer = createServer(app);
app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.FRONTEND_ORIGIN],
    credentials: true,
    methods: ["GET", "POST"],
  })
);

const io = new Server(httpServer, {
  cors: {
    origin: [process.env.FRONTEND_ORIGIN],
    credentials: true,
    methods: ["GET", "POST"],
  },
  cookie: true,
});

app.get("/get-cookie", (req, res) => {
  console.log("reaching..");
  const jwtToken = jwtSignIn({ username: "raghu" });
  res.cookie("access_token", jwtToken, {
    maxAge: 36000000,
    secure: "true",
    httpOnly: "true",
  });
  res.json({ message: "works" });
});

const onConnections = (socket) => {
  console.log({ cookie: socket.handshake.headers.cookie });
};

io.on("connection", onConnections);

httpServer.listen(4000, () => {
  console.log("socket is listening on port 4000");
});
