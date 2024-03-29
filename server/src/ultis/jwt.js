const jwt = require("jsonwebtoken");
const secret = require("../config/env");
const { client } = require("../config/redis");

const getTimestampBySecond = () => {
    return Math.floor(Date.now() / 1000);
}


const generateAccessToken = (userId) => {
    try {
        return jwt.sign({userId}, secret.access_key, { expiresIn: secret.access_token_ttl});
    } catch (err) {
        throw new Error(err);
    }
}

const generateRefreshToken = async (userId,exp) => {
    try {
        if(!exp) exp = getTimestampBySecond() + secret.refresh_token_ttl;
        const refreshToken = jwt.sign({ userId, exp }, secret.refresh_key);
        await client.set(userId.toString(), refreshToken, {
            EXAT: exp
        });
        return refreshToken;
    } catch (err) {
        throw new Error(err);
    }
}


module.exports = {
    generateAccessToken,
    generateRefreshToken
}


