"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.login = exports.verifyOtp = exports.signup = void 0;
const crypto_1 = __importDefault(require("crypto"));
const User_1 = require("../models/User");
const password_1 = require("../utils/password");
const email_1 = require("../utils/email");
const jwt_1 = require("../utils/jwt");
const OTP_EXPIRY_MINUTES = 5;
const setRefreshTokenCookie = (res, token) => {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'strict' : 'lax',
        path: '/api/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }
        const existing = await User_1.User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const hashed = await (0, password_1.hashPassword)(password);
        const otp = crypto_1.default.randomInt(100000, 999999).toString();
        const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
        const user = await User_1.User.create({
            name,
            email,
            password: hashed,
            isVerified: false,
            otpCode: otp,
            otpExpiresAt,
        });
        await (0, email_1.sendOtpEmail)(user.email, otp);
        return res.status(201).json({
            message: 'Signup successful, please verify OTP sent to your email',
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to sign up' });
    }
};
exports.signup = signup;
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }
        const user = await User_1.User.findOne({ email });
        if (!user || !user.otpCode || !user.otpExpiresAt) {
            return res.status(400).json({ message: 'No OTP found for this user' });
        }
        if (user.otpCode !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (user.otpExpiresAt.getTime() < Date.now()) {
            return res.status(400).json({ message: 'OTP has expired' });
        }
        user.isVerified = true;
        user.otpCode = undefined;
        user.otpExpiresAt = undefined;
        await user.save();
        return res.json({ message: 'Email verified successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to verify OTP' });
    }
};
exports.verifyOtp = verifyOtp;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User_1.User.findOne({ email });
        if (!user || !user.password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in' });
        }
        const isMatch = await (0, password_1.comparePassword)(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const accessToken = (0, jwt_1.signAccessToken)(user);
        const refreshToken = (0, jwt_1.signRefreshToken)(user);
        setRefreshTokenCookie(res, refreshToken);
        return res.json({
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to login' });
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
            return res.status(401).json({ message: 'No refresh token' });
        }
        const payload = (0, jwt_1.verifyRefreshToken)(token);
        const user = await User_1.User.findById(payload.userId);
        if (!user || user.tokenVersion !== payload.tokenVersion) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        const newAccessToken = (0, jwt_1.signAccessToken)(user);
        const newRefreshToken = (0, jwt_1.signRefreshToken)(user);
        setRefreshTokenCookie(res, newRefreshToken);
        return res.json({ accessToken: newAccessToken });
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid refresh token' });
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;
        if (token) {
            try {
                const payload = (0, jwt_1.verifyRefreshToken)(token);
                await User_1.User.findByIdAndUpdate(payload.userId, { $inc: { tokenVersion: 1 } });
            }
            catch {
                // ignore token errors on logout
            }
        }
        res.clearCookie('refreshToken', {
            path: '/api/auth/refresh',
        });
        return res.json({ message: 'Logged out successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to logout' });
    }
};
exports.logout = logout;
