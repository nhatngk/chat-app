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

        const newUser = new Users(req.body);

        await newUser.hashPassword();

        const token = await newUser.generateVerifyToken();

        await newUser.save();

        const mailData = {
            from: secret.email_user,
            to: `${req.body.email}`,
            subject: "Verify your email",
            html: `<h2>Hello ${username}</h2>
            <p>Verify your email address to complete the signup and login into your <strong>Chat App</strong> account.</p>
      
            <p>This link will expire in <strong> 15 minute</strong>.</p>
              
            <p style="margin-bottom:20px;">Click this link to active your account</p>

            <a href="${secret.client_url}/confirm-email/${token}" 
               style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;"
            >Verify Account</a>

            <p style="margin-top: 35px;"If you did not initiate this request, please contact us immediately at
            support@example.com</p>
              
            <p style="margin-bottom:0px;">Thank you.</p>
            <strong>Chat App</strong>`,
        };
        const message = "Sign up success! Please check your email to active your account.";
        await sendEmail(res, mailData, message);
    } catch (error) {
        next(error);
    }
}

const verifyEmail = async (req, res, next) => {
    try {
        const user =  req.user;
        if(user.verified) throw createError(400, "Your account is already verified!");
        const verifyToken = await user.generateVerifyToken();

        await user.save();

        const mailData = {
            from: secret.email_user,
            to: `${user.email}`,
            subject: "Verify your email",
            html: `<h2>Hello ${user.username}</h2>
            <p>Verify your email address to complete the signup and login into your <strong>Chat App</strong> account.</p>
      
            <p>This link will expire in <strong> 15 minute</strong>.</p>
              
            <p style="margin-bottom:20px;">Click this link to active your account</p>

            <a href="${secret.client_url}/confirm-email/${verifyToken}" 
               style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;"
            >Verify Account</a>

            <p style="margin-top: 35px;"If you did not initiate this request, please contact us immediately at
            support@example.com</p>
              
            <p style="margin-bottom:0px;">Thank you.</p>
            <strong>Chat App</strong>`,
        };

        const message = "Please check email to verify your account!";
        await sendEmail(res, mailData, message);
    } catch (err) {
        next(err);
    }
}

const confirmEmail = async (req, res, next) => {
    try {
        const verifyToken = req.params.token;
        const user = await Users.findOne({ verifyToken });
        if (!user) throw createError(400, "Invalid verify token!");

        const expired = new Date() > new Date(user.verifyTokenExpires);
        if (expired) throw createError(400, "Token is expired");

        user.verified = true;
        user.verifyToken = null;
        user.verifyTokenExpires = null;

        await user.save({ validateBeforeSave: false });

        return res.status(200).json({message: "Verify email successfully!"})
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
            message: "Sign in successfully"
        })

    } catch (err) {
        next(err);
    }
}

const signOut = async (req, res, next) => {
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

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await Users.findOne({ email });
        if (!user) throw createError(404, "Not found any account with this email!");

        const forgotPasswordToken = await user.generateForgotPasswordToken();
        
        await user.save();

        const mailData = {
            from: secret.email_user,
            to: `${email}`,
            subject: "Reset your password",
            html: `<h2>Hello ${user.username}</h2>
            <p>Reset your password <strong>Chat App</strong> account.</p>
      
            <p>This link will expire in <strong> 15 minute</strong>.</p>
              
            <p style="margin-bottom:20px;">Click this link to reset your password</p>

            <a href="${secret.client_url}/reset-password/${forgotPasswordToken}" 
               style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;"
            >Reset Your Password </a>

            <p style="margin-top: 35px;"If you did not initiate this request, please contact us immediately at
            support@example.com</p>
              
            <p style="margin-bottom:0px;">Thank you.</p>
            <strong>Chat App</strong>`,
        };

        const message = "Please check email to reset your password!";
        await sendEmail(res, mailData, message);

    } catch (error) {
        next(error);
    }
}

const changePassword = async (req, res, next) => {
    try {
        const user = req.user;
        const { password, newPassword } = req.body;

        const match = await user.comparePassword(password);
        if(!match) throw createError(400, "Password is incorrect");
        await user.hashPassword(newPassword);
        await user.save();
        res.status(200).json({message: "Change password successfully!"});
    } catch (error) {
        next(error);
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const forgotPasswordToken = req.params.token;
        const user = await Users.findOne({ forgotPasswordToken });
        if(!user) throw createError(404, "Invalid token!");

        const expired = new Date() > new Date(user.forgotPasswordTokenExpires);
        if (expired) throw createError(400, "Token is expired");

        const { newPassword } = req.body;
        user.forgotPasswordToken = null;
        user.forgotPasswordTokenExpires = null;
        await user.hashPassword(newPassword);
        await user.save();

        return res.status(200).json( {message: "Password resets successfully!"})
    } catch (error) {
        next(error);
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

const refreshToken = async (req, res, next) => {
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
        const user = req.user;
        const { username, avatar } = req.body;
        user.username = username;
        user.avatar = avatar;
        await user.save();
        res.status(200).json({message: "Update profile successfully!"});
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