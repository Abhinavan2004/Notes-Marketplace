"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewController_1 = require("../controllers/reviewController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.requireAuth, reviewController_1.createOrUpdateReview);
router.get('/:noteId', reviewController_1.listReviewsForNote);
exports.default = router;
