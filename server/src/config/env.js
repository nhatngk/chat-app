require("dotenv").config();

const secret = {
    port: process.env.PORT,

    mongo_uri: process.env.MONGODB_URI,

    redis_host: process.env.REDIS_HOST,
    redis_password: process.env.REDIS_PASSWORD,
    redis_port: process.env.REDIS_PORT,

    access_key: process.env.ACCESS_KEY,
    refresh_key: process.env.REFRESH_KEY,
    access_token_ttl: parseInt(process.env.ACCESS_TOKEN_TTL, 10),
    refresh_token_ttl: parseInt(process.env.REFRESH_TOKEN_TTL, 10),

        email_host: process.env.EMAIL_HOST,
        email_service: process.env.EMAIL_SERVICE,
        email_user: process.env.EMAIL_USER,
        email_pass: process.env.EMAIL_PASS,
        email_port: process.env.EMAIL_PORT,

        client_url: process.env.CLIENT_URL
}

module.exports = secret;