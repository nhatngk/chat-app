const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const { Server } = require("socket.io");
const http = require("http");

const connectMongo = require("./config/mongodb");
const { connectRedis } = require("./config/redis");
const route = require("./routes/index");
const { onlineController, disconnecting } = require("./socket/connectionSocket");
const { addRequest, acceptRequest, deleteRequest, unfriend } = require("./socket/friendSocket");
const { sendMessage, typing } = require("./socket/messageSocket");
const errorHandling = require("./middlewares/errorHandling");
const secret = require("./config/env");

const launch = () => {
    const app = express();

    app.use(express.json({ "limit": "25mb" }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(cors({
        origin: secret.client_url,
        credentials: true,
    }));

    app.use("/api", route);
    app.use(errorHandling);

    const PORT = secret.port || 5000;

    const server = http.createServer(app);

    const io = new Server(server, {
        cors: {
            origin: secret.client_url,
            methods: ["GET", "POST"],
        }
    });

    server.listen(PORT, () => {
        console.log("Server is running on", PORT);
    });

    io.on('connection', (socket) => {
        onlineController(io, socket);
        sendMessage(io, socket);
        typing(io, socket);
        addRequest(io, socket);
        deleteRequest(io, socket);
        acceptRequest(io, socket);
        unfriend(io, socket);
        disconnecting(io, socket);
    });
}

(async () => {
    await connectMongo();
    await connectRedis();
    launch()
})();