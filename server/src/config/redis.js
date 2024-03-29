const createClient = require('redis').createClient;
const secret = require("../config/env");


const client = createClient({
    password: secret.redis_password,
    socket: {
        host: secret.redis_host,
        port: secret.redis_port
    }
});


const connectRedis = async () => {
    try {
        await client.connect();
        console.log("Connect to redis successfully");
    } catch (err) {
        console.log(err);
        process.exit(0);
    }
}

module.exports = {
    client,
    connectRedis
};