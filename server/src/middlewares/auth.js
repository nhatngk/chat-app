const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const ObjectId = require("mongoose").Types.ObjectId;
const Users = require("../models/User");
const { client } = require("../config/redis");
const secret = require("../config/env");

const decode = (token, key) => {
    try {
        return jwt.verify(token, key);
    } catch (error) {
        return false;
    }
}

const verifyAccessToken = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) throw createError(401, "Unauthorized");

        const decodedToken = decode(accessToken, secret.access_key);


        const userId = decodedToken?.userId;

        if (!ObjectId.isValid(userId)) throw createError(401, "Unauthorized");

        const user = await Users.findById(userId);

        if (!user) throw createError(401, "Unauthorized");

        req.user = user;

        next();

    } catch (error) {
        next(error);
    }
}


const verifyRefreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) throw createError(401, "Unauthorized");

        const decodedToken = decode(refreshToken, secret.refresh_key);

        const userId = decodedToken?.userId;

        if (!userId) throw createError(401, "Unauthorized");

        const token = await client.get(decodedToken?.userId);

        if (refreshToken !== token) throw createError(401, "Unauthorized");
        
        req.userId = userId;
        req.exp = decodedToken?.exp;
        next();
    } catch (error) {
        next(error);
    }
}


module.exports = {
    verifyAccessToken,
    verifyRefreshToken
}
