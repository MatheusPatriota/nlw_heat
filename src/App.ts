import express, { response } from "express";
import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import { router } from "./Routes";
import cors from "cors";

const app = express();
app.use(cors());

const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
  cors: {
    origin: "*",
  },
});

io.on("connection",socket => {
  console.log(`connection established on socket ${socket.id}`)
})

app.use(express.json());

app.use(router);

app.get("/github", (request, response) => {
  response.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  );
  console.log(process.env.GITHUB_CLIENT_ID);
});

app.get("/signin/callback", (request, response) => {
  const { code } = request.query;

  return response.json(code);
});

serverHttp.listen(4000, () => {
  console.log("🚀 server is running on port 4000");
});
