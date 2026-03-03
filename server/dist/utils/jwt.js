"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.signRefreshToken = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || '15m';
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || '7d';
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error('JWT secrets are not configured');
}
const signAccessToken = (user) => {
    const payload = {
        userId: user._id.toString(),
        role: user.role,
        tokenVersion: user.tokenVersion,
    };
    const options = { expiresIn: ACCESS_TOKEN_TTL };
    return jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_SECRET, options);
};
exports.signAccessToken = signAccessToken;
const signRefreshToken = (user) => {
    const payload = {
        userId: user._id.toString(),
        role: user.role,
        tokenVersion: user.tokenVersion,
    };
    const options = { expiresIn: REFRESH_TOKEN_TTL };
    return jsonwebtoken_1.default.sign(payload, REFRESH_TOKEN_SECRET, options);
};
exports.signRefreshToken = signRefreshToken;
const verifyAccessToken = (token) => {
    return jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, REFRESH_TOKEN_SECRET);
};
exports.verifyRefreshToken = verifyRefreshToken;
