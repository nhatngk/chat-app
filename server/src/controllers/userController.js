const createError = require("http-errors");
const Users = require("../models/User");
const secret = require("../config/env");
const sendEmail = require("../ultis/mailer");
const jwt = require("../ultis/jwt");
const { client } = require("../config/redis");

const signUp = async (req, res, next) => {
    try {
        const { email, username } = req.body;

        const checkEmailExist = await Users.findOne({ email });
        if (checkEmailExist) throw createError(400, "Email is already used.");

        const checkUsername = await Users.findOne({ username });
        if (checkUsername) throw createError(400, "Username is already used.");

        const newUser = new Users(req.body);

        await newUser.hashPassword();

        const token = newUser.generateVerifyToken();

        await newUser.save();

        const mailData = {
            from: secret.email_user,
            to: `${req.body.email}`,
            subject: "Active account",
            subject: "Verify your email",
            html: `<h2>Hello ${username}</h2>
            <p>Verify your email address to complete the signup and login into your <strong>Kanban</strong> account.</p>
      
            <p>This link will expire in <strong> 15 minute</strong>.</p>
              
            <p style="margin-bottom:20px;">Click this link for active your account</p>

            <a href="${secret.client_url}/email-verify/${token}" 
               style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;"
            >Verify Account</a>

            <p style="margin-top: 35px;"If you did not initiate this request, please contact us immediately at
            support@example.com</p>
              
            <p style="margin-bottom:0px;">Thank you.</p>
            <strong>Kanban Team</strong>`,
        };
        await sendEmail(res, mailData);
    } catch (err) {
        next(err);
    }
}

const verifyEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await Users.findOne({ email });
        if (!user) throw createError(404, "User not found!");

        const token = newUser.generateVerifyToken();

        await newUser.save();

        const mailData = {
            from: secret.email_user,
            to: `${email}`,
            subject: "Active account",
            subject: "Verify your email",
            html: `<h2>Hello ${user.username}</h2>
            <p>Verify your email address to complete the signup and login into your <strong>Kanban</strong> account.</p>
      
            <p>This link will expire in <strong> 15 minute</strong>.</p>
              
            <p style="margin-bottom:20px;">Click this link for active your account</p>

            <a href="${secret.client_url}/email-verify/${token}" 
               style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;"
            >Verify Account</a>

            <p style="margin-top: 35px;"If you did not initiate this request, please contact us immediately at
            support@example.com</p>
              
            <p style="margin-bottom:0px;">Thank you.</p>
            <strong>Kanban Team</strong>`,
        };

        const message = "Please check email to verify your account!";
        sendEmail(mailData, res, message);
    } catch (err) {
        next(err);
    }
}

const confirmEmail = async (req, res) => {
    try {
        const { token } = req.param;

        const user = await Users.findOne({ verifyToken: token });
        if (!user) throw createError(400, "Invalid verify token!");

        const expired = new Date() > new Date(user.verifyTokenExpires);
        if (expired) throw createError(400, "Token is expired");

        user.verified = true;
        user.verifyToken = null;
        user.verifyTokenExpires = null;

        await user.save({ validateBeforeSave: false });

        return res.status(200).json("Verify email successfully!")
    } catch (err) {
        next(err);
    }
}

const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email });

        if (!user) throw createError(400, "Email or password is incorrect");

        const match = await user.comparePassword(password);

        if (!match) throw createError(400, "Email or password is incorrect");

        const { id, email: userEmail, username, avatar, verified } = user.toObject();

        const userData = { id, email: userEmail, username, avatar, verified }

        const accessToken = jwt.generateAccessToken(user.id);

        const refreshToken = await jwt.generateRefreshToken(user.id);

        res.cookie(
            "accessToken",
            accessToken,
            {
                httpOnly: true,
                maxAge: secret.access_token_ttl * 1000
            }
        )

        res.cookie(
            "refreshToken",
            refreshToken,
            {
                httpOnly: true,
                maxAge: secret.refresh_token_ttl * 1000,
            }
        )
        return res.status(200).json({
            user: userData,
            message: "Login successfully"
        })

    } catch (err) {
        next(err);
    }
}

const signOut = async (req, res) => {
    try {
        client.del(req.user.id);
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(200).json({
            message: "Sign out successfully"
        })
    } catch (error) {
        next(error);
    }
}

const forgotPassword = async (req, res) => {
    try {
        res.send("Login successfully!");
    } catch (error) {
    }
}

const changePassword = async (req, res) => {
    try {
        res.send("Login successfully!");
    } catch (error) {
    }
}

const resetPassword = async (req, res) => {
    try {
        res.send("Login successfully!");
    } catch (error) {
    }
}

const getMe = async (req, res, next) => {
    try {
        const user = req.user;
        const { _id: id, email, username, avatar, verified } = user.toObject();

        const userData = { id, email, username, avatar, verified };

        return res.status(200).json({
            user: userData
        })
    } catch (error) {
        next(error);
    }
}

const refreshToken = async (req, res) => {
    try {
        const { userId, exp } = req;

        const accessToken = jwt.generateAccessToken(userId);

        const refreshToken = await jwt.generateRefreshToken(userId, exp);

        res.cookie(
            "accessToken",
            accessToken,
            {
                httpOnly: true,
                maxAge: secret.access_token_ttl * 1000
            }
        )

        res.cookie(
            "refreshToken",
            refreshToken,
            {
                httpOnly: true,
                expires: new Date(exp * 1000),
            }
        )

        return res.status(201).json({
            message: "Refresh successfully"
        })
    } catch (error) {
        next(error);
    }
}

const updateProfile = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
}

module.exports = {
    signUp,
    verifyEmail,
    confirmEmail,
    signIn,
    signOut,
    changePassword,
    forgotPassword,
    resetPassword,
    getMe,
    refreshToken,
    updateProfile
}