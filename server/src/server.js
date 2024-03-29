const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");

const connectMongo = require("./config/mongodb");
const { connectRedis } = require("./config/redis");
const route = require("./routes/index");
const errorHandling = require("./middlewares/errorHandling");
const secret = require("./config/env");

const launch = () => {
    const app = express();

    app.use(express.json({ "limit": "10mb" }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(cors({
        origin: secret.client_url,
        credentials: true,
    }));

    app.use("/api", route);
    app.use(errorHandling);

    const PORT = secret.port || 5000;
    app.listen(PORT, () => {
        console.log("Server is running on", PORT);
    })
}

(async () => {
    await connectMongo();
    await connectRedis();
    launch()
})();