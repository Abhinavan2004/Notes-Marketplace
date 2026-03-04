"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const requireRole = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    return next();
};
exports.requireRole = requireRole;
