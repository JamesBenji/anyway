import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port }); //creating a nextJS application
const handler = app.getRequestHandler();

app.prepare().then(() => {
  // creating a socket io server that shares the same server as nextJS
  const httpServer = createServer(handler);

  const io = new Server(httpServer);
  let onlineUsers = []; //optimize to db

  io.on("connection", (socket) => {
    // console.log('> client connected');
    socket.on("addNewUser", (clerkUser) => {
      if (
        clerkUser &&
        !onlineUsers.some((user) => user.userId === clerkUser.id)
      ) {
        onlineUsers.push({
          userId: clerkUser.id,
          socketId: socket.id,
          profile: clerkUser,
        });
        //   emit for to users after adding a new user
        io.emit("getUsers", onlineUsers);
      }
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
