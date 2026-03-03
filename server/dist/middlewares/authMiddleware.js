"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jwt_1 = require("../utils/jwt");
const User_1 = require("../models/User");
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;
        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const payload = (0, jwt_1.verifyAccessToken)(token);
        const user = await User_1.User.findById(payload.userId);
        if (!user || user.tokenVersion !== payload.tokenVersion) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = { id: user.id, role: user.role };
        return next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
exports.requireAuth = requireAuth;
