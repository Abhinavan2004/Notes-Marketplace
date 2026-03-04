"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analyticsController_1 = require("../controllers/analyticsController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
router.get('/seller', authMiddleware_1.requireAuth, (0, roleMiddleware_1.requireRole)('seller', 'both'), analyticsController_1.getSellerStats);
exports.default = router;
