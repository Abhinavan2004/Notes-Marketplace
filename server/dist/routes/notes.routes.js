"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const noteController_1 = require("../controllers/noteController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const router = (0, express_1.Router)();
router.get('/', noteController_1.listNotes);
router.get('/:id', noteController_1.getNoteById);
router.post('/', authMiddleware_1.requireAuth, uploadMiddleware_1.uploadPdfMiddleware.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'preview', maxCount: 1 },
]), noteController_1.createNote);
exports.default = router;
